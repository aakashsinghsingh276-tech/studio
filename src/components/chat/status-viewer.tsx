
"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';
import Stories from 'react-insta-stories';
import { X, MoreVertical, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserAvatar } from './user-avatar';
import { 
    Dialog, 
    DialogContent,
    DialogTitle
} from '@/components/ui/dialog';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
import { users, type Status, loggedInUserId } from '@/lib/data';
import { Input } from '../ui/input';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { formatDistanceToNow } from 'date-fns';
import placeholderData from '@/lib/placeholder-images.json';

type StatusViewerProps = {
    status: Status;
    onClose: () => void;
    onDeleteStory?: (storyId: string) => void;
};

export function StatusViewer({ status, onClose, onDeleteStory }: StatusViewerProps) {
    const user = users.find(u => u.id === status.userId);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [open, setOpen] = useState(true);
    
    const isMyStatus = status.userId === loggedInUserId;

    const storyContent = useMemo(() => status.stories.map(story => {
        const timestamp = formatDistanceToNow(new Date(story.timestamp), { addSuffix: true });
        
        let profileImageUrl = user?.avatar || '';
        const placeholder = user ? placeholderData.placeholderImages.find(p => p.id === user.avatar) : null;
        if (user && placeholder) {
            profileImageUrl = placeholder.imageUrl;
        } else if (user && user.avatar.startsWith('http')) {
            profileImageUrl = user.avatar;
        } else {
            profileImageUrl = `https://picsum.photos/seed/${user?.id || 'avatar'}/200/200`;
        }
        
        return {
            url: story.imageUrl,
            duration: 5000,
            header: {
                heading: user?.name || 'User',
                subheading: timestamp,
                profileImage: profileImageUrl,
            }
        };
    }), [status, user]);
    
    const [progress, setProgress] = useState(0);

    const handleAllStoriesEnd = useCallback(() => {
        setTimeout(() => {
            setOpen(false);
            onClose();
        }, 0);
    }, [onClose]);

    const handleDialogChange = (isOpen: boolean) => {
        if (!isOpen) {
            onClose();
        }
        setOpen(isOpen);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let timeout: NodeJS.Timeout;

        const startTime = Date.now();
        const duration = storyContent[currentIndex]?.duration || 5000;

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(100, (elapsed / duration) * 100);
            setProgress(newProgress);
        };

        if(open) {
            interval = setInterval(updateProgress, 100);

            timeout = setTimeout(() => {
                clearInterval(interval);
            }, duration);
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [currentIndex, storyContent, open]);

    const handleStoryStart = (index: number) => {
        setCurrentIndex(index);
        setProgress(0);
    };
    
    const handleDeleteClick = () => {
        const currentStoryId = status.stories[currentIndex]?.id;
        if (currentStoryId && onDeleteStory) {
            onDeleteStory(currentStoryId);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogContent className="p-0 m-0 bg-black border-0 max-w-full h-full sm:rounded-none" onInteractOutside={(e) => e.preventDefault()}>
                 <VisuallyHidden>
                    <DialogTitle>Status Viewer: {user.name}</DialogTitle>
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
                                <p className="text-xs text-neutral-300">{storyContent[currentIndex]?.header.subheading}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {isMyStatus && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-white">
                                            <MoreVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            <Button variant="ghost" size="icon" className="text-white" onClick={() => setOpen(false)}>
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
                    onStoryStart={handleStoryStart}
                    onAllStoriesEnd={handleAllStoriesEnd}
                    storyContainerStyles={{
                        backgroundColor: '#000',
                        overflow: 'hidden',
                        borderRadius: 'inherit'
                    }}
                />

                 {/* Custom Footer */}
                {!isMyStatus && (
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/50 to-transparent">
                        <div className="flex items-center gap-2">
                            <Input placeholder="Reply..." className="bg-black/50 border-white/50 text-white placeholder:text-neutral-300" />
                            <Button variant="ghost" size="icon" className="text-white">
                                <Send />
                            </Button>
                        </div>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}
