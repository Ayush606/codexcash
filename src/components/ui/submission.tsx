import React, { useEffect, useState } from 'react'
import QuillEditor from './quill-editor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createSubmission, getSubmissions } from '@/utilities/appwrite-utils'
import { useAppContext } from '@/app/context/AppContext'
import { useParams } from 'next/navigation'
import UserAvatar from './username-avatar'

interface Content {
    $id: string
    contest_id: string
    dev_id: string
    rich_text: string
    created_at: string
    username: string
}



function Submission() {
    //  getting posted submission
    const params = useParams<{ id: string, devId: string }>()
    const { id, devId } = params
    const [submission, setSubmission] = useState('');
    const { accountInfo, currentUserData, submissions, setSubmissions } = useAppContext();
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        // getting submission for the client
        if (id && devId) {
            getSubmissions(id, devId).then((res) => {
                setSubmissions(res.documents)
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }
        if (id && !devId) {
            getSubmissions(id, accountInfo.$id).then((res) => {
                setSubmissions(res.documents)
                console.log(res)

            }).catch((err) => {
                console.log(err)
            })
        }
    }, [accountInfo])

    function handleSubmit() {
        setLoading(true)
        console.log('submission', submission)
        // creating submission
        createSubmission(id, accountInfo.$id, submission, new Date().toISOString(), currentUserData.username).then((res) => {
            setLoading(false)
            setSubmissions([...submissions, res])
            console.log(res, accountInfo.$id)
            setSubmission('')
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <Card className="w-full max-w-6xl mx-auto border-t-0 text-left">
            <CardHeader>
                <CardTitle className='text-center'>Submissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* showing submission */}
                <ScrollArea className='h-80'>
                    {
                        submissions.map((content: Content) => (
                            <div key={content.$id} className="flex items-end ">
                                <UserAvatar avatarUrl={process.env.NEXT_PUBLIC_AVATAR_IMAGE_URL + 'srrw'} reverse={false} />
                                <div className="flex-1">
                                    <div className="">
                                        <span className="font-semibold">{content.username}</span>
                                        <div>
                                            <div className='messages text-sm' dangerouslySetInnerHTML={{ __html: content.rich_text }} />
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
                    <QuillEditor
                        editorFor="submission"
                        submission={submission}
                        onSubmissionChange={setSubmission}
                    />
                </div>
                <Button onClick={handleSubmit} className="w-full">{loading ? 'Submitting...' : 'Submit'}</Button>
            </CardFooter>
        </Card>

    )
}

export default Submission