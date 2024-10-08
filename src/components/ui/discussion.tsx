'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppContext } from '@/app/context/AppContext'
import { useParams } from 'next/navigation'
import { createDiscussion, getDiscussions } from '@/utilities/appwrite-utils'


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import UserAvatar from './username-avatar'
import QuillEditor from './quill-editor'
import '@/utilities/discussion.css'

interface Message {
    $id: string
    user_id: string
    username: string
    message: string
    created_at: string
}

export default function Discussion() {
    // getting contest id from params
    const params = useParams<{ id: string }>()
    const { id } = params
    const { discussions, setDiscussions } = useAppContext()
    const [discussion, setDiscussion] = useState('')
    const { accountInfo, currentUserData } = useAppContext()
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        // getting discussion from database
        getDiscussions(id).then((res) => {
            setDiscussions(res.documents)
        }).catch((err) => {
            console.log(err)
        })

    }, [accountInfo])

    const handleSubmit = () => {
        setLoading(true)
        // creating a new discussion on database

        createDiscussion(id, accountInfo.$id, discussion, new Date().toISOString(), currentUserData.username).then((res) => {
            setDiscussions([...discussions, { user_id: accountInfo.$id, message: discussion, created_at: new Date().toISOString(), username: currentUserData.username }])
            setLoading(false)
            console.log(res)
            // reset the discussion
            setDiscussion('')
            getDiscussions(id).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
        console.log('contestId', id)
    }

    return (
        <Card className="w-full max-w-6xl mx-auto border-t-0">
            <CardHeader>
                <CardTitle className='text-center'>Message Discussion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className='h-80'>
                    {
                        discussions.map((message: Message) => (
                            <div key={message.$id} className="flex items-end ">
                                <UserAvatar avatarUrl={process.env.NEXT_PUBLIC_AVATAR_IMAGE_URL + 'srrw'} reverse={false} />
                                <div className="flex-1">
                                    <div className="">
                                        <span className="font-semibold">{message.username}</span>
                                        <div>
                                            <div className='messages text-sm' dangerouslySetInnerHTML={{ __html: message.message }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className='w-full max-w-6xl mx-auto h-56'>
                    <QuillEditor editorFor="discussion"
                        discussion={discussion}
                        onDiscussionChange={(content) => setDiscussion(content)} />
                </div>
                <Button onClick={handleSubmit} className="w-full">{loading ? 'sending...' : 'Send Message'}</Button>
            </CardFooter>
        </Card>
    )
}