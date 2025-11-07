
"use client";

import {
  Phone,
  Video,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { type User } from "@/lib/data";
import { UserAvatar } from "./user-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { chats } from "@/lib/data";

type ContactListProps = {
  users: User[];
};

export function ContactList({ users }: ContactListProps) {

  const findChatIdByUser = (userId: string) => {
    const chat = chats.find(c => c.type === 'private' && c.participants.includes(userId));
    return chat ? chat.id : null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const chatId = findChatIdByUser(user.id);
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user.status}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell capitalize">
                     {user.status}
                  </TableCell>
                   <TableCell className="text-right">
                      <div className="inline-flex">
                       <Button variant="ghost" size="icon" asChild>
                           <Link href={chatId ? `/video/${chatId}` : "#"}>
                                <Video className="h-5 w-5 text-muted-foreground" />
                           </Link>
                       </Button>
                       <Button variant="ghost" size="icon" asChild>
                           <Link href={chatId ? `/audio/${chatId}` : "#"}>
                                <Phone className="h-5 w-5 text-muted-foreground" />
                           </Link>
                       </Button>
                       <Button variant="ghost" size="icon" asChild>
                           <Link href={chatId ? `/` : "#"} >
                               <MessageSquare className="h-5 w-5 text-muted-foreground" />
                           </Link>
                       </Button>
                      </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
