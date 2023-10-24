"use client";
import { Mentor, Message } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "@/components/chat-message";
import { ElementRef, useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
    mentor: Mentor;
    messages: ChatMessageProps[];
    isLoading: boolean;
}

const ChatMessages = ({mentor, messages, isLoading}:ChatMessagesProps) => {
    const scrollRef = useRef<ElementRef<"div">>(null);

    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);

    useEffect(() => {
        const timeout = setTimeout(()=>{
            setFakeLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, []);

    useEffect(()=>{
        scrollRef?.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages.length]);

    return (
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage isLoading={fakeLoading} src={mentor.src} role="system" content={`Hello, I am ${mentor.name}, ${mentor.description} `}/>
            {messages.map((message) => (
                <ChatMessage 
                    key={message.content}
                    role={message.role}
                    content={message.content}
                    src={mentor.src}
                />
            ))}
            { isLoading && (
                <ChatMessage
                    role="system"
                    src={mentor.src}
                    isLoading
                />
            )}
            <div ref={scrollRef}/>
        </div>
    )
}

export default ChatMessages;