
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, Users as GroupIcon, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/chat/user-avatar";
import { useToast } from "@/hooks/use-toast";
import { users, loggedInUserId, type User, chats, type Chat } from "@/lib/data";
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NewGroupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupAvatar, setGroupAvatar] = useState("");

  const contacts = users.filter((user) => user.id !== loggedInUserId);

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleCreateGroup = () => {
    if (selectedUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "No members selected",
        description: "Please select at least one member for the group.",
      });
      return;
    }
    if (!groupName.trim()) {
      toast({
        variant: "destructive",
        title: "Group name is required",
        description: "Please enter a name for your group.",
      });
      return;
    }

    const newGroup: Chat = {
      id: `chat_${uuidv4()}`,
      type: "group",
      participants: [loggedInUserId, ...selectedUsers.map((u) => u.id)],
      messages: [
        {
          id: `msg_${uuidv4()}`,
          chatId: `chat_${uuidv4()}`, // Will be replaced by actual chatId
          senderId: loggedInUserId,
          content: `${users.find(u => u.id === loggedInUserId)?.name} created the group "${groupName}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        },
      ],
      unreadCount: 0,
      name: groupName,
      avatar: groupAvatar || 'group-placeholder',
    };
    newGroup.messages[0].chatId = newGroup.id;
    
    // In a real app, this would be sent to a server.
    // For this demo, we'll prepend it to the existing chats array.
    chats.unshift(newGroup);

    toast({
      title: "Group Created!",
      description: `The group "${groupName}" has been successfully created.`,
    });
    router.push("/");
  };
  
  const me = users.find(u => u.id === loggedInUserId)!;
  const isSelected = (user: User) => selectedUsers.some((u) => u.id === user.id);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div>
            <h1 className="text-xl font-bold">New Group</h1>
            <p className="text-sm text-muted-foreground">{selectedUsers.length} members selected</p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 md:p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Group Info</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                    {groupAvatar ? 
                        <Image src={groupAvatar} alt="Group Avatar" width={64} height={64} className="rounded-full object-cover" /> :
                        <GroupIcon className="h-8 w-8 text-muted-foreground" />
                    }
                </div>
                 {/* This is a placeholder for an avatar upload component */}
                <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full" onClick={() => toast({title: "Coming Soon!", description:"Avatar uploads will be enabled soon."})}>
                    <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="text-lg"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Select Members</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64">
                    <div className="space-y-1">
                        {contacts.map((user) => (
                            <div
                            key={user.id}
                            className={cn("flex items-center gap-3 rounded-lg p-2 text-left text-sm transition-all cursor-pointer hover:bg-secondary", isSelected(user) && "bg-secondary")}
                            onClick={() => handleUserSelect(user)}
                            >
                                <UserAvatar user={user} />
                                <span className="flex-1 font-medium">{user.name}</span>
                                {isSelected(user) && <CheckCircle2 className="h-5 w-5 text-primary" />}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
          </Card>
          
          <Button onClick={handleCreateGroup} size="lg" className="w-full">
            <Check className="mr-2" />
            Create Group
          </Button>
        </div>
      </main>
    </div>
  );
}
