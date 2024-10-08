
import ContestCard from '@/components/ui/contest-card'
import Link from 'next/link'


export default async function ExplorePage() {
    // fetch contests from the server
    const escrowData = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_DATABASE_ID}/collections/${process.env.NEXT_PUBLIC_ESCROW_COLLECTION_ID}/documents`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': process.env.NEXT_PUBLIC_PROJECT_ID,
        },
        cache: 'no-store'
    })

    const escrows = await escrowData.json()
    // getting all the contest_ids from the escrow collection
    const contestIds = escrows.documents.map((escrow: any) => escrow.contest_id)
    // console.log(contestIds)

    // fetch contests from the server
    const contestData = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_DATABASE_ID}/collections/${process.env.NEXT_PUBLIC_CONTESTS_COLLECTION_ID}/documents`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': process.env.NEXT_PUBLIC_PROJECT_ID,
        },
        cache: 'no-store'
    })

    // getting all the contests from the contest collection
    const contests = await contestData.json()
    // console.log(contests)

    // fitting the contests with the escrowsIds
    const filteredContests = contests.documents.filter((contest: any) => contestIds.includes(contest.$id))
    console.log(filteredContests)
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Explore Contests</h1>
            <hr />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* <ContestCard
                    title="Create A sol nft cntract with good looking website"
                    description="I want as website which has a nft contract intigarated with the sol and made it using react nextjs, appwrite etc"
                    price={149.99}
                    endDate={new Date('2024-12-31T23:59:59')}
                /> */}
                {/* adding contest here */}
                {filteredContests.map((contest: any) => (
                    <Link href={`/post/${contest.$id}`} key={contest.$id}>
                        <ContestCard
                            key={contest.$id}
                            title={contest.title}
                            description={contest.description}
                            amount={contest.reward}
                            endDate={new Date(contest.deadline)}
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}