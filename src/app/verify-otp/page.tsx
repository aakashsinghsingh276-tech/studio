
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MessageSquareShare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyOtpPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleVerifyOtp = () => {
        // In a real app, you would verify the OTP against the one sent to the user.
        localStorage.setItem("auth-step", "loggedIn"); // Final step
        router.push("/");
    };

    const handleResendCode = () => {
        // In a real app, you would trigger the service to send another OTP.
        toast({
            title: "Code Resent",
            description: "A new 6-digit code has been sent to your phone number.",
        });
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/30">
            <Card className="w-full max-w-sm text-center">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                         <MessageSquareShare className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>Enter Verification Code</CardTitle>
                    <CardDescription>
                        A 6-digit code was sent to your phone number. Please enter it below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Input className="max-w-xs text-center text-2xl tracking-[0.5em]" maxLength={6} placeholder="_ _ _ _ _ _" />
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={handleVerifyOtp}>
                        Verify & Log In
                    </Button>
                    <Button variant="link" size="sm" onClick={handleResendCode}>Didn't receive a code?</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
