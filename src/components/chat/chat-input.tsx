"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Mic, Smile, Loader2 } from "lucide-react";
import { generateSmartReplies } from "@/actions/ai-actions";
import { type Message } from "@/lib/data";
import { loggedInUserId } from "@/lib/data";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  lastMessage: Message | undefined;
};

export function ChatInput({ onSendMessage, lastMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (lastMessage && lastMessage.senderId !== loggedInUserId) {
      startTransition(async () => {
        const result = await generateSmartReplies({ message: lastMessage.content });
        setSuggestions(result.suggestions);
      });
    } else {
        setSuggestions([]);
    }
  }, [lastMessage]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
    setMessage("");
    setSuggestions([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      {suggestions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
            {isPending && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>}
          {!isPending && suggestions.map((s, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
            <Textarea
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="pr-24 min-h-0 resize-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5 text-muted-foreground" />
                </Button>
            </div>
        </div>
        <Button onClick={handleSend} size="icon" className="h-10 w-10 shrink-0">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
