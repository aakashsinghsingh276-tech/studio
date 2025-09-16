
"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Dices, Upload, Wand2, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/chat/user-avatar";
import { useToast } from "@/hooks/use-toast";
import { loggedInUserId, users } from "@/lib/data";
import { generateAvatar } from "@/actions/ai-actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function AvatarStudioPage() {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [me] = useState(() => users.find((u) => u.id === loggedInUserId));
  const [avatarUrl, setAvatarUrl] = useState(me?.avatar ?? "");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, startGenerationTransition] = useTransition();

  const handleBack = () => {
    router.back();
  };

  const handleRandomize = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setAvatarUrl(`https://picsum.photos/seed/${randomId}/400/400`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Prompt is empty",
        description: "Please enter a prompt to generate an avatar.",
      });
      return;
    }
    startGenerationTransition(async () => {
      const result = await generateAvatar(prompt);
      if (result.imageUrl) {
        setAvatarUrl(result.imageUrl);
        toast({
          title: "Avatar Generated!",
          description: "Your new AI-powered avatar is ready.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: "Could not generate an avatar. Please try again.",
        });
      }
    });
  };

  const handleSave = () => {
    // In a real app, you would save the avatarUrl to the user's profile in the database.
    // For this demo, we'll just show a toast notification.
    if (me) {
      me.avatar = avatarUrl;
    }
    toast({
      title: "Avatar Saved!",
      description: "Your new avatar has been set.",
    });
    router.push("/");
  };

  if (!me) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>User not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Avatar Studio</h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Create Your Avatar</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-2">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <p className="font-semibold">Preview</p>
                        <div className="relative h-48 w-48">
                            {isGenerating ? (
                                <Skeleton className="h-full w-full rounded-full" />
                            ) : (
                                <UserAvatar user={{ ...me, avatar: avatarUrl }} className="h-full w-full text-5xl" />
                            )}
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label>Choose an Option</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={handleRandomize}>
                                    <Dices className="mr-2" />
                                    Randomize
                                </Button>
                                <Button variant="outline" onClick={handleUploadClick}>
                                    <Upload className="mr-2" />
                                    Upload
                                </Button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ai-prompt">Or, Generate with AI</Label>
                            <Textarea 
                                id="ai-prompt" 
                                placeholder="e.g., A majestic lion with a golden crown, digital art"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={isGenerating}
                            />
                            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                                {isGenerating ? (
                                    <Loader2 className="mr-2 animate-spin" />
                                ) : (
                                    <Wand2 className="mr-2" />
                                )}
                                Generate
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} className="w-full" size="lg">
                        <Save className="mr-2" />
                        Save Avatar
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </main>
    </div>
  );
}
