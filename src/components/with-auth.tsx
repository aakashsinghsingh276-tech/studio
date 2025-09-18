
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

const protectedRoutes = ["/", "/settings", "/calls", "/contacts", "/avatar-studio", "/new/group"];

export default function WithAuth({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        try {
            const authStep = localStorage.getItem("auth-step");
            const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

            if (isProtectedRoute) {
                 if (authStep !== "loggedIn") {
                    if (authStep === 'email-verified') {
                        router.replace("/login");
                    } else if (authStep === 'phone-verified') {
                         router.replace("/phone-number");
                    } else if (authStep === 'otp-verified') {
                        // This case should ideally lead to login, but let's be safe
                         router.replace("/login");
                    } else {
                        router.replace("/signup");
                    }
                } else {
                    setIsAuthorized(true);
                }
            } else {
                // If on a public route, no auth check needed
                 setIsAuthorized(true);
            }
        } catch (error) {
            console.warn("Could not access localStorage. Assuming not authorized.");
            router.replace("/signup");
        }
    }, [router, pathname]);

    if (isAuthorized === null && protectedRoutes.some(route => pathname.startsWith(route))) {
        return (
             <div className="flex h-screen w-full items-center justify-center p-8">
                <div className="flex flex-col space-y-3 w-full">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
