import { useMutation } from "react-query";
import { PostAPIHookFunction } from "supertokens-auth-react/lib/build/types";
import { Like, Post, User } from "../../types";
import { client } from "../httpCommon";
import { useGetUser } from "../query/userQuery";

// Helper function for adding a user to the database
export const createUser = async (user: User) => {
	return await client.post('/user/create', user);
}

// Uploads post with author and blob to database using FormData
export const createPost= async (authorId: string, blob: Blob) => {
	const formData = new FormData();
	formData.append('file', blob);

	return client({
		method: "post",
		url: "/post/create",
		data: formData,
		params: { authorId },
		headers: { "Content-Type": "multipart/form-data" },
	})
}

// Mutate the users following list
export const useUpdateFollowing = () => {
	const updateFollowing = (user:User) => {
		return client.post(`/user/update?id=${user._id}`, {following: user.following});
	}
	
	return useMutation(updateFollowing);
}

export const likePost = async(userId: string, postId: string) => {
	return client({
		method: "post",
		url: "/likes/like",
		params: {userId, postId}
	});
}

export const dislikePost = async(userId: string, postId: string) => {
	return client({
		method: "post",
		url: "/likes/dislike",
		params: {userId, postId}
	});
}