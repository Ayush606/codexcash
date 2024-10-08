'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUser, client } from '@/utilities/appwrite-utils';
import { useRouter } from 'next/navigation';


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const router = useRouter();
    const [accountInfo, setAccountInfo] = useState({});
    const [currentUserData, setCurrentUserData] = useState({});
    const [contests, setContests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [hasNewNotification, setHasNewNotification] = useState(0);
    const [discussions, setDiscussions] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [chats, setChats] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [friendsId, setFriendsId] = useState([]);
    const [friendsProfile, setFriendsProfile] = useState([]);
    const [call, setCall] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    // // effect for subscribing to realtime updates of notifications
    useEffect(() => {
        if (Object.keys(accountInfo).length === 0) {
            return;
        }
        console.log('hasNewNotification', hasNewNotification);
        const unsubscribe = client.subscribe(
            [`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_NOTIFICATIONS_COLLECTION_ID}.documents`],
            (res) => {
                console.log(res);
                if (res.events[5] === `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_NOTIFICATIONS_COLLECTION_ID}.documents.*.create`) {
                    console.log(res);
                    setNotifications(prev => [res.payload, ...prev]);
                    setHasNewNotification(prev => prev + 1);
                }
            }
        );

        return () => unsubscribe();



    }, [accountInfo]);

    // // effect for subscribing to realtime updates of messages
    // useEffect(() => {
    //     console.log(router);
    //     if (Object.keys(accountInfo).length === 0) {
    //         return;
    //     }
    //     const unsubscribe = client.subscribe(
    //         [`databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_CHATS_COLLECTION}.documents`],
    //         (res) => {
    //             if (window.location.pathname === `/chat/${res.payload.senderId}` || window.location.pathname === `/chat/${res.payload.receiverId}`) {
    //                 return;
    //             }
    //             if (res.events[5] === `databases.${process.env.NEXT_PUBLIC_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_CHATS_COLLECTION}.documents.*.create`) {
    //                 console.log(res);
    //                 setUnreadMessages(prev => [...prev, res.payload]);
    //                 setUnreadMessagesCount(prev => prev + 1);
    //             }
    //         });

    //     return () => unsubscribe();



    // }, [accountInfo]);


    return (
        <AppContext.Provider value={{
            contests, setContests,
            accountInfo, setAccountInfo,
            currentUserData, setCurrentUserData,
            discussions, setDiscussions,
            submissions, setSubmissions,
            friendsId, setFriendsId,
            friendsProfile, setFriendsProfile,
            notifications, setNotifications,
            hasNewNotification, setHasNewNotification,
            unreadMessages, setUnreadMessages,
            unreadMessagesCount, setUnreadMessagesCount,
            chats, setChats,
            loading, setLoading,
            error, setError,
        }}>
            {children}

        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);