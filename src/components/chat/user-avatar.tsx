import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User, Story } from "@/lib/data";
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';

type UserAvatarProps = {
  user: User;
  className?: string;
  withStatus?: boolean;
  story?: Story;
};

const placeholderImages = placeholderData.placeholderImages;

export function UserAvatar({ user, className, withStatus = false, story }: UserAvatarProps) {
  const placeholder = placeholderImages.find(p => p.id === user.avatar);
  const hasUnviewedStories = story?.stories.some(s => !s.viewed);

  const avatarContainerClasses = cn(
    "relative",
    story && "p-0.5 rounded-full",
    hasUnviewedStories ? "border-2 border-primary" : story ? "border-2 border-border" : ""
  );

  return (
    <div className={avatarContainerClasses}>
      <Avatar className={cn("h-10 w-10", className)}>
        <AvatarImage asChild src={user.avatar.startsWith('http') ? user.avatar : placeholder?.imageUrl} alt={user.name}>
            {user.avatar.startsWith('http') ? (
                 <Image 
                    src={user.avatar} 
                    alt={user.name}
                    width={40}
                    height={40}
                />
            ) : placeholder ? (
                <Image 
                    src={placeholder.imageUrl} 
                    alt={user.name}
                    width={40}
                    height={40}
                    data-ai-hint={placeholder.imageHint}
                />
            ) : null}
        </AvatarImage>
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      {withStatus && user.status === "online" && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
      )}
    </div>
  );
}
