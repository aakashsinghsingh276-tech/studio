
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function TwoStepVerificationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleEnable = () => {
    if (pin.length < 6) {
        toast({
            variant: "destructive",
            title: "Invalid PIN",
            description: "Your PIN must be at least 6 digits long.",
        });
        return;
    }
    if (pin !== confirmPin) {
      toast({
        variant: "destructive",
        title: "PINs do not match",
        description: "Please make sure your PINs match and try again.",
      });
      return;
    }
    setIsEnabled(true);
    toast({
      title: "Two-Step Verification Enabled",
      description: "Your account is now more secure.",
    });
  };

  const handleDisable = () => {
    setIsEnabled(false);
    setPin("");
    setConfirmPin("");
    toast({
      title: "Two-Step Verification Disabled",
    });
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Two-Step Verification</h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 md:p-8">
        <div className="mx-auto max-w-2xl space-y-8">
            <Card className="text-center">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <KeyRound className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>Two-Step Verification</CardTitle>
                    <CardDescription>
                        For added security, enable two-step verification, which will require a PIN when registering your phone number with ChatOn again.
                    </CardDescription>
                </CardHeader>
                {!isEnabled ? (
                <>
                    <CardContent className="space-y-4 text-left">
                         <div className="space-y-2">
                            <Label htmlFor="pin">Create a 6-digit PIN</Label>
                            <Input 
                                id="pin" 
                                type="password" 
                                maxLength={6} 
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-pin">Confirm your PIN</Label>
                            <Input 
                                id="confirm-pin" 
                                type="password" 
                                maxLength={6} 
                                value={confirmPin}
                                onChange={(e) => setConfirmPin(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleEnable} className="w-full">
                            Enable
                        </Button>
                    </CardFooter>
                </>
                ) : (
                <CardFooter>
                    <Button onClick={handleDisable} variant="destructive" className="w-full">
                        Disable
                    </Button>
                </CardFooter>
                )}
            </Card>
        </div>
      </main>
    </div>
  );
}
