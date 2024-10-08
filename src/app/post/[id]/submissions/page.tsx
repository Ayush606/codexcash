"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Trophy, Users } from "lucide-react"
import { useParams } from "next/navigation"
import { listSubmissions } from "@/utilities/appwrite-utils"
import { useAppContext } from '@/app/context/AppContext'

import UserAvatar from "@/components/ui/username-avatar"

interface Submissions {
    $id: string
    contest_id: string
    dev_id: string
    username: string
    created_at: string
    rich_text: string
}

export default function Contests() {
    const params = useParams<{ id: string }>()
    const { id } = params
    const [submissions, setSubmissions] = useState<Submissions[]>([])
    const [loading, setLoading] = useState(true)
    const { accountInfo } = useAppContext();

    useEffect(() => {
        // list of all submissions for this contest
        listSubmissions(id).then((res) => {
            console.log('submissions for', res)
            setSubmissions(res.documents)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
        })

    }, [id])

    if (loading) {
        return <div className="text-center py-10">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Here are the submissions for this contest</h1>
            <hr className="mb-4" />
            {submissions.length === 0 ? (
                <Card className="text-center py-10">
                    <CardContent>
                        <p className="mb-4">Your contest has no submissions yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* filtering out submissions if dev_id equals to account.$id and remove duplicate dev_id*/}
                    {submissions.filter((submission) => submission.dev_id !== accountInfo.$id).filter((submission, index, self) =>
                        index === self.findIndex(s => s.dev_id === submission.dev_id)).map((submission) => (
                            <Card key={submission.$id}>
                                <CardHeader>
                                    <CardTitle className="mb-2">Submission By</CardTitle>
                                    <UserAvatar username={submission.username} avatarUrl={process.env.NEXT_PUBLIC_AVATAR_IMAGE_URL + submission.dev_id} />
                                    <CardDescription>
                                        <CalendarDays size={16} className="mr-2  inline-flex" />
                                        {new Date(submission.created_at).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button asChild>
                                        <Link className="w-full" href={`/post/${id}/submissions/${submission.dev_id}`}>View Submission</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                </div>
            )}

            <div className="mt-8 text-center">
                <Button asChild>
                    <Link href={`/post/${id}`}>Back To Contest</Link>
                </Button>
            </div>
        </div>
    )
}