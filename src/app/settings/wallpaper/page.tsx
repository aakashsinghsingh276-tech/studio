
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, Upload, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import placeholderData from "@/lib/placeholder-images.json";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Message, loggedInUserId, users } from "@/lib/data";

const defaultWallpaper = "https://picsum.photos/seed/chat-bg/800/1200";

const wallpaperCategories = [
    {
        title: "Light Wallpapers",
        theme: "light",
        wallpapers: placeholderData.placeholderImages.filter(p => p.id.startsWith('wallpaper-light'))
    },
    {
        title: "Dark Wallpapers",
        theme: "dark",
        wallpapers: placeholderData.placeholderImages.filter(p => p.id.startsWith('wallpaper-dark'))
    },
    {
        title: "Solid Colors",
        theme: "any",
        wallpapers: placeholderData.placeholderImages.filter(p => p.id.startsWith('wallpaper-solid'))
    }
]

const sampleMessages: Message[] = [
    { id: 'm1', chatId: 'c1', senderId: 'user2', content: 'This looks great!', timestamp: '10:00 AM', read: true },
    { id: 'm2', chatId: 'c1', senderId: loggedInUserId, content: 'Thanks! I just changed the wallpaper.', timestamp: '10:01 AM', read: true },
];


export default function WallpaperPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedWallpaper, setSelectedWallpaper] = useState(defaultWallpaper);
  const [dimming, setDimming] = useState(50);
  
  const handleBack = () => {
    router.back();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedWallpaper(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="flex h-screen flex-col bg-secondary/30">
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Wallpaper</h1>
      </header>
      
      <main className="flex-1 grid md:grid-cols-2 overflow-hidden">
        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-sm mx-auto overflow-hidden">
            <CardHeader className="p-3">
                <CardTitle className="text-lg text-center">Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div 
                    className="relative h-96 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedWallpaper})` }}
                >
                    <div 
                        className="absolute inset-0 flex flex-col justify-end p-4 gap-2"
                        style={{ backgroundColor: `rgba(0,0,0,${dimming/100})` }}
                    >
                         {sampleMessages.map(msg => (
                            <MessageBubble 
                                key={msg.id} 
                                message={msg}
                                isSender={msg.senderId === loggedInUserId}
                                onDelete={() => {}}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col overflow-y-auto p-4 md:p-8 bg-card border-t md:border-l">
            <Tabs defaultValue="light" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="light"><Sun className="mr-2" />Light</TabsTrigger>
                    <TabsTrigger value="dark"><Moon className="mr-2"/>Dark</TabsTrigger>
                    <TabsTrigger value="solid">Solid</TabsTrigger>
                </TabsList>
                <TabsContent value="light">
                    <WallpaperGrid wallpapers={wallpaperCategories.find(c => c.title === 'Light Wallpapers')?.wallpapers || []} onSelect={setSelectedWallpaper} selected={selectedWallpaper}/>
                </TabsContent>
                <TabsContent value="dark">
                    <WallpaperGrid wallpapers={wallpaperCategories.find(c => c.title === 'Dark Wallpapers')?.wallpapers || []} onSelect={setSelectedWallpaper} selected={selectedWallpaper}/>
                </TabsContent>
                <TabsContent value="solid">
                    <WallpaperGrid wallpapers={wallpaperCategories.find(c => c.title === 'Solid Colors')?.wallpapers || []} onSelect={setSelectedWallpaper} selected={selectedWallpaper}/>
                </TabsContent>
            </Tabs>
            
            <div className="space-y-4 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Custom</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Button variant="outline" className="w-full" onClick={handleUploadClick}>
                            <Upload className="mr-2"/> Upload from Photos
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Wallpaper Dimming</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Slider
                            defaultValue={[dimming]}
                            max={100}
                            step={1}
                            onValueChange={(value) => setDimming(value[0])}
                        />
                    </CardContent>
                </Card>
                
                <Button onClick={() => setSelectedWallpaper(defaultWallpaper)}>
                    Reset to Default
                </Button>
            </div>
        </div>
      </main>
    </div>
  );
}


const WallpaperGrid = ({ wallpapers, onSelect, selected }: { wallpapers: any[], onSelect: (url: string) => void, selected: string}) => (
    <div className="grid grid-cols-3 gap-2 mt-4">
        {wallpapers.map(wp => (
            <button key={wp.id} className="relative aspect-[9/16] rounded-md overflow-hidden group" onClick={() => onSelect(wp.imageUrl)}>
                <Image src={wp.imageUrl} alt={wp.description} fill className="object-cover" />
                {selected === wp.imageUrl && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="h-10 w-10 bg-primary/80 rounded-full flex items-center justify-center">
                            <Check className="text-primary-foreground" />
                        </div>
                    </div>
                )}
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
        ))}
    </div>
)
