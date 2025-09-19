
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/data";
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';
import { Users } from "lucide-react";

type UserAvatarProps = {
  user: User;
  className?: string;
  withStatus?: boolean;
};

const placeholderImages = placeholderData.placeholderImages;

export function UserAvatar({ user, className, withStatus = false }: UserAvatarProps) {
  const placeholder = placeholderImages.find(p => p.id === user.avatar);

  const avatarContainerClasses = cn(
    "relative"
  );

  const isGroupPlaceholder = user.avatar === 'group-placeholder';

  return (
    <div className={avatarContainerClasses}>
      <Avatar className={cn("h-10 w-10", className)}>
        {isGroupPlaceholder ? (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
                <Users className="h-5 w-5 text-muted-foreground" />
            </div>
        ) : (
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
        )}
        <AvatarFallback>
          {isGroupPlaceholder ? 'G' : user.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      {withStatus && user.status === "online" && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
      )}
    </div>
  );
}
