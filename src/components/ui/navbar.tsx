'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User } from 'lucide-react';
import { ModeToggle } from './theme-mode-toggle';
import { HamburgerMenuIcon, CodeIcon } from "@radix-ui/react-icons";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getUser, getUserData, logout } from '@/utilities/appwrite-utils';
import { useAppContext } from '@/app/context/AppContext'
import Notification from '@/components/ui/notification';
import UserAvatar from './username-avatar';
import { log } from 'console';




const Navbar = ({ }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [LoggedIn, setLoggedIn] = useState(false);
    const { accountInfo, setAccountInfo }: any = useAppContext();
    const { currentUserData, setCurrentUserData }: any = useAppContext();
    const router = useRouter();
    useEffect(() => {
        // getting user session
        getUser().then((res) => {
            if (res) {
                console.log('account info res', res)
                // getting user data
                getUserData(res.$id).then((data) => {
                    console.log(' user data', data)
                    setCurrentUserData(data.documents[0])
                    // console.log(' usercurrent data', currentUserData)
                    // setLoggedIn(true);
                })
                setLoggedIn(true);
                if (!accountInfo.$id) {
                    setAccountInfo(res)
                }
            }
        })
            .catch((err) => {
                console.log(err)
            })
    }, [accountInfo]);

    // menu items for non logged in users
    const menuItemsLoggedOut = [
        { name: "Home", link: "/" },
        { name: 'Features', link: '#features' },
        { name: "Explore", link: "#explore" },
        { name: "FAQ", link: "#faq" },
        { name: "Contact", link: "/contact" },
    ];

    //  menu items
    const menuItems = [
        { name: "Explore", link: "/explore" },
        { name: "Create Contest", link: "/create" },
        { name: "My Contests", link: "/mycontests" },
        { name: "Contact", link: "/contact" },
    ];

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        logout().then(() => {
            setLoggedIn(false)
            router.push('/')

        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <nav className="text-secondary-foreground dark:text-secondary-foreground sticky top-0 z-50 backdrop-filter backdrop-blur-md">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo and site name */}
                    <Link href={LoggedIn ? '/explore' : '/'}>
                        <div className="flex-shrink-0 flex items-center">
                            <CodeIcon className=" w-10 h-10 text-xl font-extrabold text-primary" />
                            <span className="ml-2 text-xl font-bold">CodeXCash</span>
                        </div>
                    </Link>


                    {/* Desktop Navigation links */}
                    <div className="hidden lg:block">
                        <div className="flex space-x-14 font-semibold">
                            {LoggedIn ? (
                                menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.link}
                                        className=" hover:text-primary dark:hover:text-primary "
                                    >
                                        {item.name}
                                    </Link>
                                ))) : (
                                menuItemsLoggedOut.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.link}
                                        className=" hover:text-primary dark:hover:text-primary "
                                    >
                                        {item.name}
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sign in / Register or User info */}
                    <div className="flex">
                        <div className="hidden lg:block mx-4">
                            {LoggedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <UserAvatar username={currentUserData.username} avatarUrl={process.env.NEXT_PUBLIC_AVATAR_IMAGE_URL + currentUserData.user_id} reverse={true} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <Link href='/settings'>
                                            <DropdownMenuItem>Settings</DropdownMenuItem>
                                        </Link>
                                        <Link href='/wallet'>
                                            <DropdownMenuItem>Sol Wallet</DropdownMenuItem>
                                        </Link>
                                        <DropdownMenuItem onClick={handleLogout}>logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex space-x-4">
                                    <Link href='/login'>
                                        <Button className='font-semibold' variant='secondary'>Login</Button>
                                    </Link>
                                    <Link href='/signup'>
                                        <Button className='font-semibold' >Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex">
                            <div className='lg:hidden flex items-center'>
                                <Button variant="outline" onClick={toggleMobileMenu}>
                                    <HamburgerMenuIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            {LoggedIn && <Notification />}
                            <ModeToggle />
                        </div>
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden">
                        <div className="flex flex-col space-y-2 mt-2">
                            {LoggedIn ? (
                                menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.link}
                                        className=" hover:text-primary dark:hover:text-primary "
                                    >
                                        {item.name}
                                    </Link>
                                ))
                            ) : (
                                menuItemsLoggedOut.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.link}
                                        className=" hover:text-primary dark:hover:text-primary "
                                    >
                                        {item.name}
                                    </Link>
                                ))
                            )}

                            <div className="">
                                {LoggedIn ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <UserAvatar username={currentUserData.username} avatarUrl={process.env.NEXT_PUBLIC_AVATAR_IMAGE_URL + currentUserData.user_id} reverse={false} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <Link href='/settings'>
                                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                            </Link>
                                            <Link href='/wallet'>
                                                <DropdownMenuItem>Sol Wallet</DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem onClick={handleLogout}>logout</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <div className="flex flex-col space-y-2">
                                        <Link href='login'>
                                            <Button variant="outline" onClick={() => {
                                                toggleMobileMenu()
                                            }} >Sign In</Button>
                                        </Link>
                                        <Link href='signup'>
                                            <Button onClick={() => {
                                                toggleMobileMenu()
                                            }} >Register</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );
};

export default Navbar;
