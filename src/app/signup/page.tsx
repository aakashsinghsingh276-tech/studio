
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSignup = () => {
        // In a real app, you would register the user and send a verification email.
        localStorage.setItem("auth-step", "email-pending");
        router.push("/verify-email");
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/30">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle>Create an Account</CardTitle>
                    <CardDescription>Enter your details to get started with ChatOn.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2 relative">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type={showPassword ? "text" : "password"} />
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
                     <div className="space-y-2 relative">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} />
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 bottom-1 h-8 w-8"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" onClick={handleSignup}>
                        <UserPlus className="mr-2" />
                        Sign Up
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Log In
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
