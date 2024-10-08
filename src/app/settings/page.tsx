"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserSettings() {
    const [avatar, setAvatar] = useState("/placeholder.svg?height=100&width=100")
    const [username, setUsername] = useState("johndoe")
    const [bio, setBio] = useState("I'm a software developer.")
    const [email, setEmail] = useState("john@example.com")
    const [walletAddress, setWalletAddress] = useState("0x1234fasfsdgadget3454523567888")

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatar(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the updated data to your backend
        console.log("Settings updated:", { username, bio, email, walletAddress })
        alert("Settings updated successfully!")
    }

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle className="text-center">User Settings</CardTitle>
                <CardDescription className="text-center">Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={avatar} alt="User avatar" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <Label htmlFor="avatar" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                                Change Avatar
                            </Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Enter New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="wallet">Crypto Wallet Address</Label>
                        <Input
                            id="wallet"
                            className="w-64"
                            value={walletAddress}
                            disabled
                            placeholder="Enter your wallet address"
                        />
                    </div>

                    <Button type="submit" className="w-full">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    )
}