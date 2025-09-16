
"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    ArrowLeft, 
    ChevronRight,
    Timer,
    CircleUser,
    Info,
    BookUser,
    Users,
    CheckCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

type PrivacySetting = "Everyone" | "My Contacts" | "My Contacts Except..." | "Nobody";

const PrivacyItem = ({ icon, title, description, value, hasNav = true }: { icon: React.ElementType, title: string, description: string, value: PrivacySetting, hasNav?: boolean }) => (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-secondary cursor-pointer">
        <div className="flex items-center gap-4">
            {React.createElement(icon, { className: "h-6 w-6 text-muted-foreground" })}
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{value}</p>
            {hasNav && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
        </div>
    </div>
);


export default function PrivacyPage() {
  const router = useRouter();
  const [lastSeen, setLastSeen] = useState<PrivacySetting>("Everyone");
  const [profilePhoto, setProfilePhoto] = useState<PrivacySetting>("Everyone");
  const [about, setAbout] = useState<PrivacySetting>("Everyone");
  const [status, setStatus] = useState<PrivacySetting>("My Contacts");
  const [readReceipts, setReadReceipts] = useState(true);

  const handleBack = () => {
    router.back();
  };
  
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Privacy</h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 md:p-8">
        <div className="mx-auto max-w-2xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Who can see my personal info</CardTitle>
                    <CardDescription>
                        If you don&apos;t share your Last Seen & Online, you won&apos;t be able to see other people&apos;s Last Seen & Online.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <PrivacyItem icon={Timer} title="Last Seen & Online" description="" value={lastSeen} />
                    <Separator />
                    <PrivacyItem icon={CircleUser} title="Profile Photo" description="" value={profilePhoto} />
                    <Separator />
                    <PrivacyItem icon={Info} title="About" description="" value={about} />
                    <Separator />
                    <PrivacyItem icon={BookUser} title="Status" description="" value={status} />
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                             <p className="font-semibold">Read Receipts</p>
                             <p className="text-sm text-muted-foreground max-w-md">
                                If turned off, you won&apos;t send or receive Read Receipts. Read receipts are always sent for group chats.
                            </p>
                        </div>
                        <Switch
                            checked={readReceipts}
                            onCheckedChange={setReadReceipts}
                        />
                    </div>
                </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle>Groups</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <PrivacyItem icon={Users} title="Who can add me to groups" description="" value="Everyone" />
                </CardContent>
            </Card>

        </div>
      </main>
    </div>
  );
}
