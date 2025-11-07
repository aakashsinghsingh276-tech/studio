
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    ArrowLeft, 
    ChevronRight, 
    Palette, 
    UserCircle,
    Lock,
    ShieldCheck,
    Smartphone,
    FileText,
    Trash2,
    Wallpaper,
    MessageSquare,
    Bell,
    Database,
    Languages,
    HelpCircle,
    UserPlus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ThemeSubMenu } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/chat/user-avatar";
import { users, loggedInUserId } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";


const SettingsItem = ({ icon, text, hasNav = true, href, onClick }: { icon: React.ElementType, text: string, hasNav?: boolean, href?: string, onClick?: () => void }) => {
    const content = (
        <div className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary cursor-pointer" onClick={onClick}>
            <div className="flex items-center gap-4">
                {React.createElement(icon, { className: "h-6 w-6 text-muted-foreground" })}
                <p className="font-semibold">{text}</p>
            </div>
            {hasNav && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
};


export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const me = users.find((u) => u.id === loggedInUserId);

  const handleBack = () => {
    router.back();
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('auth-step');
    toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        variant: "destructive"
    });
    router.push('/signup');
  };
  
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 md:p-8">
        <div className="mx-auto max-w-2xl space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        {me && <UserAvatar user={me} className="h-16 w-16" />}
                        <div>
                            <p className="text-xl font-bold">{me?.name}</p>
                            <p className="text-muted-foreground">{me?.status}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <SettingsItem icon={Lock} text="Privacy" href="/settings/privacy" />
                    <Separator />
                    <SettingsItem icon={ShieldCheck} text="Security" href="/settings/security" />
                    <Separator />
                    <SettingsItem icon={Smartphone} text="Change number" />
                    <Separator />
                    <SettingsItem icon={FileText} text="Request account info" />
                     <Separator />
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <div className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary cursor-pointer text-destructive">
                                <div className="flex items-center gap-4">
                                    <Trash2 className="h-6 w-6" />
                                    <p className="font-semibold">Delete account</p>
                                </div>
                            </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Chats</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary cursor-pointer">
                            <div className="flex items-center gap-4">
                                <Palette className="h-6 w-6 text-muted-foreground" />
                                <p className="font-semibold">Theme</p>
                            </div>
                             <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <ThemeSubMenu />
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Separator />
                    <SettingsItem icon={Wallpaper} text="Wallpaper" href="/settings/wallpaper" />
                    <Separator />
                    <SettingsItem icon={MessageSquare} text="Chat history" />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <SettingsItem icon={Bell} text="Message, group & call tones" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Storage & Data</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <SettingsItem icon={Database} text="Manage storage" />
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Help</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <SettingsItem icon={HelpCircle} text="Help center" />
                    <Separator />
                    <SettingsItem icon={FileText} text="Terms and Privacy Policy" />
                </CardContent>
            </Card>

            <Card>
                 <CardContent className="p-0">
                    <SettingsItem icon={UserPlus} text="Invite a friend" />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
