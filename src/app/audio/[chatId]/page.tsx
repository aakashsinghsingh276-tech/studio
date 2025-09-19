
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
  X
} from "lucide-react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { chats, users, loggedInUserId, type User } from "@/lib/data";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

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
  
  const participants = chat?.participants
    .map(pId => users.find(u => u.id === pId))
    .filter((u): u is User => !!u) || [];

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
            <p className="text-muted-foreground">In call with {chat?.name || 'group'}</p>
        </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-8 max-w-4xl">
            {participants.map(user => (
                 <div key={user.id} className="flex flex-col items-center gap-3">
                    <UserAvatar user={user} className="h-32 w-32" />
                    <p className="font-semibold">{user.id === loggedInUserId ? 'You' : user.name}</p>
                </div>
            ))}
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
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full h-14 w-14 bg-zinc-700 hover:bg-zinc-600"
            >
              <Users />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-zinc-800 text-white border-zinc-700">
            <SheetHeader>
              <SheetTitle>Participants ({participants.length})</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4">
              {participants.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar user={user} />
                    <span>{user.id === loggedInUserId ? 'You' : user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>
             <Separator className="bg-zinc-700" />
              <Button className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600">Add participant</Button>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
