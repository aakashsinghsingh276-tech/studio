"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => setTheme("light-mint")}>
          Mint (Light)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-mint")}>
          Mint (Dark)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light-sky")}>
          Sky (Light)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-sky")}>
          Sky (Dark)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light-rose")}>
          Rose (Light)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-rose")}>
          Rose (Dark)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light-pikachu")}>
          Pikachu (Light)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark-pikachu")}>
          Pikachu (Dark)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ThemeSubMenu() {
    const { setTheme } = useTheme()
    return (
        <>
            <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
                System
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("light-mint")}>
              Mint (Light)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark-mint")}>
              Mint (Dark)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("light-sky")}>
              Sky (Light)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark-sky")}>
              Sky (Dark)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("light-rose")}>
              Rose (Light)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark-rose")}>
              Rose (Dark)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("light-pikachu")}>
              Pikachu (Light)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark-pikachu")}>
              Pikachu (Dark)
            </DropdownMenuItem>
        </>
    )
}
