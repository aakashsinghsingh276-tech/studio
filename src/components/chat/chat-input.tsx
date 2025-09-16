"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Smile, Loader2 } from "lucide-react";
import { generateSmartReplies, describeImage } from "@/actions/ai-actions";
import { type Message, type Attachment } from "@/lib/data";
import { loggedInUserId } from "@/lib/data";

type ChatInputProps = {
  onSendMessage: (message: string, attachment?: Attachment) => void;
  lastMessage: Message | undefined;
};

export function ChatInput({ onSendMessage, lastMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAISuggesting, startSmartReplyTransition] = useTransition();
  const [isAIDescribing, startImageDescribeTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lastMessage && lastMessage.senderId !== loggedInUserId && !lastMessage.attachment) {
      startSmartReplyTransition(async () => {
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

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        
        let attachmentType: 'image' | 'video' = 'image';
        if (file.type.startsWith('video')) {
            alert("Video attachments are not supported yet.");
            return;
        }

        const newAttachment: Attachment = {
            id: uuidv4(),
            type: attachmentType,
            url,
            name: file.name,
            size: file.size,
        };
        
        startImageDescribeTransition(async () => {
            const result = await describeImage({ photoDataUri: url });
            newAttachment.description = result.description;
            onSendMessage("", newAttachment);
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const isProcessing = isAISuggesting || isAIDescribing;

  return (
    <div className="p-4 border-t bg-background">
      {suggestions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
            {isAISuggesting && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>}
          {!isAISuggesting && suggestions.map((s, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => handleSuggestionClick(s)}
              disabled={isProcessing}
            >
              {s}
            </Button>
          ))}
        </div>
      )}
       {isAIDescribing && (
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing image...</span>
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
                disabled={isProcessing}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button variant="ghost" size="icon" onClick={handleAttachmentClick} disabled={isProcessing}>
                    <Paperclip className="h-5 w-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" disabled={isProcessing}>
                    <Smile className="h-5 w-5 text-muted-foreground" />
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
            </div>
        </div>
        <Button onClick={handleSend} size="icon" className="h-10 w-10 shrink-0" disabled={!message.trim() || isProcessing}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
