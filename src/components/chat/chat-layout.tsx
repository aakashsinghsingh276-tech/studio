
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreVertical,
  Phone,
  Search,
  Send,
  Settings,
  Star,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Chat } from "@/lib/data";
import { chats, loggedInUserId, users } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChatList } from "./chat-list";
import { ChatView } from "./chat-view";
import { StatusView } from "./status-view";
import { UserAvatar } from "./user-avatar";
import { ThemeSubMenu } from "../theme-toggle";
import { Input } from "../ui/input";

const me = users.find((u) => u.id === loggedInUserId);

function LeftPanel({
  activeTab,
  setActiveTab,
  onSelectChat,
  selectedChatId,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectChat: (chat: Chat) => void;
  selectedChatId: string | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="flex items-center justify-between border-b bg-card p-3">
        {me && <UserAvatar user={me} />}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">ChatOn</h1>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/avatar-studio">
                  <Star className="mr-2 h-4 w-4" />
                  <span>Avatar Studio</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/calls">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>Calls</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contacts">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Contacts</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <ThemeSubMenu />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="p-3">
        <div className="relative">
          <Input 
            placeholder="Search chats or contacts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <div className="p-3 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats">Chats</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {activeTab === "chats" ? (
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={onSelectChat}
          searchQuery={searchQuery}
        />
      ) : (
        <StatusView />
      )}
    </>
  );
}

export function ChatLayout() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);
  const [activeTab, setActiveTab] = useState("chats");

  return (
    <div className="flex h-screen w-full bg-background font-body text-sm">
      <div
        className={cn(
          "flex h-full flex-col border-r md:flex md:w-[380px]",
          selectedChat ? "hidden" : "w-full"
        )}
      >
        <LeftPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSelectChat={setSelectedChat}
          selectedChatId={selectedChat?.id || null}
        />
      </div>
      <div
        className={cn(
          "h-full flex-1 flex-col",
          selectedChat ? "flex" : "hidden md:flex"
        )}
      >
        {selectedChat ? (
          <ChatView chat={selectedChat} onBack={() => setSelectedChat(null)} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-secondary/50 text-center">
            <div className="rounded-full bg-primary/20 p-6">
              <div className="rounded-full bg-primary/40 p-4">
                <Send className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Welcome to ChatOn</h2>
            <p className="max-w-sm text-muted-foreground">
              Select a chat to start messaging. Your conversations are secure
              and private.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
