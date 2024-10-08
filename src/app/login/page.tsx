'use client';
import Link from "next/link"
import { useRouter } from 'next/navigation'
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
import { login } from "@/utilities/appwrite-utils"
import { useAppContext } from "@/app/context/AppContext";
import { LoaderPinwheelIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast"


export default function LoginForm() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const { accountInfo, setAccountInfo } = useAppContext();

    const handleLogin = () => {
        const email = (document.getElementById('email') as HTMLInputElement).value
        const password = (document.getElementById('password') as HTMLInputElement).value
        if (!email || !password) {
            return toast({
                title: 'All fields are required',
                variant: 'destructive'
            })
        }
        setLoading(true)
        login(email, password).then((res) => {
            setAccountInfo({ $id: res.userId });
            setLoading(false)
            toast({ title: 'Logged in successfully' })
            router.replace('/explore')
        })
    }
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
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
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="ml-auto inline-block text-sm underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                    <Button onClick={handleLogin} className="w-full">
                        {loading ? <LoaderPinwheelIcon className="animate-spin" /> : 'Login'}
                    </Button>
                    {/* <Button variant="outline" className="w-full">
                        Login with Google
                    </Button> */}
                </div>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
