import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

interface Props {
    imageUrl?: string;
    caption?: string;
}

const UserAvatar = ({
    imageUrl = "https://github.com/shadcn.png",
    caption = "RN"
}: Props) => {
    return (
        <Avatar>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{caption}</AvatarFallback>
        </Avatar>
    );
};
export default UserAvatar