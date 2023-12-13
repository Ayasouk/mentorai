import dotenv from "dotenv";
import { StreamingTextResponse, LangChainStream } from "ai";
import {auth, currentUser} from "@clerk/nextjs";
import {CallbackManager} from "langchain/callbacks";
import {Replicate} from "langchain/llms/replicate";
import {NextResponse} from "next/server";

import {MemoryManager} from "@/lib/memory";
import {rateLimit} from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";

dotenv.config({path: `.env`});

export async function POST(
    request: Request,
    {params}: {params: {chatId: string}}
) {
    try {
        const {prompt} = await request.json();
        const user = await currentUser();

        if(!user || !user.firstName || !user.id) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const identifier = request.url + "-" + user.id;
        const {success} = await rateLimit(identifier);

        if(!success) {
            return new NextResponse("rate limit exceeded", {status: 429});
        }

        const mentor = await prismadb.mentor.update({
            where: {
                id: params.chatId,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id,
                    }
                }
            }
        })

        if (!mentor) {
            return new NextResponse("Mentor not found", {status: 404});
        }

        const name = mentor.id;
        const mentor_file_name = name +".txt";

        const mentorKey = {
            mentorName : name,
            userId: user.id,
            modelName: "llama2.13b",
        };


        const memoryManager = await MemoryManager.getInstance();

        const records = await memoryManager.readLatestHistory(mentorKey);

        if(records.length === 0) {
            await memoryManager.seedChatHistory(mentor.seed, "\n\n", mentorKey);
        }

        memoryManager.writeHistory("User: "+prompt+"\n", mentorKey);

        const recentChatHistory = await memoryManager.readLatestHistory(mentorKey);

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            mentor_file_name,
        );

        let relevantHistory = "";

        if(!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }

        const {handlers} = LangChainStream();

        const model = new Replicate({
            model: "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        model.verbose = true;

        const resp = String(
            await model.call(
                `
                Only generate plain sentences without prefix who is speaking. DO NOT use ${name}: prefix.
                
                ${mentor.instructions}

                Below are the relevant details about ${name}'s past and the conversation you are in.
                ${relevantHistory}

                ${recentChatHistory}\n${name}:
                `
            )
            .catch(console.error)
        );

        const cleaned = resp.replaceAll(",", "");
        const chunks = cleaned.split("\n");
        const response = chunks[0];

        await memoryManager.writeHistory("" + response.trim(), mentorKey);
        var Readable = require("stream").Readable;

        let s = new Readable();
        s.push(response);
        s.push(null);

        if(response !== undefined && response.length >1) {
            memoryManager.writeHistory("" + response.trim(), mentorKey);

            await prismadb.mentor.update({
                where: {
                    id: params.chatId,
                },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: "system",
                            userId: user.id
                        }
                    }
                }
            })
        }

        return new StreamingTextResponse(s);
    } catch(error) {
        console.log("[CHAT_POST]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}