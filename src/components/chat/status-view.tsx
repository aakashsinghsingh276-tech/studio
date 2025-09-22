
"use client";

import { useState, useRef } from "react";
import { PlusCircle } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { StatusViewer } from "./status-viewer";
import { type Status, type User, loggedInUserId, users, stories as initialStories, Story } from "@/lib/data";
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNow, isBefore, sub } from 'date-fns';

const filterActiveStories = (statuses: Status[]): Status[] => {
    const twentyFourHoursAgo = sub(new Date(), { hours: 24 });
    return statuses.map(status => {
        const activeStories = status.stories.filter(story => 
            isBefore(twentyFourHoursAgo, new Date(story.timestamp))
        );
        return { ...status, stories: activeStories };
    }).filter(status => status.stories.length > 0);
};

export function StatusView() {
    const [viewingStatus, setViewingStatus] = useState<Status | null>(null);
    const [stories, setStories] = useState<Status[]>(initialStories);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const activeStatuses = filterActiveStories(stories);

    const myStatus = activeStatuses.find(status => status.userId === loggedInUserId);
    const unreadStatuses = activeStatuses.filter(status => !status.isRead && status.userId !== loggedInUserId);
    const readStatuses = activeStatuses.filter(status => status.isRead && status.userId !== loggedInUserId);

    const handleViewStatus = (status: Status) => {
        setViewingStatus(status);
        // In a real app, you'd mark the status as read on the backend
        setStories(prevStories => prevStories.map(s => 
            s.userId === status.userId ? { ...s, isRead: true } : s
        ));
    };
    
    const handleCloseViewer = () => {
        setViewingStatus(null);
    };

    const handleMyStatusClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                const newStory: Story = {
                    id: uuidv4(),
                    imageUrl,
                    timestamp: new Date().toISOString(),
                };

                setStories(prevStories => {
                    const existingMyStatusIndex = prevStories.findIndex(s => s.userId === loggedInUserId);

                    if (existingMyStatusIndex !== -1) {
                        const updatedStories = [...prevStories];
                        const myCurrentStatus = updatedStories[existingMyStatusIndex];
                        updatedStories[existingMyStatusIndex] = {
                            ...myCurrentStatus,
                            stories: [...myCurrentStatus.stories, newStory],
                            isRead: true, // Mark as read since you're adding to it
                        };
                        return updatedStories;
                    } else {
                        const newStatus: Status = {
                            userId: loggedInUserId,
                            stories: [newStory],
                            isRead: true
                        };
                        return [...prevStories, newStatus];
                    }
                });
            };
            reader.readAsDataURL(file);
        }
         // Reset file input to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDeleteStory = (storyId: string) => {
        setStories(prevStories => {
            const updatedStories = prevStories.map(status => {
                if (status.userId === loggedInUserId) {
                    const filteredStories = status.stories.filter(story => story.id !== storyId);
                    return { ...status, stories: filteredStories };
                }
                return status;
            }).filter(status => status.stories.length > 0); // Also remove the status container if no stories are left

            // If we are currently viewing the status and all stories are deleted, close the viewer.
             if (viewingStatus?.userId === loggedInUserId && updatedStories.find(s => s.userId === loggedInUserId)?.stories.length === 0) {
                 handleCloseViewer();
             } else if (viewingStatus?.userId === loggedInUserId) {
                // otherwise, update the viewing status
                const updatedMyStatus = updatedStories.find(s => s.userId === loggedInUserId);
                if (updatedMyStatus) {
                    setViewingStatus(updatedMyStatus);
                }
             }

            return updatedStories;
        });
    };
    
    const getTimestamp = (status: Status) => {
        const lastStory = status.stories[status.stories.length-1];
        if (!lastStory) return '';
        return formatDistanceToNow(new Date(lastStory.timestamp), { addSuffix: true });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*" 
                className="hidden"
            />
            <div className="space-y-6">
                {/* My Status */}
                <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={handleMyStatusClick}
                >
                    <div className="relative">
                        <UserAvatar 
                            user={users.find(u => u.id === loggedInUserId)!} 
                            className="h-14 w-14" 
                            withStatus={!!myStatus}
                        />
                        <PlusCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-white fill-pink-500 bg-pink-500 rounded-full" />
                    </div>
                    <div>
                        <p className="font-semibold">My Status</p>
                        <p className="text-sm text-muted-foreground">{myStatus ? "Add to my status" : "Add new status"}</p>
                    </div>
                </div>

                {/* Unread Statuses */}
                {unreadStatuses.length > 0 && (
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Recent updates</p>
                        <div className="space-y-4">
                            {unreadStatuses.map(status => {
                                const user = users.find(u => u.id === status.userId);
                                if (!user) return null;
                                return (
                                    <div 
                                        key={status.userId} 
                                        className="flex items-center gap-4 cursor-pointer"
                                        onClick={() => handleViewStatus(status)}
                                    >
                                        <UserAvatar user={user} className="h-14 w-14" withStatus />
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{getTimestamp(status)}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Read Statuses */}
                 {readStatuses.length > 0 && (
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Viewed updates</p>
                        <div className="space-y-4">
                            {readStatuses.map(status => {
                                const user = users.find(u => u.id === status.userId);
                                if (!user) return null;
                                return (
                                    <div 
                                        key={status.userId} 
                                        className="flex items-center gap-4 cursor-pointer"
                                        onClick={() => handleViewStatus(status)}
                                    >
                                        <UserAvatar user={user} className="h-14 w-14" withStatus isRead={status.isRead} />
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{getTimestamp(status)}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>
            {viewingStatus && viewingStatus.stories.length > 0 && (
                <StatusViewer 
                    status={viewingStatus}
                    onClose={handleCloseViewer}
                    onDeleteStory={handleDeleteStory}
                />
            )}
        </div>
    )
}
