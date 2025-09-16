"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Lock,
} from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { cn } from "@/lib/utils";
import type { Chat, User, Message as MessageType } from "@/lib/data";
import { users, loggedInUserId } from "@/lib/data";

type ChatViewProps = {
  chat: Chat;
  onBack: () => void;
};

export function ChatView({ chat, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<MessageType[]>(chat.messages);

  const getChatPartner = (chat: Chat): User => {
    const partnerId = chat.participants.find((p) => p !== loggedInUserId);
    return users.find((u) => u.id === partnerId) || users[0];
  };

  const partner = getChatPartner(chat);

  const handleSendMessage = (message: string) => {
    const newMessage: MessageType = {
      id: `msg${Date.now()}`,
      chatId: chat.id,
      senderId: loggedInUserId,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Header */}
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <UserAvatar user={partner} withStatus />
        <div className="flex-1">
          <p className="font-semibold">{partner.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Message List */}
      <MessageList messages={messages} />

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        lastMessage={messages[messages.length - 1]}
      />
    </div>
  );
}
