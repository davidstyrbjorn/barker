export type User = {
    _id?: string,
    name: string,
    supertokensId: string,
    following: Array<string>, // manual id reference to another user
    posts: Array<string>, // manual id refernece to a post
    likedPosts: Array<string> // manual id reference to a post  
}

export type DownloadGCPReturnObject = {
    url?: string;
    error?: string;
}

export type Post = {
    _id: string,
    amountOfLikes: number,
    usersLikes: Array<string>,
    createdAt: Date,
    author: string,
}

export type Like = {
    _id?: string,
    user: string,
    post: string
}

// Infinite query returns InfiniteData<Page>, each page contains the page's posts and a flag to signify if there are more posts to fetch
export type Page = {
	posts: Array<Post>,
	next: boolean
}