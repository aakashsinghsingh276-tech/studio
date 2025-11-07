
"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    ArrowLeft, 
    ChevronRight,
    ShieldAlert,
    KeyRound
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SecurityPage() {
  const router = useRouter();
  const [securityNotifications, setSecurityNotifications] = useState(false);

  const handleBack = () => {
    router.back();
  };
  
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Security</h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 md:p-8">
        <div className="mx-auto max-w-2xl space-y-8">
            <Card className="bg-transparent shadow-none border-0">
                <CardHeader className="items-center text-center p-4">
                    <ShieldAlert className="h-16 w-16 text-primary" />
                    <CardTitle className="text-xl">Your chats and calls are private</CardTitle>
                    <CardDescription className="max-w-md">
                        End-to-end encryption keeps your personal messages and calls between you and the people you choose. Not even ChatOn can read or listen to them. This includes your text and voice messages, audio and video calls, photos, videos, and documents.
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Security Notifications</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                             <p className="font-semibold">Show security notifications on this device</p>
                             <p className="text-sm text-muted-foreground max-w-md mt-1">
                                Get notified when your security code changes for a contact in an end-to-end encrypted chat. If you have multiple devices, this setting must be enabled on each device where you want to get notifications.
                            </p>
                        </div>
                        <Switch
                            checked={securityNotifications}
                            onCheckedChange={setSecurityNotifications}
                            aria-label="Toggle security notifications"
                        />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Two-Step Verification</CardTitle>
                </CardHeader>
                <CardContent>
                    <Link href="/settings/security/two-step" className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary cursor-pointer -m-4">
                        <div className="flex items-center gap-4">
                            <KeyRound className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Two-Step Verification</p>
                                <p className="text-sm text-muted-foreground">For extra security, require a PIN when registering your phone number with ChatOn again.</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                </CardContent>
            </Card>

        </div>
      </main>
    </div>
  );
}
