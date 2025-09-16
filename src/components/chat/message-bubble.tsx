
import { cn } from "@/lib/utils";
import type { Message, User } from "@/lib/data";
import { Check, CheckCheck, MoreVertical, Trash2, Download, MapPin, Music, Film } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import { UserAvatar } from "./user-avatar";

type MessageBubbleProps = {
  message: Message;
  isSender: boolean;
  onDelete: () => void;
};

export function MessageBubble({ message, isSender, onDelete }: MessageBubbleProps) {
  const handleDownload = () => {
    if (message.attachment && message.attachment.url) {
      const link = document.createElement('a');
      link.href = message.attachment.url;
      link.download = message.attachment.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const handleOpenMap = () => {
    if (message.attachment?.type === 'location' && message.attachment.location) {
        const { latitude, longitude } = message.attachment.location;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
    }
  };

  const renderAttachment = () => {
    if (!message.attachment) return null;

    switch (message.attachment.type) {
      case 'image':
        return (
          <Card className="overflow-hidden border-none">
            <CardContent className="p-0 relative">
              {message.attachment.url && (
                <Image 
                  src={message.attachment.url} 
                  alt={message.attachment.name || 'attachment'} 
                  width={300} 
                  height={200}
                  className="object-cover w-full h-auto"
                />
              )}
            </CardContent>
            {(message.content || message.attachment.description) && (
              <CardFooter className="p-2 flex flex-col items-start gap-2 bg-background/50">
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                {message.attachment.description && (
                   <p className="text-xs italic text-muted-foreground bg-accent/20 p-2 rounded-md">
                      {message.attachment.description}
                  </p>
                )}
              </CardFooter>
            )}
          </Card>
        );

      case 'video':
        return (
          <Card className="overflow-hidden border-none">
            <CardContent className="p-0 relative">
              {message.attachment.url && (
                <video src={message.attachment.url} controls className="w-full" />
              )}
            </CardContent>
            {message.content && (
              <CardFooter className="p-2 bg-background/50">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </CardFooter>
            )}
          </Card>
        );

      case 'audio':
        return (
          <Card className="overflow-hidden border-none">
            <CardContent className="p-4 flex items-center gap-4">
              <Music className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold truncate">{message.attachment.name}</p>
                {message.attachment.url && (
                  <audio src={message.attachment.url} controls className="w-full h-10 mt-1" />
                )}
              </div>
            </CardContent>
             {message.content && (
              <CardFooter className="p-2 bg-background/50">
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </CardFooter>
            )}
          </Card>
        );
      
      case 'location':
        return (
            <Card className="overflow-hidden border-none">
                <CardContent className="p-4 flex flex-col items-center gap-2">
                    <MapPin className={cn("h-10 w-10 text-primary", message.attachment.isLive && "text-red-500 animate-pulse")} />
                    <p className="font-semibold">{message.attachment.isLive ? "Live Location" : "Location Shared"}</p>
                    <Button onClick={handleOpenMap} variant="outline" size="sm">
                        View on Map
                    </Button>
                </CardContent>
                {message.content && !message.content.includes("my location") && (
                     <CardFooter className="p-2 bg-background/50">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </CardFooter>
                )}
            </Card>
        )

      case 'contact':
          if (!message.attachment.contact) return null;
          const contact = message.attachment.contact as User;
        return (
            <Card className="overflow-hidden border-none">
                <CardContent className="p-4 flex items-center gap-4">
                    <UserAvatar user={contact} />
                    <div>
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">Contact</p>
                    </div>
                </CardContent>
            </Card>
        )

      default:
        return null;
    }
  };


  return (
    <div className={cn("flex w-full group", isSender ? "justify-end" : "justify-start")}>
       <div className={cn("flex items-end gap-2", isSender ? "flex-row-reverse" : "flex-row")}>
        <div
            className={cn(
            "max-w-[75%] rounded-lg px-4 py-2 flex flex-col shadow-sm",
            isSender
                ? "bg-primary text-primary-foreground"
                : "bg-card",
            message.attachment && "p-0"
            )}
        >
            {message.attachment ? renderAttachment() : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}

            <div className={cn("flex items-center justify-end gap-2 mt-1 self-end", message.attachment && "p-2 pt-0")}>
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
                {message.attachment && message.attachment.url && (
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                )}
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
