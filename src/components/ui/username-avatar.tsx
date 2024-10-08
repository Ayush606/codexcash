import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface UserAvatarProps {
    username?: string | null;
    avatarUrl?: string;
    reverse?: boolean;
}

function Username({ username }: { username: string }) {
    return <span className="text-sm font-medium">{username || ''}</span>
}

export default function UserAvatar({ username, avatarUrl, reverse = false }: UserAvatarProps) {
    const avatarElement = (
        <Avatar className="h-8 w-8 rounded-md">
            <AvatarImage src={avatarUrl} alt={username || ''} />
            <AvatarFallback>{username ? username.slice(0, 2).toUpperCase() : ''}</AvatarFallback>
        </Avatar>
    )

    const usernameElement = <Username username={username || ''} />

    return (
        <div className="" >

            {reverse ? (
                <>
                    <Button className="flex space-x-3 pr-0 py-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground ">
                        {usernameElement}
                        {avatarElement}
                    </Button>
                </>
            ) : (
                <>
                    <div className="inline-flex space-x-2 pr-4 rounded-md  hover:bg-accent hover:text-accent-foreground ">
                        {avatarElement}
                        {usernameElement}
                    </div>
                </>
            )}

        </div >
    )
}
