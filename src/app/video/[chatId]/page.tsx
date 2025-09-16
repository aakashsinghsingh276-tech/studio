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

  const getChatPartner = (chatId: string): User | undefined => {
    const currentChat = chats.find((c) => c.id === chatId);
    if (!currentChat) return undefined;
    const partnerId = currentChat.participants.find((p) => p !== loggedInUserId);
    return users.find((u) => u.id === partnerId);
  };
  
  const partner = getChatPartner(chatId);
  const placeholder = placeholderData.placeholderImages.find(p => p.id === partner?.avatar);

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

  return (
    <div className="bg-black text-white h-screen flex flex-col relative">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
        {/* My Video */}
        <div className="relative w-full h-full bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : ''}`}
            autoPlay
            muted
          />
          {isCameraOff && me && (
            <div className="flex flex-col items-center gap-4">
                <UserAvatar user={me} className="h-32 w-32" />
                <p className="text-xl font-semibold">Camera is off</p>
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-black/50 rounded-md px-2 py-1 text-sm">
            You
          </div>
        </div>

        {/* Partner Video */}
        <div className="relative w-full h-full bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
          {partner && placeholder && (
            <Image
                src={placeholder.imageUrl}
                alt={partner.name}
                fill
                className="object-cover"
                data-ai-hint={placeholder.imageHint}
            />
          )}
           <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-4">
                {partner && <UserAvatar user={partner} className="h-32 w-32" />}
                <p className="text-xl font-semibold">{partner?.name || 'Partner'}</p>
                <p className="text-muted-foreground">Connecting...</p>
            </div>
          <div className="absolute bottom-4 left-4 bg-black/50 rounded-md px-2 py-1 text-sm">
            {partner?.name || 'Partner'}
          </div>
        </div>
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
