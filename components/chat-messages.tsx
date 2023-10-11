"use client";
import { Mentor, Message } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "@/components/chat-message";
import { useEffect, useState } from "react";

interface ChatMessagesProps {
    mentor: Mentor;
    messages: ChatMessageProps[];
    isLoading: boolean;
}

const ChatMessages = ({mentor, messages=[], isLoading}:ChatMessagesProps) => {
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setFakeLoading(false);
        }, 1000);

        return ()=>{
            clearTimeout(timeout);
        }
    }, []);

    return (
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage src={mentor.src} role="system" content={`Hello, I am ${mentor.name}, ${mentor.description} `}/>
        </div>
    )
}

export default ChatMessages;