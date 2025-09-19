
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Palette,
  Phone,
  Search,
  Send,
  Settings,
  Star,
  Users,
  UserPlus,
  LogOut,
  MessageSquare,
  Users2,
  PhoneCall,
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
import type { Chat } from "@/lib/data";
import { chats as initialChats, loggedInUserId, users, stories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChatList } from "./chat-list";
import { UserAvatar } from "./user-avatar";
import { Input } from "../ui/input";
import { ThemeSubMenu } from "../theme-toggle";
import { ChatView } from "./chat-view";
import { StatusView } from "./status-view";

const me = users.find((u) => u.id === loggedInUserId);

type NavLinkProps = {
  name: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
};

const NavLink = ({ name, icon: Icon, isActive, onClick }: NavLinkProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 w-full p-2 rounded-lg transition-colors",
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
    )}
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs font-medium">{name}</span>
  </button>
);


function LeftPanel({
  onSelectChat,
  selectedChatId,
  chats,
}: {
  onSelectChat: (chat: Chat) => void;
  selectedChatId: string | null;
  chats: Chat[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Chats");


  const handleLogout = () => {
    localStorage.removeItem("auth-step");
    router.push("/login");
  };

  return (
    <>
      <header className="flex items-center justify-between border-b bg-card p-3">
        {me && <UserAvatar user={me} withStatus />}
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
                <Link href="/new/group">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>New Group</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/avatar-studio">
                  <Star className="mr-2 h-4 w-4" />
                  <span>Avatar Studio</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contacts">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Contacts</span>
                </Link>
              </DropdownMenuItem>
               <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="mr-2 h-4 w-4" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <ThemeSubMenu />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
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
      
      {/* Main content area for the left panel */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "Chats" && (
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={onSelectChat}
            searchQuery={searchQuery}
          />
        )}
        {activeTab === "Status" && <StatusView />}
        {activeTab === "Calls" && (
           <div className="p-4">
             <Link href="/calls" className="w-full">
              <Button variant="outline" className="w-full">View Call Log</Button>
            </Link>
           </div>
        )}
      </div>

       {/* Bottom Navigation */}
      <nav className="flex items-center justify-around p-2 border-t">
        <NavLink
          name="Chats"
          icon={MessageSquare}
          isActive={activeTab === "Chats"}
          onClick={() => setActiveTab("Chats")}
        />
        <NavLink
          name="Status"
          icon={Users2}
          isActive={activeTab === "Status"}
          onClick={() => setActiveTab("Status")}
        />
        <NavLink
          name="Calls"
          icon={PhoneCall}
          isActive={activeTab === "Calls"}
          onClick={() => setActiveTab("Calls")}
        />
      </nav>
    </>
  );
}

export function ChatLayout() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    // Mark chat as read
    setChats(prevChats => 
      prevChats.map(c => 
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };
  
  // Set the first chat as selected by default if it exists.
  useState(() => {
    if (initialChats.length > 0 && !selectedChat) {
      handleSelectChat(initialChats[0]);
    }
  });


  return (
    <div className="flex h-screen w-full bg-background font-body text-sm">
      <div
        className={cn(
          "flex h-full flex-col border-r md:flex md:w-[380px]",
          selectedChat ? "hidden" : "w-full"
        )}
      >
        <LeftPanel
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChat?.id || null}
          chats={chats}
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
