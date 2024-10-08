"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()


    return (

        <Button className="rounded-lg" variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            {
                theme === "light" ? <MoonIcon className="h-[1.2rem] w-[1.2rem] " /> : <SunIcon className="h-[1.2rem] w-[1.2rem]" />
            }
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
