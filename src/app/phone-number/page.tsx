
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Smartphone } from "lucide-react";

export default function PhoneNumberPage() {
    const router = useRouter();

    const handleSendOtp = () => {
        // In a real app, you would send an OTP to the user's phone number.
        localStorage.setItem("auth-step", "otp-pending");
        router.push("/verify-otp");
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/30">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                         <Smartphone className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>Enter Your Phone Number</CardTitle>
                    <CardDescription>We'll send you a verification code.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSendOtp}>
                        Send Code
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
