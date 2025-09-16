import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/data";
import Image from "next/image";
import placeholderData from '@/lib/placeholder-images.json';

type UserAvatarProps = {
  user: User;
  className?: string;
  withStatus?: boolean;
};

const placeholderImages = placeholderData.placeholderImages;

export function UserAvatar({ user, className, withStatus = false }: UserAvatarProps) {
  const placeholder = placeholderImages.find(p => p.id === user.avatar);

  return (
    <div className="relative">
      <Avatar className={cn("h-10 w-10", className)}>
        <AvatarImage asChild src={placeholder?.imageUrl} alt={user.name}>
            {placeholder && (
                <Image 
                    src={placeholder.imageUrl} 
                    alt={user.name}
                    width={40}
                    height={40}
                    data-ai-hint={placeholder.imageHint}
                />
            )}
        </AvatarImage>
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      {withStatus && user.status === "online" && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
      )}
    </div>
  );
}
