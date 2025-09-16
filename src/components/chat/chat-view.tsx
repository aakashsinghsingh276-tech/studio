
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Lock,
  Trash2,
} from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { cn } from "@/lib/utils";
import type { Chat, User, Message as MessageType, Attachment } from "@/lib/data";
import { users, loggedInUserId } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChatViewProps = {
  chat: Chat;
  onBack: () => void;
};

export function ChatView({ chat, onBack }: ChatViewProps) {
  const [messages, setMessages] = useState<MessageType[]>(chat.messages);

  const partner: User | undefined =
    chat.type === "private"
      ? users.find((u) => u.id === chat.participants.find(p => p !== loggedInUserId))
      : undefined;

  const chatName = chat.type === "group" ? chat.name : partner?.name;
  const chatAvatar = chat.type === 'group' ? 
    { id: 'group', name: chat.name || 'Group', avatar: chat.avatar || 'group-placeholder', status: 'offline' } as User :
    partner!;

  const handleSendMessage = (content: string, attachment?: Attachment) => {
    const newMessage: MessageType = {
      id: `msg${Date.now()}`,
      chatId: chat.id,
      senderId: loggedInUserId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      attachment,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat Header */}
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <UserAvatar user={chatAvatar} withStatus={chat.type === 'private'} />
        <div className="flex-1">
          <p className="font-semibold">{chatName}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {chat.type === 'private' ? (
                <>
                    <Lock className="h-3 w-3" />
                    <span>End-to-end encrypted</span>
                </>
            ) : (
                <span className="truncate">{chat.participants.map(p => users.find(u => u.id === p)?.name).join(', ')}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/video/${chat.id}`}>
              <Video className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/audio/${chat.id}`}>
              <Phone className="h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Clear Chat</DropdownMenuItem>
              <DropdownMenuItem>Block</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Message List */}
      <MessageList messages={messages} onDeleteMessage={handleDeleteMessage} />

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        lastMessage={messages[messages.length - 1]}
      />
    </div>
  );
}
