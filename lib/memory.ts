import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
//import { PineconeClient } from "@pinecone-database/pinecone";
import {Pinecone} from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type MentorKey =  {
    mentorName: string;
    modelName: string;
    userId: string;
}

export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: Pinecone;

    public constructor(){
        this.history = Redis.fromEnv();
        this.vectorDBClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
            environment: process.env.PINECONE_ENVIRONMENT!,
        });
    }

    public async init() {
        /*if(this.vectorDBClient instanceof Pinecone) {
            await this.vectorDBClient.init({
                apiKey: process.env.PINECONE_API_KEY!,
                environment: process.env.PINECONE_ENVIRONMENT!,
            });
        }*/
    }

    public async vectorSearch(
        recentChatHistory: string,
        mentorFileName: string
    ) {
        const pineconeClient = <Pinecone>this.vectorDBClient;

        const pineconeIndex = pineconeClient.index(
            process.env.PINECONE_INDEX! || ""
        )

        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY}),
            {pineconeIndex}
        );

        const similarDocs = await vectorStore.similaritySearch(recentChatHistory, 3, { fileName: mentorFileName})
                                            .catch((err)=>{
                                                console.log("Failed to get vector search results", err);
                                            });

        return similarDocs;
    }

    public static async getInstance(): Promise<MemoryManager> {
        if(!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
            await MemoryManager.instance.init();
        }

        return MemoryManager.instance;
    }


    private generateRedisMentorKey(mentorKey: MentorKey): string {
        return `${mentorKey.mentorName}-${mentorKey.modelName}-${mentorKey.userId}`
    }

    public async writeHistory(text: string, mentorKey: MentorKey) {
        if(!mentorKey || typeof mentorKey.userId == "undefined") {
            console.log("Mentor key set incorrectly");
            return "";
        }

        const key = this.generateRedisMentorKey(mentorKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        });

        return result;
    }

    public async readLatestHistory(mentorKey: MentorKey): Promise<string> {
        if(!mentorKey || typeof mentorKey.userId == "undefined") {
            console.log("mentor key set incorrectly");
            return "";
        }

        const key = this.generateRedisMentorKey(mentorKey);
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        });

        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join("\n");
        return recentChats;
    }

    public async seedChatHistory(
        seedContent: string,
        delimiter: string = "\n",
        mentorKey: MentorKey
    ) {
        const key = this.generateRedisMentorKey(mentorKey);

        if(await this.history.exists(key)) {
            console.log("user already has chat history");
            return;
        }

        const content = seedContent.split(delimiter);
        let counter = 0;

        for (const line of content) {
            await this.history.zadd(key, { score: counter, member: line});
            counter +=1;
        }
    }

}