'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)
        setError('')

        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Simulating a successful submission
        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset form after successful submission
        event.currentTarget.reset()
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg my-24">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            {isSubmitted ? (
                <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Thank you for your message. We&apos;ll get back to you soon!</span>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>
                    <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" required />
                    </div>
                    {error && (
                        <div className="flex items-center space-x-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <span>{error}</span>
                        </div>
                    )}
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            )}
        </div>
    )
}

