
"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { type Chat, type User, users, loggedInUserId } from "@/lib/data";
import { UserAvatar } from "./user-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";

type ChatListProps = {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
  searchQuery: string;
};

export function ChatList({ chats, selectedChatId, onSelectChat, searchQuery }: ChatListProps) {
  
  const getChatInfo = (chat: Chat) => {
    if (chat.type === 'group') {
      return {
        name: chat.name || 'Unnamed Group',
        avatarUser: { id: 'group', name: chat.name || 'G', avatar: chat.avatar || 'group-placeholder', status: 'offline' } as User
      };
    }
    const partner = users.find(u => u.id === chat.participants.find(p => p !== loggedInUserId)) || users[0];
    return { name: partner.name, avatarUser: partner };
  };

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter(chat => {
      const { name } = getChatInfo(chat);
      const lastMessage = chat.messages[chat.messages.length - 1];
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lastMessage && lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [chats, searchQuery]);

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-1 p-2">
        {filteredChats.map((chat) => {
          const { name, avatarUser } = getChatInfo(chat);
          return (
          <button
            key={chat.id}
            className={cn(
              "flex items-center gap-3 rounded-lg p-3 text-left text-sm transition-all hover:bg-secondary",
              selectedChatId === chat.id && "bg-secondary font-semibold"
            )}
            onClick={() => onSelectChat(chat)}
          >
            <UserAvatar user={avatarUser} withStatus={chat.type === 'private'} />
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="truncate">{name}</p>
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
        )})}
        {filteredChats.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
            <p className="font-semibold">No chats found</p>
            <p className="text-sm">Try a different search term.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
