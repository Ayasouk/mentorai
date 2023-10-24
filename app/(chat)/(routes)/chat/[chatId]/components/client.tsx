"use client";

import { Mentor, Message } from "@prisma/client";
import { ChatHeader } from "@/components/chat-header";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {useCompletion} from "ai/react";
import { ChatForm } from "@/components/chat-form";
import ChatMessages from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";

interface ChatClientProps {
    mentor: Mentor & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
}

export const ChatClient =  ({mentor}:ChatClientProps) => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageProps[]>(mentor.messages);

    const {input, isLoading, handleInputChange, handleSubmit, setInput} = useCompletion({api: `/api/chat/${mentor.id}`, onFinish(prompt, completion) {
        const systemMessage:ChatMessageProps = {
            role: "system",
            content: completion,
        };

        setMessages((current)=> [...current, systemMessage]);
        setInput("");

        router.refresh();
    }});

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        const userMessage:ChatMessageProps = {
            role: "user",
            content: input
        }

        setMessages((current)=> [...current, userMessage]);

        handleSubmit(e);
    }

    return (
        <div className="flex flex-col overflow-y-auto h-full p-4 space-y-2">
            <ChatHeader mentor={mentor} />
            <div>
                <ChatMessages mentor={mentor} isLoading={isLoading} messages={messages}/>
                <ChatForm
                    isLoading={isLoading}
                    input={input}
                    handleInputChange={handleInputChange}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}