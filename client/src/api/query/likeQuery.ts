import { useQuery } from "react-query";
import { Like } from "../../types";
import { client } from "../httpCommon";
import { useGetUser } from "./userQuery";

// Check if the logged in user has liked a post with postId
export const useGetLike = (postId: string) => {
    const user = useGetUser();
    const getLike = async () => {
        return (await client.get(`/like/get`, {
            params: {
                user: user.data._id,
                post: postId
            }
        })).data;
    }

    return useQuery<Like>(['like'], getLike, {
        enabled: !!user
    });
} 