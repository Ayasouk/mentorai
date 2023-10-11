import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { ChatClient } from "./components/client";

interface ChatIdPageProps {
    params: {
        chatId: string
    }
}

const ChatIdPage = async ({params}: ChatIdPageProps) =>{
    const {userId} = auth();

    if(!userId) {
        return redirectToSignIn();
    }

    const mentor = await prismadb.mentor.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                where: {
                    userId,
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    if(!mentor) {
        return redirect("/");
    }


    return (
        <ChatClient mentor={mentor}/>
    )
}

export default ChatIdPage;