
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleVerification = () => {
        // In a real app, this would be handled by the user clicking a link in their email.
        localStorage.setItem("auth-step", "email-verified");
        router.push("/login");
    };

    const handleResendLink = () => {
        // In a real app, you would trigger a service to send another email.
        toast({
            title: "Verification Link Sent",
            description: "A new verification link has been sent to your email address.",
        });
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/30">
            <Card className="w-full max-w-sm text-center">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                         <MailCheck className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>
                        A verification link has been sent to your email address. Please check your inbox and click the link to continue.
                    </d_card-description>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                       Can't find the email? Check your spam folder or request a new link.
                    </p>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={handleVerification}>
                        (Simulate) I've Verified My Email
                    </Button>
                     <Button variant="link" size="sm" onClick={handleResendLink}>Resend verification link</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
