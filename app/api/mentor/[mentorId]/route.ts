import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, {params}: {params: {mentorId: string}}) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const {src, name, description, instructions, seed, categoryId} = body;

        if(!params.mentorId) {
            return new NextResponse("Mentor ID is required", { status: 400});
        }

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!src || !name || !description || !instructions || !seed || !categoryId){
            return new NextResponse("Missing required fleds", {status: 400});
        }

        //TODO Check subscription
        
        const mentor = await prismadb.mentor.update({
            where: {
                id: params.mentorId,
                userId: user.id
            },
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
        console.log("[MENTOR PATCH]", error);
        return new NextResponse("Internal Error", {status:500});
    }
}


export async function DELETE(
    request: Request,
    {params}: {params: {mentorId: string}}
) {
    try {
        const {userId} = auth();

        if(!userId) {
            return new NextResponse("unauthorize", {status: 401});
        }

        const mentor = await prismadb.mentor.delete({
            where: {
                userId,
                id: params.mentorId
            }
        });

        return NextResponse.json(mentor);

    } catch(error) {
        console.log("[MENTOR DELETE]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}