
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { users, loggedInUserId } from "@/lib/data";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();
    const me = users.find(u => u.id === loggedInUserId);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // In a real app, you'd verify credentials
        localStorage.setItem("auth-step", "phone-pending");
        router.push("/phone-number");
    };

    if (!me) return null;

    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/30">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <UserAvatar user={me} className="h-24 w-24" />
                    </div>
                    <CardTitle>Welcome Back!</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" defaultValue="you@chaton.ai" />
                    </div>
                    <div className="space-y-2 relative">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type={showPassword ? "text" : "password"} defaultValue="password" />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 bottom-1 h-8 w-8"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" onClick={handleLogin}>
                        <LogIn className="mr-2" />
                        Log In
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
