
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallList } from "@/components/chat/call-list";
import { calls, users } from "@/lib/data";

export default function CallsPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-4 border-b bg-card p-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Calls</h1>
      </header>

      <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <CallList calls={calls} users={users} />
        </div>
      </main>
    </div>
  );
}
