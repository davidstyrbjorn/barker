import mongoose from 'mongoose';
import { Schema, model, connect } from 'mongoose';

export interface IUser extends mongoose.Document {
    name: string,
    supertokensId: string,
    following: Array<string>, // manual id reference to another user
    posts: Array<string>, // manual id refernece to a post
    likedPosts: Array<string>
}

// Create mongoose schema!
const userSchema = new Schema<IUser>({
    name: {
        type: String, required: true, unique: true
    },
    supertokensId: {
        type: String, required: true, unique: true
    },
    following: [{
        type: String, required: true 
    }],
    posts: [{
        type: String, required: true 
    }],
    likedPosts: [{
        type: String, required: true,
    }],
});

// Adds increments number of likes on post and adds users who liked post, returns flag for if post is found
export const addLikeToUser = async (user: string, post: string): Promise<boolean> => {

    // Find post which is liked by user
	const userData = await User.findById(user).exec(); 
	if (!userData) {
		return false;
	}
    
    userData.likedPosts.push(post);
    
    // Actually update the document
    await User.findByIdAndUpdate(user, {
        ...userData
    });

	return true;
}

export const removeLikeFromUser = async (user:string, post:string) => {
    // Find the user who likes the post
	const userData = await User.findById(user).exec(); 
	if (!userData) {
		return false;
	}

	// Decrement likes and remove post from users lists of likes
	let removalIndex: number = userData.likedPosts.indexOf(post);
	if (removalIndex !== -1) {
		userData.likedPosts.splice(removalIndex, 1);
	}

    // Actually update the document
    await User.findByIdAndUpdate(user, {
        ...userData
    });

	return true;
}

// Some nice utility stuff for user
export function isoftypeUser(obj: any): boolean {
    if(("name" in obj) && ("supertokensId" in obj) && 
        ("following" in obj) && ("posts" in obj) && ("likedPosts" in obj)) {
        return true;
    }
    else {
        return false;
    }
}

// Finally, create a model from the Schema and export
export const User = model<IUser>('User', userSchema);