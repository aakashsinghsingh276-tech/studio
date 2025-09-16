
"use client";

import {
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video,
  Phone,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Call, type User } from "@/lib/data";
import { UserAvatar } from "./user-avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type CallListProps = {
  calls: Call[];
  users: User[];
};

const callTypeIcons = {
  incoming: PhoneIncoming,
  outgoing: PhoneOutgoing,
  missed: PhoneMissed,
};

const callTypeActions = {
  incoming: ArrowDownLeft,
  outgoing: ArrowUpRight,
  missed: ArrowDownLeft,
};

export function CallList({ calls, users }: CallListProps) {
  const getUserById = (userId: string) => users.find((u) => u.id === userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="text-right">Time</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calls.map((call) => {
              const user = getUserById(call.userId);
              if (!user) return null;

              const CallTypeIcon = callTypeIcons[call.type];
              const CallActionIcon = callTypeActions[call.type];

              return (
                <TableRow key={call.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CallActionIcon
                            className={cn(
                              "h-3 w-3",
                              call.type === "missed" && "text-destructive"
                            )}
                          />
                          <span className="text-xs">{call.type}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={
                        call.type === "missed" ? "destructive" : "outline"
                      }
                      className="capitalize"
                    >
                      {call.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {call.duration || "N/A"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {call.timestamp}
                  </TableCell>
                   <TableCell className="text-right">
                       <Button variant="ghost" size="icon">
                            {call.callType === 'video' ? <Video className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                       </Button>
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
