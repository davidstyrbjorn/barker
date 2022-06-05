																																																																																																						import axios from "axios";
import { QueryObserverSuccessResult, useInfiniteQuery, useMutation, useQuery } from "react-query";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { DownloadGCPReturnObject, Page, Post, User } from "../../types";
import { client } from "../httpCommon";

const initialData: User = {
	name: "",
	supertokensId: "",
	following: [],
	posts: [],
	likedPosts: []
}

// Custom hook for getting user data via supertokensId
export const useGetUser = () => {
	const {userId} = useSessionContext();

	// Axios request to get user by supertokensId
	const getUser = async () => {
		return (await client.get<User>(`/user/get-supertokens?id=${userId}`)).data;
	}

	// Return the built userQuery hook
	return useQuery<User>(['user'], getUser, { initialData }) as QueryObserverSuccessResult<User, never>;
}

// Hook for getting all followers for the logged in user
export const useGetFollowing = () => {
	const user = useGetUser();
		
	//axios request to get list of user objects from list of user ids
	const getFollowing = async () => {
		return (await client.get(`/user/get`, {
			params: {
				ids: user.data.following.length == 0 ? [] : user.data.following,
			}
		})).data
	}

	//querying followings will only execute once user data exists
	return useQuery<User[]>( ['followings', user], getFollowing, {
		enabled: !!user
	} );
}

// Get a single user by objectId, returned as a one element array
export const useGetUserById = (objectId: string) => {
	let queryParam:string[] = [];
	queryParam.push(objectId);

	const getUser = async () => {
		return (await client.get(`/user/get`, {
			params: {
				ids: queryParam
			}
		})).data
	}

	return useQuery<User[]>(['getUserByObjectId', objectId], getUser);
}

// Hook for getting all posts from the logged in users follow list
export const useGetPostsFromFollowing = (page: number, postsPerPage: number) => {
	const user = useGetUser();

	// Axios request
	const getPostsFromFollowing = async() => 
		(await client.get(`/user/follower-posts?userId=${user.data._id}&page=${page}&postsPerPage=${postsPerPage}`)).data

	return useInfiniteQuery<Page>(['follow-posts'], getPostsFromFollowing, {
		enabled: !!user.data._id, // Dependent on the user existing
		getNextPageParam: data => data.next, // Checks if there are any posts left to fetch from endpoint
		keepPreviousData: true, // Should cache previous data, does not right now
		refetchOnWindowFocus: false // To not fetch duplicate posts on refocus
	});
}

// Hook for getting a signed url from a post id
export const useGetSoundUrl = (postId: string) => {
	const getSoundUrl = async() => 
		(await client.get(`/post/get-sound-url?id=${postId}`)).data
	return useQuery<DownloadGCPReturnObject>([`post-${postId}-sound-url`], getSoundUrl);
}

//Hook for getting users via searchword
export const useSearchUsers = (searchWord: string) => {
	const getUsers = async() =>{
		if(searchWord == "") return [];
		return (await client.get(`user/get-users?search=${searchWord}`)).data
	}
	return useQuery<User[]>(['search-users', searchWord], getUsers);
}