
"use client";

import { useState } from "react";
import { stories, users, loggedInUserId, Story } from "@/lib/data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "./user-avatar";
import { Button } from "../ui/button";
import { Camera, Plus } from "lucide-react";
import { Card } from "../ui/card";
import { StatusViewer } from "./status-viewer";

export function StatusView() {
  const myStory = stories.find(s => s.userId === loggedInUserId);
  const me = users.find(u => u.id === loggedInUserId);
  
  const otherStories = stories.filter(s => s.userId !== loggedInUserId);
  const recentUpdates = otherStories.filter(s => !s.stories.every(story => story.viewed));
  const viewedUpdates = otherStories.filter(s => s.stories.every(story => story.viewed));

  const [viewingStory, setViewingStory] = useState<Story | null>(null);

  const handleStoryClick = (story: Story) => {
    setViewingStory(story);
  };

  const handleCloseViewer = () => {
    setViewingStory(null);
    // In a real app, you'd update the 'viewed' status in your backend
    if (viewingStory) {
      viewingStory.stories.forEach(s => s.viewed = true);
    }
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
                <Button size="icon" className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 text-primary-foreground" />
                </Button>
              </div>
              <div>
                <p className="font-semibold">My status</p>
                <p className="text-sm text-muted-foreground">
                  {myStory ? "View my status" : "Add to my status"}
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
