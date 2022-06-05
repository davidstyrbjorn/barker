import mongoose, { model, Schema } from "mongoose";
import { User } from "./User";

export interface IPost {
    amountOfLikes: number,
    usersLikes: Array<string>,
    createdAt: Date,
    author: string
}

const postSchema = new Schema<IPost>({
    amountOfLikes: {
        type: Number, default: 0
    },
    usersLikes: [{
        type: String, required: true, default: []
    }],
    createdAt: {
        type: Date, default: Date.now
    },
    author: {
        type: String, required: true
    }
});

export function isoftypePost(obj: any): boolean {
    if(("author" in obj)) {
        return true;
    }
    else {
        return false;
    }
}

// Adds increments number of likes on post and adds users who liked post, returns flag for if post is found
export const addLikeToPost = async (user: string, post: string): Promise<boolean> => {

    // Find post which is liked by user
	const postData = await Post.findById(post).exec(); 
	if (!postData) {
		return false;
	}
    
    // Increment likes and add user to users who like post
    postData.amountOfLikes++;
    postData.usersLikes.push(user);
    
    // Actually update the document
    await Post.findByIdAndUpdate(post, {
        ...postData
    });

	return true;
}

export const removeLikeFromPost = async (user:string, post:string) => {
	const postData = await Post.findById(post).exec(); // Find post which is liked by user, post id:s are unique
	if (!postData) {
		return false;
	}

	// Decrement likes and remove user from users who liked post
	postData.amountOfLikes--;
	let removalIndex: number = postData.usersLikes.indexOf(user);
	if (removalIndex !== -1) {
		postData.usersLikes.splice(removalIndex,1);
	}

    // Actually update the document
    await Post.findByIdAndUpdate(post, {
        ...postData
    });

	return true;
}

export const addPostToUser = async(userId: string, postId: string) => {
    // Get and modify the data
    const userData = await User.findById(userId);
    console.log(userData?.name);
    if(!userData){
        return;
    }
    userData.posts.push(postId);
    
    // Actually update the document
    await User.findByIdAndUpdate(userId, {
        posts: userData.posts
    });
}


export const Post = model<IPost>('Post', postSchema);
