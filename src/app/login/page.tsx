
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { users, loggedInUserId } from "@/lib/data";

export default function LoginPage() {
    const router = useRouter();
    const me = users.find(u => u.id === loggedInUserId);

    const handleLogin = () => {
        localStorage.setItem("loggedIn", "true");
        router.push("/");
    };

    if (!me) return null;

    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/30">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <UserAvatar user={me} className="h-24 w-24" />
                    </div>
                    <CardTitle>Welcome back, {me.name}!</CardTitle>
                    <CardDescription>Press the button below to log in.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full" onClick={handleLogin}>
                        <LogIn className="mr-2" />
                        Log In
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
