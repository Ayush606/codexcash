'use client';
import React, { useState, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
// Dynamically import ReactQuill
const QuillWrapper = dynamic(
    async () => {
        const { default: ReactQuill } = await import('react-quill')
        await import('react-quill/dist/quill.snow.css')

        return function Wrapper({ forwardedRef, ...props }: QuillWrapperProps) {
            return <ReactQuill ref={forwardedRef} {...props} />
        }
    },
    { ssr: false, loading: () => <p>Loading editor...</p> }
)
import './create-page-text-editor.css'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { ReactQuillProps } from 'react-quill';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { uploadImage, getImage, createContest } from '@/utilities/appwrite-utils';
import { getWalletBalance } from '@/utilities/solana-utils';
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useAppContext } from '@/app/context/AppContext'
import { useRouter } from 'next/navigation';
import { LoaderPinwheel } from 'lucide-react';


interface QuillWrapperProps {
    forwardedRef: React.RefObject<unknown>;
    theme: string;
    value: string;
    onChange: (value: string) => void;
    modules: unknown;
    className: string;
}

export default function CreatePage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [reward, setReward] = useState(0);
    const [deadline, setDeadline] = useState('')
    const [richText, setRichText] = useState('')
    const [loading, setLoading] = useState(false)
    const { accountInfo, setAccountInfo }: any = useAppContext();
    const { currentUserData, setCurrentUserData }: any = useAppContext();
    const { toast } = useToast()
    const router = useRouter();

    const titleLimit = 70
    const descriptionLimit = 250

    const quillRef = useRef<ReactQuillProps>(null)

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= titleLimit) {
            setTitle(e.target.value)
        }
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= descriptionLimit) {
            setDescription(e.target.value)
        }
    }

    const handleRewardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReward(e.target.valueAsNumber);
    }


    const imageHandler = () => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
            const file = input.files?.[0]
            if (file) {
                try {
                    // Upload the image to Appwrite storage
                    const uploadResult = await uploadImage(file)
                    console.log('Upload result:', uploadResult)

                    // Get the image URL from Appwrite storage
                    const imageUrl = await getImage(uploadResult.$id) // Assuming uploadResult contains the fileId
                    console.log('Image URL:', imageUrl)

                    // Insert the image into the Quill editor
                    const quill = quillRef.current?.getEditor()
                    if (quill) {
                        const range = quill.getSelection(true)
                        quill.insertEmbed(range.index, 'image', imageUrl, 'test')
                        quill.insertText(range.index + 1, '\n \n \n ') // Insert a newline after the image
                        setTimeout(() => {
                            quill.setSelection(quill.getSelection().index + 4, 0)
                        }, 0)
                    }

                } catch (error) {
                    console.error('Error uploading or inserting image:', error)
                }
            }
        }
    }

    // Handle form submission
    const handleSubmitClick = async () => {
        //  check if all fields are filled
        if (!title || !description || !reward || !deadline || !richText) {
            //  show toast
            toast({
                variant: 'destructive',
                description: 'Please fill all fields'
            })
            return

        }
        if (reward < 0.01) {
            toast({
                variant: 'destructive',
                description: 'Reward should be greater than 0.01 SOL'
            })
            return
        }

        //  check if user has enough balance
        const balance = await getWalletBalance(currentUserData.wallet_address)
        if (balance <= reward) {
            toast({
                variant: 'destructive',
                title: 'Insufficient balance',
                description: 'You do not have enough balance to create this contest',
                action: <ToastAction onClick={() => { router.push('/wallet') }} altText="fund Wallet">Fund Wallet</ToastAction>
            })
            return
        }
        setLoading(true)
        //  create contest
        createContest(accountInfo.$id, title, description, reward, deadline, new Date().toISOString(), richText).then((res) => {
            // reset form
            setTitle('')
            setDescription('')
            setReward(0)
            setDeadline('')
            setRichText('')
            setLoading(false)
            toast({
                title: 'Contest added',
                description: 'Contest has been added successfully We will notify you when it is approved',
            })
            console.log('Contest added', res)
        }).catch((err) => {
            setLoading(false)
            toast({
                variant: 'destructive',
                description: 'An error occurred, please try again'
            })
            console.error(err, accountInfo.$id)
        })

    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), [])

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle>Content Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        placeholder="Enter title"
                        value={title}
                        onChange={handleTitleChange}
                        className='w-full'
                    />
                    <div className="text-sm text-right text-muted-foreground">
                        {title.length}/{titleLimit} characters
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Write a short description</Label>
                    <Textarea
                        id="description"
                        placeholder="Enter description"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows={4}
                    />
                    <div className="text-sm text-right text-muted-foreground">
                        {description.length}/{descriptionLimit} characters
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title">Reward in SOL</Label>
                    <Input
                        id="reward"
                        placeholder="0"
                        value={reward}
                        type='number'
                        onChange={handleRewardChange}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deadline-date">Deadline</Label>
                    <div className='w-full flex'>
                        <DateTimePicker deadline={setDeadline} />
                    </div>
                </div>
                <div>
                    <Label>Rich Text Content</Label>
                    <div className='rich-text-editor'>
                        <QuillWrapper
                            forwardedRef={quillRef}
                            theme="snow"
                            value={richText}
                            onChange={setRichText}
                            modules={modules}
                            className="h-96 mb-12"
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmitClick}>
                    {loading ? <LoaderPinwheel className='animate-spin' /> : 'Submit'}
                </Button>
            </CardFooter>
        </Card>
    )
}