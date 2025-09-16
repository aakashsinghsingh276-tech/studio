import { ChatLayout } from "@/components/chat/chat-layout";
import WithAuth from "@/components/with-auth";

export default function Home() {
  return (
    <main className="h-full">
      <WithAuth>
        <ChatLayout />
      </WithAuth>
    </main>
  );
}
