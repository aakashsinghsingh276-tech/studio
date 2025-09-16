
"use client"

import { useState, useEffect, useCallback } from 'react';

const WALLPAPER_KEY = 'chat-wallpaper';
const DIMMING_KEY = 'chat-wallpaper-dimming';
const DEFAULT_WALLPAPER = "https://picsum.photos/seed/chat-bg/800/1200";
const DEFAULT_DIMMING = 0;

export function useWallpaper() {
    const [wallpaper, setWallpaperState] = useState(DEFAULT_WALLPAPER);
    const [dimming, setDimmingState] = useState(DEFAULT_DIMMING);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedWallpaper = localStorage.getItem(WALLPAPER_KEY);
            const savedDimming = localStorage.getItem(DIMMING_KEY);

            if (savedWallpaper) {
                setWallpaperState(savedWallpaper);
            }
            if (savedDimming) {
                setDimmingState(Number(savedDimming));
            }
        } catch (error) {
            console.warn("Could not access localStorage. Wallpaper settings will not be saved.");
        }
        setIsLoaded(true);
    }, []);

    const setWallpaper = useCallback((newWallpaper: string, newDimming: number) => {
        try {
            localStorage.setItem(WALLPAPER_KEY, newWallpaper);
            localStorage.setItem(DIMMING_KEY, String(newDimming));
        } catch (error) {
            console.warn("Could not access localStorage. Wallpaper settings will not be saved.");
        }
        setWallpaperState(newWallpaper);
        setDimmingState(newDimming);
    }, []);

    return { 
        wallpaper: isLoaded ? wallpaper : DEFAULT_WALLPAPER, 
        dimming: isLoaded ? dimming : DEFAULT_DIMMING, 
        setWallpaper,
        defaultWallpaper: DEFAULT_WALLPAPER
    };
}
