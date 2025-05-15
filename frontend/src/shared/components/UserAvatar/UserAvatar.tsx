import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserStore } from "@/store/userStore";

const UserAvatar = () => {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);
    const profileImageUrl = useUserStore((state) => state.profileImageUrl);
    const firstName = useUserStore((state) => state.firstName);
    const lastName = useUserStore((state) => state.lastName);

    const [imageUrl, setImageUrl] = useState<string>("");
    const [caption, setCaption] = useState<string>("RN");

    useEffect(() => {
        if (isAuthenticated) {
            setImageUrl(profileImageUrl || "");
            const first = firstName?.charAt(0) || "R";
            const last = lastName?.charAt(0) || "N";
            setCaption(`${first}${last}`);
        }
    }, [isAuthenticated, profileImageUrl, firstName, lastName]);

    return (
        <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{caption}</AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
