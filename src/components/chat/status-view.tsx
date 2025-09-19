
"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { StatusViewer } from "./status-viewer";
import { type Status, type User, loggedInUserId, users, stories } from "@/lib/data";

const getStatusData = (userId: string): Status | undefined => {
    return stories.find(story => story.userId === userId);
}

const getUnreadStatuses = () => {
    return stories.filter(story => !story.isRead && story.userId !== loggedInUserId);
}
const getReadStatuses = () => {
    return stories.filter(story => story.isRead && story.userId !== loggedInUserId);
}

export function StatusView() {
    const [viewingStatus, setViewingStatus] = useState<Status | null>(null);

    const myStatus = getStatusData(loggedInUserId);
    const unreadStatuses = getUnreadStatuses();
    const readStatuses = getReadStatuses();

    const handleViewStatus = (status: Status) => {
        setViewingStatus(status);
        // In a real app, you'd mark the status as read on the backend
        const story = stories.find(s => s.userId === status.userId);
        if (story) {
            story.isRead = true;
        }
    };
    
    const handleCloseViewer = () => {
        setViewingStatus(null);
    };

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
                {/* My Status */}
                <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => myStatus && handleViewStatus(myStatus)}
                >
                    <div className="relative">
                        <UserAvatar 
                            user={users.find(u => u.id === loggedInUserId)!} 
                            className="h-14 w-14" 
                            withStatus={!!myStatus}
                        />
                         {!myStatus && (
                            <PlusCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-primary bg-background rounded-full" />
                         )}
                    </div>
                    <div>
                        <p className="font-semibold">My Status</p>
                        <p className="text-sm text-muted-foreground">{myStatus ? "View my status" : "Add to my status"}</p>
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
                                            <p className="text-sm text-muted-foreground">{status.stories[status.stories.length-1].timestamp}</p>
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
                                        <UserAvatar user={user} className="h-14 w-14" withStatus />
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{status.stories[status.stories.length-1].timestamp}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

            </div>
            {viewingStatus && (
                <StatusViewer 
                    status={viewingStatus}
                    onClose={handleCloseViewer}
                />
            )}
        </div>
    )
}
