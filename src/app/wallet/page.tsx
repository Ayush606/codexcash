"use client"

import { useState, useEffect } from "react"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownIcon, ArrowUpIcon, Copy, RefreshCcw } from "lucide-react"
import { useAppContext } from "@/app/context/AppContext"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"


type Transaction = {
    id: string
    type: "incoming" | "outgoing"
    amount: number
    date: string
    from: string
    to: string
    description: string
}


export default function SolanaWalletPage() {
    const { currentUserData, setCurrentUserData }: any = useAppContext();
    const [walletAddress, setWalletAddress] = useState<string>(currentUserData.wallet_address)
    const [balance, setBalance] = useState<number | null>(null)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        setWalletAddress(currentUserData.wallet_address);
        const fetchWalletData = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // Fetch balance using @solana/web3.js
                const connection = new Connection("https://api.devnet.solana.com", "confirmed")
                const publicKey = new PublicKey(walletAddress)
                const balanceInLamports = await connection.getBalance(publicKey)
                const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL
                setBalance(balanceInSOL)

                // Fetch transactions (simulated for this example)
                const mockTransactions: Transaction[] = [
                    {
                        id: "1",
                        type: "incoming",
                        amount: 0.1,
                        date: "2023-04-15T10:30:00Z",
                        from: "5XJjsqxLhxn8wPe7N9GZnVJgMEPcTbVsZZfNb3ncNY1H",
                        to: walletAddress,
                        description: "Payment for services"
                    },
                    {
                        id: "2",
                        type: "outgoing",
                        amount: 0.05,
                        date: "2023-04-14T15:45:00Z",
                        from: walletAddress,
                        to: "9XJjsqxLhxn8wPe7N9GZnVJgMEPcTbVsZZfNb3ncNY1H",
                        description: "NFT purchase"
                    },
                    {
                        id: "3",
                        type: "incoming",
                        amount: 0.2,
                        date: "2023-04-13T09:15:00Z",
                        from: "3XJjsqxLhxn8wPe7N9GZnVJgMEPcTbVsZZfNb3ncNY1H",
                        to: walletAddress,
                        description: "Staking rewards"
                    }
                ]
                setTransactions(mockTransactions)
            } catch (err) {
                console.error("Error fetching wallet data:", err)
                setError("Failed to fetch wallet data. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchWalletData()
    }, [currentUserData, balance])

    const handleWalletAddressClick = () => {
        toast({
            title: "Wallet address copied",
            description: "Your Solana wallet address has been copied to the clipboard",
        })
        navigator.clipboard.writeText(walletAddress)
    }

    const handleRequestWithdrawalClick = () => {
        // Simulate withdrawal request
        toast({
            title: "Withdrawal requested",
            description: "Your withdrawal request has been submitted. Please allow 24-48 hours for processing.",
        })
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Solana Wallet</h1>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-12 w-1/2" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-12 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <Card className="mt-6">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full mt-4" />
                        <Skeleton className="h-20 w-full mt-4" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Solana Wallet</h1>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-red-500">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Solana Wallet</h1>
            <div className="w-full text-center">
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Public Key</CardTitle>
                        <CardDescription>Your Solana wallet address</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-mono break-all">{walletAddress}</p>
                    </CardContent>
                </Card> */}
                <Card>
                    <CardHeader>
                        <CardTitle>Current Balance</CardTitle>
                        <CardDescription>Your Solana wallet balance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center text-4xl font-bold">{balance?.toFixed(4)} SOL
                            <RefreshCcw className="w-6 h-6 ml-2 cursor-pointer" onClick={() => { setBalance(0.00001) }} />
                        </div>
                        <div className="my-4">
                            <p className="font-semibold">Your Solana wallet address</p>
                            <div onClick={handleWalletAddressClick} className="flex justify-center hover:text-primary cursor-pointer">
                                <p className="font-mono break-all ">{walletAddress}</p>
                                <Copy className="w-4 h-4 " />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">


                        <Dialog>
                            <DialogTrigger>Request Withdrawal</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Enter Your wallet Address</DialogTitle>
                                    <Input placeholder="Enter your wallet address" />
                                    <DialogDescription>
                                        We will send your withdrawal to this address. Please make sure it is correct.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogClose asChild>
                                    <Button onClick={handleRequestWithdrawalClick} variant="secondary">Request Withdrawal</Button>
                                </DialogClose>
                            </DialogContent>
                        </Dialog>

                    </CardFooter>
                </Card>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest Solana transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <p className="text-muted-foreground">No recent transactions</p>
                    ) : (
                        <ul className="space-y-4">
                            {transactions.map((transaction) => (
                                <li key={transaction.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-secondary rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        {transaction.type === "incoming" ? (
                                            <ArrowDownIcon className="text-green-500 shrink-0" />
                                        ) : (
                                            <ArrowUpIcon className="text-red-500 shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {transaction.type === "incoming" ? "From: " : "To: "}
                                                <span className="font-mono">{transaction.type === "incoming" ? transaction.from : transaction.to}</span>
                                            </p>
                                            <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleString()}</p>
                                            <p className="text-sm">{transaction.description}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold ${transaction.type === "incoming" ? "text-green-500" : "text-red-500"} md:text-right mt-2 md:mt-0`}>
                                        {transaction.type === "incoming" ? "+" : "-"}{transaction.amount.toFixed(4)} SOL
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}