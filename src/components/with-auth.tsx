
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

export default function WithAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const loggedIn = localStorage.getItem("loggedIn") === "true";
            if (!loggedIn) {
                router.replace("/login");
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.warn("Could not access localStorage. Assuming not logged in.");
            router.replace("/login");
        }
    }, [router]);

    if (isAuthenticated === null) {
        return (
             <div className="flex h-screen w-full items-center justify-center p-8">
                <div className="flex flex-col space-y-3 w-full">
                    <Skeleton className="h-[125px] w-full rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
