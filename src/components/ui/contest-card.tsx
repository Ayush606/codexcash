'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Clock } from "lucide-react"

interface CustomCardProps {
    title: string
    description: string
    amount: number
    endDate: Date
}

export default function ContestCard({ title, description, amount, endDate }: CustomCardProps = {
    title: "Example Card",
    description: "This is a sample description for the card. It can be longer now that we have more horizontal space.",
    amount: 99.99,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
}) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    function calculateTimeLeft() {
        const difference = endDate.getTime() - new Date().getTime()
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24))
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((difference / 1000 / 60) % 60)
            const seconds = Math.floor((difference / 1000) % 60)
            return { days, hours, minutes, seconds }
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <Card className="w-full my-4 bg-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                {/* <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                    <CardDescription className="text-base">{description}</CardDescription>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-3xl font-bold">{amount} SOL</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    Time Left:
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold" suppressHydrationWarning>
                        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s

                    </p>
                </div>
            </CardFooter>
        </Card>
    )
}