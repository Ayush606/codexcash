'use client';
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp, login } from '@/utilities/appwrite-utils'
import { useRouter } from "next/navigation";
import { LoaderPinwheelIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/app/context/AppContext";



export default function SignUpPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const { accountInfo, setAccountInfo } = useAppContext();
    const { toast } = useToast()
    // Handle form submission
    const handleSignUp = async () => {
        const email = (document.getElementById('email') as HTMLInputElement).value
        const password = (document.getElementById('password') as HTMLInputElement).value
        const name = (document.getElementById('Full-name') as HTMLInputElement).value
        if (!email || !password || !name) {
            return toast({
                title: 'All fields are required',
                variant: 'destructive'
            })
        }
        setLoading(true)

        signUp(email, password, name).then(() => {
            login(email, password).then((res) => {
                setAccountInfo({ $id: res.userId });
                setLoading(false)
                toast({ title: 'Account created successfully' })
                router.replace('/explore')

            })
                .catch((error) => {
                    setLoading(false)
                    console.error(error)
                    toast({
                        title: error.message,
                        variant: 'destructive'
                    })
                })
        })
            .catch((error) => {
                setLoading(false)
                console.error(error)
                toast({
                    title: error.message,
                    variant: 'destructive'
                })
            })
    }

    return (
        <>
            <Card className="mx-auto max-w-sm mt-2">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="Full-name">Full Name</Label>
                            <Input id="Full-name" placeholder="Jhon Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" />
                        </div>
                        <Button onClick={handleSignUp} className="w-full">
                            {loading ? <LoaderPinwheelIcon className="animate-spin" /> : 'Create an Account'}
                        </Button>
                        {/* <Button variant="outline" className="w-full">
                        Sign up with GitHub
                    </Button> */}
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
