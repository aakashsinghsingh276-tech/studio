
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
} from "lucide-react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { chats, users, loggedInUserId, type User } from "@/lib/data";
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { AddParticipant } from "@/components/chat/add-participant";

function ParticipantVideo({ user, isYou = false, isCameraOff = false, videoRef = null }: { user: User, isYou?: boolean, isCameraOff?: boolean, videoRef?: React.RefObject<HTMLVideoElement> | null }) {
    const placeholder = placeholderData.placeholderImages.find(p => p.id === user?.avatar);
    
    return (
        <div className="relative w-full h-full bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
            {isYou ? (
                <>
                    <video
                        ref={videoRef}
                        className={cn("w-full h-full object-cover", isCameraOff ? 'hidden' : '')}
                        autoPlay
                        muted
                    />
                    {isCameraOff && (
                        <div className="flex flex-col items-center gap-4">
                            <UserAvatar user={user} className="h-32 w-32" />
                            <p className="text-xl font-semibold">Camera is off</p>
                        </div>
                    )}
                </>
            ) : (
                 <div className="flex flex-col items-center justify-center gap-4 text-center">
                    {placeholder && (
                        <Image
                            src={placeholder.imageUrl}
                            alt={user.name}
                            fill
                            className="object-cover"
                            data-ai-hint={placeholder.imageHint}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4">
                        <UserAvatar user={user} className="h-32 w-32" />
                        <p className="text-xl font-semibold">{user.name}</p>
                        <p className="text-muted-foreground">Connecting...</p>
                    </div>
                </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/50 rounded-md px-2 py-1 text-sm">
                {isYou ? "You" : user.name}
            </div>
        </div>
    )
}


export default function VideoCallPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId as string;

  const chat = chats.find((c) => c.id === chatId);
  const me = users.find((u) => u.id === loggedInUserId);
  
  const initialParticipants = chat?.participants
    .map(pId => users.find(u => u.id === pId))
    .filter((u): u is User => !!u) || [];

  const [participants, setParticipants] = useState<User[]>(initialParticipants);
  
  const otherParticipants = participants.filter(p => p.id !== loggedInUserId);


  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
          variant: "destructive",
          title: "Camera Access Denied",
          description:
            "Please enable camera permissions in your browser settings to use this feature.",
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleEndCall = () => {
    router.back();
  };

  const toggleMic = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach(track => {
          track.enabled = !track.enabled;
          setIsMicMuted(!track.enabled);
      });
    }
  };

  const toggleCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach(track => {
          track.enabled = !track.enabled;
          setIsCameraOff(!track.enabled);
      });
    }
  };
  
  const handleAddParticipants = (newParticipants: User[]) => {
    setParticipants(prev => [...prev, ...newParticipants]);
  };

  return (
    <div className="bg-black text-white h-screen flex flex-col relative">
      <div className={cn(
          "flex-1 grid gap-2 p-2",
          participants.length === 1 && "grid-cols-1 grid-rows-1",
          participants.length === 2 && "grid-cols-2 grid-rows-1",
          participants.length >= 3 && "grid-cols-2 grid-rows-2",
          participants.length >= 5 && "grid-cols-3 grid-rows-2",
      )}>
        {/* My Video */}
        {me && <ParticipantVideo user={me} isYou={true} isCameraOff={isCameraOff} videoRef={videoRef} />}

        {/* Other Participants */}
        {otherParticipants.map(participant => (
            <ParticipantVideo key={participant.id} user={participant} />
        ))}
      </div>

      {!hasCameraPermission && hasCameraPermission !== null && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Alert variant="destructive" className="w-11/12 max-w-md">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access to use this feature. You may need to
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
          variant="secondary"
          size="icon"
          className="rounded-full h-14 w-14 bg-zinc-700 hover:bg-zinc-600"
          onClick={toggleCamera}
        >
          {isCameraOff ? <VideoOff /> : <Video />}
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
                    <Video className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>
             <Separator className="bg-zinc-700" />
              <AddParticipant 
                currentParticipants={participants} 
                onAddParticipants={handleAddParticipants}
              >
                <Button className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600">Add participant</Button>
              </AddParticipant>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
