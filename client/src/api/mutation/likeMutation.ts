import { QueryClient, useMutation, useQueryClient } from "react-query";
import { Like } from "../../types";
import {client} from "../httpCommon"



export const useCreateLike = () => {

	const createLike = (like: Like) => {
		return client.post(`/like/create`, like);	
	}

	return useMutation(createLike);

}

export const useDeleteLike = () => {
	const deleteLike = (id: string) => {
		return client.post(`/like/delete?id=${id}`);
	}

	return useMutation(deleteLike);
}