
"use client";

import { useState, useRef } from "react";
import { stories, users, loggedInUserId, Story, type Status } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "./user-avatar";
import { Button } from "../ui/button";
import { Camera, Plus } from "lucide-react";
import { Card } from "../ui/card";
import { StatusViewer } from "./status-viewer";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

function StatusUploader({ onStatusUploaded }: { onStatusUploaded: (newStory: Story) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const me = users.find(u => u.id === loggedInUserId);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && me) {
      let fileType: 'image' | 'video' | 'audio' | 'text' = 'image';
      if (file.type.startsWith("image/")) {
        fileType = 'image';
      } else if (file.type.startsWith("video/")) {
        fileType = 'video';
      } else if (file.type.startsWith("audio/")) {
        fileType = 'audio';
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload an image, video, or audio file for your status.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newStatus: Status = {
          type: fileType,
          url,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          viewed: false,
          header: {
            heading: me.name,
            subheading: 'Just now',
            profileImage: me.avatar.startsWith('http') ? me.avatar : `https://picsum.photos/seed/${me.avatar}/200/200`
          },
          duration: fileType === 'video' ? undefined : (fileType === 'audio' ? undefined : 5000),
        };

        const myExistingStory = stories.find(s => s.userId === loggedInUserId);
        
        let newStoryData: Story;

        if (myExistingStory) {
            myExistingStory.stories.push(newStatus);
            newStoryData = myExistingStory;
        } else {
            newStoryData = {
                userId: loggedInUserId,
                stories: [newStatus]
            };
            stories.unshift(newStoryData);
        }
        
        onStatusUploaded(newStoryData);

        toast({
          title: "Status Updated",
          description: "Your new status has been uploaded.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*,audio/*"
        className="hidden"
      />
      <Button size="icon" className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-primary hover:bg-primary/90" onClick={handleUploadClick}>
        <Plus className="h-4 w-4 text-primary-foreground" />
      </Button>
    </>
  );
}


export function StatusView() {
  const [allStories, setAllStories] = useState(stories);
  const me = users.find(u => u.id === loggedInUserId);

  const myStory = allStories.find(s => s.userId === loggedInUserId);
  const otherStories = allStories.filter(s => s.userId !== loggedInUserId);
  const recentUpdates = otherStories.filter(s => !s.stories.every(story => story.viewed));
  const viewedUpdates = otherStories.filter(s => s.stories.every(story => story.viewed));

  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  const handleStoryClick = (story: Story) => {
    setViewingStory(story);
  };
  
  const handleMyStoryClick = () => {
    if (myStory) {
      setViewingStory(myStory);
    }
  }

  const handleCloseViewer = () => {
    const storyId = viewingStory?.userId;
    setViewingStory(null);
    if (storyId) {
      setAllStories(currentStories => 
        currentStories.map(story => {
          if (story.userId === storyId) {
            return {
              ...story,
              stories: story.stories.map(s => ({ ...s, viewed: true }))
            };
          }
          return story;
        })
      );
    }
  }

  const handleStatusUploaded = (newStory: Story) => {
    setAllStories(currentStories => {
        const existing = currentStories.find(s => s.userId === newStory.userId);
        if (existing) {
            return currentStories.map(s => s.userId === newStory.userId ? newStory : s);
        }
        return [newStory, ...currentStories];
    });
  }

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Status</h2>

          {/* My Status */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {me && <UserAvatar user={me} />}
                <StatusUploader onStatusUploaded={handleStatusUploaded} />
              </div>
              <div onClick={handleMyStoryClick} className="cursor-pointer">
                <p className="font-semibold">My status</p>
                <p className="text-sm text-muted-foreground">
                  {myStory ? `${myStory.stories.length} updates` : "Add to my status"}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          {recentUpdates.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Recent updates</h3>
              <div className="flex flex-col gap-4">
                {recentUpdates.map(story => {
                  const user = users.find(u => u.id === story.userId);
                  if (!user) return null;
                  return (
                    <div key={story.userId} className="flex items-center gap-4 cursor-pointer" onClick={() => handleStoryClick(story)}>
                      <UserAvatar user={user} story={story} />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {story.stories[story.stories.length-1].timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Viewed Updates */}
          {viewedUpdates.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Viewed updates</h3>
              <div className="flex flex-col gap-4">
                {viewedUpdates.map(story => {
                  const user = users.find(u => u.id === story.userId);
                  if (!user) return null;
                  return (
                    <div key={story.userId} className="flex items-center gap-4 cursor-pointer opacity-70" onClick={() => handleStoryClick(story)}>
                      <UserAvatar user={user} story={story} />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                         {story.stories[story.stories.length-1].timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {recentUpdates.length === 0 && viewedUpdates.length === 0 && (
              <Card className="mt-8 flex flex-col items-center justify-center p-8 text-center border-dashed">
                  <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No new statuses</h3>
                  <p className="text-muted-foreground">Your contacts' statuses will appear here.</p>
              </Card>
          )}
        </div>
      </ScrollArea>
      {viewingStory && (
        <StatusViewer story={viewingStory} onClose={handleCloseViewer} />
      )}
    </>
  );
}
