"use client";

import { cn } from "@/lib/utils";
import { type Chat, type User, users, loggedInUserId } from "@/lib/data";
import { UserAvatar } from "./user-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";

type ChatListProps = {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
};

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  const getChatPartner = (chat: Chat): User => {
    const partnerId = chat.participants.find(p => p !== loggedInUserId);
    return users.find(u => u.id === partnerId) || users[0];
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-1 p-2">
        {chats.map((chat) => (
          <button
            key={chat.id}
            className={cn(
              "flex items-center gap-3 rounded-lg p-3 text-left text-sm transition-all hover:bg-secondary",
              selectedChatId === chat.id && "bg-secondary font-semibold"
            )}
            onClick={() => onSelectChat(chat)}
          >
            <UserAvatar user={getChatPartner(chat)} withStatus />
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="truncate">{getChatPartner(chat).name}</p>
                <p className="text-xs text-muted-foreground">
                  {chat.messages[chat.messages.length - 1]?.timestamp}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="truncate text-xs text-muted-foreground">
                  {chat.messages[chat.messages.length - 1]?.content}
                </p>
                {chat.unreadCount > 0 && (
                  <Badge variant="default" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-0">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
