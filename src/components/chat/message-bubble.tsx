
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/data";
import { Check, CheckCheck, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

type MessageBubbleProps = {
  message: Message;
  isSender: boolean;
  onDelete: () => void;
};

export function MessageBubble({ message, isSender, onDelete }: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full group", isSender ? "justify-end" : "justify-start")}>
       <div className={cn("flex items-center gap-2", isSender ? "flex-row-reverse" : "flex-row")}>
        <div
            className={cn(
            "max-w-[75%] rounded-lg px-4 py-2 flex flex-col shadow-sm",
            isSender
                ? "bg-primary text-primary-foreground"
                : "bg-card"
            )}
        >
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            <div className="flex items-center justify-end gap-2 mt-1 self-end">
                <span className="text-xs opacity-70">
                {message.timestamp}
                </span>
                {isSender && (
                    message.read ? <CheckCheck className="h-4 w-4" /> : <Check className="h-4 w-4" />
                )}
            </div>
        </div>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isSender ? "end" : "start"}>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

       </div>
    </div>
  );
}
