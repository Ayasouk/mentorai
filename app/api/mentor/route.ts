import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const {src, name, description, instructions, seed, categoryId} = body;

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId){
            return new NextResponse("Missing required fleds", {status: 400});
        }

        //TODO Check subscription
        const isPro = await checkSubscription();

        if(!isPro) {
            return new NextResponse("Pro subscription required", {status: 403});
        }

        const mentor = await prismadb.mentor.create({
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed
            }
        })  

        return NextResponse.json(mentor);

    } catch(error) {
        console.log("[MENTOR POST]", error);
        return new NextResponse("Internal Error", {status:500});
    }
}