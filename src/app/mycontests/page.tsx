"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Trophy, Users } from "lucide-react"
import { useAppContext } from '@/app/context/AppContext'
import { getContest, getEscrowedContestIds } from '@/utilities/appwrite-utils'
import ContestCard from "@/components/ui/contest-card"

interface Contest {
    $id: string
    client_id: string
    title: string
    description: string
    reward: number
    deadline: string
    created_at: string
    rich_text: string
}

export default function Contests() {
    const [contests, setContests] = useState<Contest[]>([])
    const [loading, setLoading] = useState(true)
    const { accountInfo } = useAppContext();

    useEffect(() => {
        if (accountInfo.$id) {
            // getting escrowed contest ids
            getEscrowedContestIds(accountInfo.$id).then((res) => {
                console.log('escrowed', res)
                if (res.total === 0) {
                    setLoading(false)
                }
                // getting contests for each escrowed contest id
                res.documents.forEach((doc: any) => {
                    getContest(doc.contest_id).then((contest: Contest) => {
                        setContests([...contests, contest])
                        setLoading(false)
                    }).catch((err) => {
                        console.log(err.message)
                        setLoading(false)
                    })

                })

            }).catch((err) => {
                console.log(err)
                setLoading(false)
            })
        }
    }, [accountInfo])



    if (loading) {
        return <div className="text-center py-10">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 text-center">My Contests</h1>
            <p className="text-center font-semibold mb-4">Your created contest will be shown here!</p>
            <hr className="mb-4" />
            {contests.length === 0 ? (
                <Card className="text-center py-10">
                    <CardContent>
                        <p className="mb-4">You haven&apos;t hosted any contests yet.</p>
                        <Button asChild>
                            <Link href="/create">Create Your First Contest</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {contests.map((contest, index: number) => (
                        <Link
                            key={index}
                            href={`/post/${contest.$id}`} >
                            <ContestCard
                                title={contest.title}
                                description={contest.description}
                                amount={contest.reward}
                                endDate={new Date(contest.deadline)}
                            />
                        </Link>
                    ))}
                </div>
            )}
            {contests.length > 0 && (
                <div className="mt-8 text-center">
                    <Button asChild>
                        <Link href="/create">Create New Contest</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}