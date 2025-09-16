import { cn } from "@/lib/utils";
import type { Message } from "@/lib/data";
import { Check, CheckCheck } from 'lucide-react';

type MessageBubbleProps = {
  message: Message;
  isSender: boolean;
};

export function MessageBubble({ message, isSender }: MessageBubbleProps) {
  return (
    <div className={cn("flex w-full", isSender ? "justify-end" : "justify-start")}>
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
    </div>
  );
}
