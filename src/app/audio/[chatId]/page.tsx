
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  PhoneOff,
  Users,
} from "lucide-react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { chats, users, loggedInUserId, type User } from "@/lib/data";
import Image from "next/image";

export default function AudioCallPage() {
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId as string;

  const chat = chats.find((c) => c.id === chatId);
  const me = users.find((u) => u.id === loggedInUserId);

  const getChatPartner = (chatId: string): User | undefined => {
    const currentChat = chats.find((c) => c.id === chatId);
    if (!currentChat) return undefined;
    const partnerId = currentChat.participants.find((p) => p !== loggedInUserId);
    return users.find((u) => u.id === partnerId);
  };
  
  const partner = getChatPartner(chatId);

  useEffect(() => {
    const getMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setHasMicPermission(true);

        if (audioRef.current) {
          audioRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
        setHasMicPermission(false);
        toast({
          variant: "destructive",
          title: "Microphone Access Denied",
          description:
            "Please enable microphone permissions in your browser settings to use this feature.",
        });
      }
    };

    getMicPermission();
    
    return () => {
        if (audioRef.current && audioRef.current.srcObject) {
            const stream = audioRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleEndCall = () => {
    router.back();
  };

  const toggleMic = () => {
    if (audioRef.current && audioRef.current.srcObject) {
      const stream = audioRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
          track.enabled = !track.enabled;
          setIsMicMuted(!track.enabled);
      });
    }
  };

  return (
    <div className="bg-zinc-900 text-white h-screen flex flex-col relative items-center justify-center">
        <div className="absolute top-8 right-8">
            <p className="text-muted-foreground">Now in call</p>
        </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-8">
            {me && (
                <div className="flex flex-col items-center gap-3">
                    <UserAvatar user={me} className="h-32 w-32" />
                    <p className="font-semibold">You</p>
                </div>
            )}
            {partner && (
                <div className="flex flex-col items-center gap-3">
                    <UserAvatar user={partner} className="h-32 w-32" />
                    <p className="font-semibold">{partner.name}</p>
                </div>
            )}
        </div>
        <p className="text-muted-foreground text-lg">Connecting...</p>
      </div>

      <audio ref={audioRef} autoPlay muted />

      {!hasMicPermission && hasMicPermission !== null && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Alert variant="destructive" className="w-11/12 max-w-md">
                <AlertTitle>Microphone Access Required</AlertTitle>
                <AlertDescription>
                    Please allow microphone access to use this feature. You may need to
                    adjust your browser settings.
                </AlertDescription>
            </Alert>
        </div>
      )}

      {/* Controls */}
      <div className="bg-zinc-900/80 absolute bottom-0 left-0 right-0 py-4 flex justify-center items-center gap-4">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-14 w-14 bg-zinc-700 hover:bg-zinc-600"
          onClick={toggleMic}
        >
          {isMicMuted ? <MicOff /> : <Mic />}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full h-14 w-14"
          onClick={handleEndCall}
        >
          <PhoneOff />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-14 w-14 bg-zinc-700 hover:bg-zinc-600"
        >
          <Users />
        </Button>
      </div>
    </div>
  );
}
