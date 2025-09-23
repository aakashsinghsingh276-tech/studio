
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

const protectedRoutes = ["/", "/settings", "/calls", "/contacts", "/avatar-studio", "/new/group", "/video", "/audio"];
const authRoutes = ["/login", "/signup", "/verify-email", "/phone-number", "/verify-otp"];


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
                    } else if (authStep === 'phone-pending') {
                         router.replace("/phone-number");
                    } else if (authStep === 'otp-pending') {
                         router.replace("/verify-otp");
                    } else {
                        router.replace("/signup");
                    }
                } else {
                    setIsAuthorized(true);
                }
            } else if (authRoutes.includes(pathname)) {
                if (authStep === "loggedIn") {
                    router.replace("/");
                } else {
                    setIsAuthorized(true);
                }
            } else {
                 setIsAuthorized(true);
            }
        } catch (error) {
            console.warn("Could not access localStorage. Assuming not authorized.");
            setIsAuthorized(false);
            if (!authRoutes.includes(pathname)) {
              router.replace("/signup");
            }
        }
    }, [router, pathname]);

    if (isAuthorized === null) {
        return (
             <div className="flex h-screen w-full items-center justify-center p-8">
                <div className="flex flex-col space-y-3 w-full">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-[90%]" />
                    </div>
                </div>
            </div>
        );
    }

    return isAuthorized ? <>{children}</> : null;
};
