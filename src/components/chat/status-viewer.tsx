
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Stories from 'react-insta-stories';
import { X, MoreVertical, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from './user-avatar';
import { 
    Dialog, 
    DialogContent,
    DialogTitle
} from '@/components/ui/dialog';
import { users, type Status } from '@/lib/data';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


type StatusViewerProps = {
    status: Status;
    onClose: () => void;
};

export function StatusViewer({ status, onClose }: StatusViewerProps) {
    const user = users.find(u => u.id === status.userId);
    const [currentIndex, setCurrentIndex] = useState(0);

    const storyContent = status.stories.map(story => ({
        url: story.imageUrl,
        duration: 5000,
        header: {
            heading: user?.name || 'User',
            subheading: story.timestamp,
            profileImage: user?.avatar.startsWith('http') ? user.avatar : `https://picsum.photos/seed/${user?.avatar}/200/200`
        }
    }));
    
    // This is a hacky way to get the progress bar to work with react-insta-stories
    const storyDurations = storyContent.map(s => s.duration);
    const [progress, setProgress] = useState(0);
    const [currentTimeout, setCurrentTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if(currentTimeout) clearTimeout(currentTimeout);

        const startTime = Date.now();
        const duration = storyDurations[currentIndex];

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(100, (elapsed / duration) * 100);
            setProgress(newProgress);
        }, 100);
        
        const timeout = setTimeout(() => {
            clearInterval(interval);
        }, duration);

        setCurrentTimeout(timeout);

        return () => {
            clearInterval(interval);
            if(timeout) clearTimeout(timeout);
        };

    }, [currentIndex, storyDurations]);

    if (!user) return null;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="p-0 m-0 bg-black border-0 max-w-full h-full sm:rounded-none">
                 <VisuallyHidden>
                    <DialogTitle>Status Viewer</DialogTitle>
                </VisuallyHidden>

                {/* Custom Header */}
                <div className="absolute top-0 left-0 right-0 z-10 p-2 bg-gradient-to-b from-black/50 to-transparent">
                     <div className="flex items-center gap-2 mb-1">
                        {storyContent.map((_, index) => (
                           <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                               <div
                                   className="h-full bg-white"
                                   style={{
                                       width: `${index === currentIndex ? progress : (index < currentIndex ? 100 : 0)}%`,
                                       transition: index === currentIndex ? 'width 0.1s linear' : 'none',
                                   }}
                               />
                           </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserAvatar user={user} />
                            <div>
                                <p className="font-semibold text-white">{user.name}</p>
                                <p className="text-xs text-neutral-300">{status.stories[currentIndex].timestamp}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="text-white">
                                <MoreVertical />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
                                <X />
                            </Button>
                        </div>
                    </div>
                </div>

                <Stories
                    stories={storyContent}
                    defaultInterval={5000}
                    width="100%"
                    height="100%"
                    currentIndex={currentIndex}
                    onStoryStart={(index) => {
                        setCurrentIndex(index);
                        setProgress(0);
                    }}
                    onAllStoriesEnd={onClose}
                    storyContainerStyles={{
                        backgroundColor: '#000',
                        overflow: 'hidden',
                        borderRadius: 'inherit'
                    }}
                    
                />

                 {/* Custom Footer */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/50 to-transparent">
                    <div className="flex items-center gap-2">
                        <Input placeholder="Reply..." className="bg-black/50 border-white/50 text-white placeholder:text-neutral-300" />
                        <Button variant="ghost" size="icon" className="text-white">
                            <Send />
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
