
"use client";

import { useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { users, loggedInUserId, type User } from "@/lib/data";
import { cn } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AddParticipantProps = {
  children: React.ReactNode;
  currentParticipants: User[];
  onAddParticipants: (newParticipants: User[]) => void;
};

export function AddParticipant({ children, currentParticipants, onAddParticipants }: AddParticipantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { toast } = useToast();

  const currentParticipantIds = currentParticipants.map(p => p.id);
  
  // Contacts that are not the logged-in user and not already in the call
  const availableContacts = users.filter(
    user => user.id !== loggedInUserId && !currentParticipantIds.includes(user.id)
  );

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };
  
  const isSelected = (user: User) => selectedUsers.some((u) => u.id === user.id);

  const handleAdd = () => {
    if (selectedUsers.length === 0) {
        toast({
            variant: "destructive",
            title: "No users selected",
            description: "Please select at least one person to add.",
        });
        return;
    }
    onAddParticipants(selectedUsers);
    toast({
        title: "Participants Added",
        description: `${selectedUsers.map(u => u.name).join(', ')} added to the call.`
    });
    setSelectedUsers([]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Participants</DialogTitle>
        </DialogHeader>
        <div className="py-4">
             <ScrollArea className="h-64">
                <div className="space-y-1 pr-4">
                    {availableContacts.length > 0 ? availableContacts.map((user) => (
                        <div
                        key={user.id}
                        className={cn("flex items-center gap-3 rounded-lg p-2 text-left text-sm transition-all cursor-pointer hover:bg-secondary", isSelected(user) && "bg-secondary")}
                        onClick={() => handleUserSelect(user)}
                        >
                            <UserAvatar user={user} />
                            <span className="flex-1 font-medium">{user.name}</span>
                            {isSelected(user) && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                    )) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>No other contacts to add.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add to Call</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
