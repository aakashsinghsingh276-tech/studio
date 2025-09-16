
"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import type { Message } from "@/lib/data";
import { loggedInUserId } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

type MessageListProps = {
  messages: Message[];
  onDeleteMessage: (messageId: string) => void;
};

export function MessageList({ messages, onDeleteMessage }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 bg-secondary/30" ref={scrollAreaRef}>
      <div className="p-4 space-y-1">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSender={message.senderId === loggedInUserId}
              onDelete={() => onDeleteMessage(message.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <div className="relative w-48 h-48 mb-4">
              <Image src="https://picsum.photos/seed/chat/300/300" alt="Start chatting" fill className="rounded-full" data-ai-hint="friendly illustration" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Start a Conversation</h3>
            <p>No messages here yet. Send a message to get things started!</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
