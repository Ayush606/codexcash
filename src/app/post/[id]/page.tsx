'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, User } from 'lucide-react'
import { getContest, getUserData } from '@/utilities/appwrite-utils'
import './../rich-text-editor.css'
import Discussion from '@/components/ui/discussion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Submission from '@/components/ui/submission'
import { useAppContext } from '@/app/context/AppContext'



const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface Post {
    id: string
    client_id: string
    title: string
    description: string
    rich_text: string
    reward: number
    deadline: string
}

export default function PostPage() {
    const params = useParams<{ id: string }>()
    const { id } = params
    const [post, setPost] = useState<Post | null>(null)
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [winnerData, setWinnerData] = useState({})
    const [hideTabs, setHideTabs] = useState(false)
    const { accountInfo } = useAppContext();

    useEffect(() => {
        const contest = getContest(id);
        contest.then((res) => {
            console.log(res)
            setPost(res)
            if (res.winner_id !== "") {
                getUserData(res.winner_id).then((res) => {
                    setWinnerData(res.documents[0])
                    setHideTabs(true)
                }).catch((err) => {
                    console.log(err)
                })
            }
        })
            .catch((err) => {
                console.log(err)
            });

    }, [id])

    useEffect(() => {
        if (post) {
            const timer = setInterval(() => {
                const now = new Date()
                const deadline = new Date(post.deadline)
                const distance = deadline.getTime() - now.getTime()

                if (distance < 0) {
                    clearInterval(timer)
                    setTimeLeft('Deadline passed')
                } else {
                    setTimeLeft(formatDistanceToNow(deadline, { addSuffix: true }))
                }
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [post])

    if (!post) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-6xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
                            <CardDescription className="mt-2">
                                <span className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Client ID: {post.client_id}
                                </span>
                            </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                            {post.reward.toLocaleString()}
                            <p className="inline-block ml-1">
                                SOL
                            </p>
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">{post.description}</p>
                    <Separator className="my-4" />
                    <div className="mb-4 rich-text-editor">
                        <h3 className="text-lg font-semibold mb-2">Detailed Information</h3>
                        <ReactQuill
                            value={post.rich_text}
                            readOnly={true}
                            theme="snow"
                            modules={{ toolbar: false }}
                        />
                    </div>
                    <Separator className="my-4" />
                    {hideTabs ? '' : (
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                                <span className="font-semibold">Deadline:</span>
                            </div>
                            <div className="text-right">
                                <p>{format(new Date(post.deadline), 'PPpp')}</p>
                                <p className="text-sm text-muted-foreground">{timeLeft}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    {accountInfo.$id === post.client_id ? (
                        <Link className='text-center mx-auto' href={`/post/${id}/submissions`}>
                            <Button className="m-2">View All Submissions For Your Contests</Button>
                        </Link>
                    ) : ''}
                </CardFooter>
            </Card>

            {hideTabs ? ''
                : (
                    <div className='flex w-full max-w-6xl mx-auto justify-center bg-background rounded-md text-center'>
                        <Tabs defaultValue="discussion" className="w-full max-w-6xl mx-auto">
                            <TabsList>
                                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                                {
                                    accountInfo.$id === post.client_id ? (
                                        ''
                                    ) : <TabsTrigger value="submission">Submission</TabsTrigger>
                                }
                            </TabsList>
                            <TabsContent className='text-left' value="discussion">
                                <Discussion />
                            </TabsContent>
                            <TabsContent value="submission">
                                <Submission />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            <div className='flex w-full max-w-6xl mx-auto justify-center bg-background rounded-md text-center'>
                {winnerData.username ? <p className="text-center text-xl">Winner of this contest is {winnerData.username}</p> : ''}
            </div>
        </div>
    )
}