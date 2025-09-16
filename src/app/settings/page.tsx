
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Palette, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSubMenu } from "@/components/theme-toggle";
import { UserAvatar } from "@/components/chat/user-avatar";
import { users, loggedInUserId } from "@/lib/data";


export default function SettingsPage() {
  const router = useRouter();
  const me = users.find((u) => u.id === loggedInUserId);

  const handleBack = () => {
    router.back();
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
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <Link href="/avatar-studio">
                        <div className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary cursor-pointer">
                            <div className="flex items-center gap-4">
                                <UserCircle className="h-6 w-6 text-muted-foreground" />
                                <p className="font-semibold">Avatar</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {me && <UserAvatar user={me} className="h-8 w-8" />}
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </Link>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>

        </div>
      </main>
    </div>
  );
}
