"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Smile, Loader2, Image as ImageIcon, Contact, MapPin } from "lucide-react";
import { generateSmartReplies, describeImage } from "@/actions/ai-actions";
import { type Message, type Attachment } from "@/lib/data";
import { loggedInUserId } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useToast } from "@/hooks/use-toast";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

type ChatInputProps = {
  onSendMessage: (message: string, attachment?: Attachment) => void;
  lastMessage: Message | undefined;
};

export function ChatInput({ onSendMessage, lastMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAISuggesting, startSmartReplyTransition] = useTransition();
  const [isAIDescribing, startImageDescribeTransition] = useTransition();
  const { toast } = useToast();

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

  const handleShareLocation = (isLive = false) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newAttachment: Attachment = {
            id: uuidv4(),
            type: "location",
            location: { latitude, longitude },
            isLive,
          };
          onSendMessage(isLive ? "Sharing live location" : "Shared my location", newAttachment);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not retrieve your location. Please ensure you've granted permission.",
          });
        }
      );
    } else {
        toast({
            variant: "destructive",
            title: "Location Error",
            description: "Geolocation is not supported by your browser.",
          });
    }
  };

  const handleShareContact = () => {
      // TODO: Implement contact sharing logic
      alert("Contact sharing is not implemented yet.");
  }
  
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prevMessage => prevMessage + emojiData.emoji);
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
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isProcessing}>
                            <Paperclip className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <div className="flex flex-col gap-2">
                            <Button variant="ghost" className="justify-start" onClick={handleAttachmentClick}>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                Image & Video
                            </Button>
                            <Button variant="ghost" className="justify-start" onClick={handleShareContact}>
                                <Contact className="mr-2 h-4 w-4" />
                                Contact
                            </Button>
                            <Button variant="ghost" className="justify-start" onClick={() => handleShareLocation(true)}>
                                <MapPin className="mr-2 h-4 w-4 animate-pulse text-red-500" />
                                Live Location
                            </Button>
                             <Button variant="ghost" className="justify-start" onClick={() => handleShareLocation(false)}>
                                <MapPin className="mr-2 h-4 w-4" />
                                Location
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isProcessing}>
                            <Smile className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-0">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </PopoverContent>
                </Popover>

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
