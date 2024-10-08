import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Github, Linkedin, Code2, Trophy, DollarSign } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border border-border mt-8">
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center">
                            <Code2 className="mr-2" /> CodeXCash
                        </h3>
                        <p className="mb-4">Empowering developers to showcase their skills and earn rewards through exciting coding challenges.</p>
                        <div className="flex space-x-4">
                            <Link href="#" className=" hover:white transition-colors">
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Twitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Github size={20} />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                <Linkedin size={20} />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">How It Works</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">For Developers</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-white transition-colors flex items-center"><Trophy className="mr-2" size={16} /> Browse Contests</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors flex items-center"><DollarSign className="mr-2" size={16} /> Leaderboard</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Resources</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">API Documentation</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
                        <p className="mb-4">Subscribe to our newsletter for the latest contests and platform updates.</p>
                        <form className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                            />
                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
                <div className="mt-6 pt-2 border-t border-border text-center">
                    <p>&copy; {new Date().getFullYear()} CodeXCash. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}