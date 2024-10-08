'use client'

import { useEffect } from 'react'
import { Bell, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAppContext } from '@/app/context/AppContext' // Assuming you have an AppContext file
import { getNotifications, updateNotification } from '@/utilities/appwrite-utils'
import Link from 'next/link'

type Notification = {
    $id: string
    title: string
    message: string
    read: boolean
    content_id: string
    user_id: string
    created_at: string
    // Add other properties as needed
}

export default function Notification() {
    const {
        notifications,
        setNotifications,
        hasNewNotification,
        setHasNewNotification,
        accountInfo
    } = useAppContext();

    useEffect(() => {
        // Fetch notifications
        if (Object.keys(accountInfo).length !== 0) {
            console.log('accountInfo from noti', accountInfo)
            getNotifications(accountInfo.$id).then((res) => {
                console.log('res noti', res.documents.reverse())
                // Set notifications by new notifications first
                setNotifications(res.documents);

                if (res.documents.length > 0) {
                    setHasNewNotification(res.documents.filter((notification) => !notification.read).length);
                }
            })
                .catch((err) => {
                    console.log(err)
                });

        }
    }, [accountInfo])

    const handleOpenNotifications = () => {
        // Mark all notifications as read
        setHasNewNotification(0);
        for (const notification of notifications) {
            if (!notification.read) {
                updateNotification(notification.$id).then(() => {
                    setHasNewNotification(0)
                })
                    .catch((err) => {
                        console.log(err)
                    });
            }
        }

    }


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-md mx-1"
                    onClick={handleOpenNotifications}
                >
                    <Bell className="h-5 w-5" />
                    {hasNewNotification > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-sm flex justify-center items-center">
                            {hasNewNotification}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">

                <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No new notifications.</p>
                    ) : (

                        <div className="space-y-4 w-full max-w-md mx-auto">
                            {notifications.map((notification: Notification) => (
                                <Link href={`/post/${notification.content_id}`} key={notification.$id}>
                                    <Card key={notification.$id} className="overflow-hidden my-4 hover:bg-accent/80">
                                        <CardContent className="p-0 w-80">
                                            <div className="flex items-start space-x-4 p-4">
                                                <div className="flex-shrink-0">
                                                    <div className="rounded-full bg-primary/10 p-2">
                                                        <Bell className="h-4 w-4 text-primary" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold font-medium truncate">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm  mt-1">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className=" text-sm text-muted-foreground px-4 py-2 sm:px-6">
                                                <time dateTime={notification.created_at} className="">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </time>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}