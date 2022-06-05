import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import { IPost, Post } from "../../models/Post";
import { isoftypeUser, IUser, User } from "../../models/User";

const router: Router = Router();

// Create (POST)
router.post('/create', async (req: Request, res: Response) => {
    // Ensure body correctness
    if(!isoftypeUser(req.body)){
        res.status(400).send("Invalid body")
        return;
    }
    // Try to parse body as IUser
    const userInfo: IUser = req.body;
    // Create and insert into mongoose
    try{
        await User.createIndexes(); // This works for some reason
        const user = new User(userInfo);
        const doc = await user.save();
        res.status(201).json(doc);
    }catch(err){
        res.status(500).send(err);
    }    
});

/* Read (GET) */

// Getting a single user given a supertokens id
router.get('/get-supertokens', async (req: Request, res: Response) => {
    // Ensure query correctness
    if(!req.query.id){
        res.status(400).send("Invalid qurey params, expecting id");
        return;
    }
    const superId = req.query.id;

    // Try to find user, will be null if none found
    const user = await User.findOne({supertokensId: superId});
    
    if(!user){
        res.status(404).send(`No user with supertokensId: ${superId} found!`);
        return;
    }
    res.status(200).json(user);
});

// Get array of users given a search string
router.get('/get-users', async (req: Request, res: Response) => {
    // Ensure query correctness
    if(!req.query.search){
        res.status(400).send("Invalid qurey params, expecting search");
        return;
    }
    const search = req.query.search;

    // Try to find user, will be null if something bad occured
    const users = await User.find({name: {$regex: search, $options: 'i'}}).sort({name: 1}).limit(10);
    if(!users){
        res.status(404).send(`Query failed`);
        return;
    }
    res.status(200).json(users);
});

// Endpoint for getting alot of users given an array of ids
router.get('/get', async(req: Request, res: Response) => {
    // Ensure body correctness
    if(!req.query.ids){
        res.status(200).json([]);
        return;
    }
    const ids: Array<string> = req.query.ids as string[];

    // Find all users with the given ids and return them, will throw error if invalid id is given
    try {
        const users = await User.find().where('_id').in(ids).exec();
        res.status(200).json(users);
    }catch(e) {
        res.status(500).send(`Query error: ${e}`);
    }
});

// Update (POST)

// Endpoint for updating a user with body data given a query param id
router.post("/update", async(req: Request, res: Response) => {
    // Ensure url correctness
    if(!req.query.id){
        res.status(400).send("Invalid query param");
        return;
    }

    // Extract id from query param
    const id = req.query.id;

    // Try to find and update a user with id, will return null if no user found
    const user = await User.findByIdAndUpdate(id, {...req.body});
    if(!user){
        res.status(404).send(`No user with id ${id} found`);
        return;
    }

    // Done!
    res.status(200).json(user);
});

// Delete (POST)
router.post("/delete", async(req: Request, res: Response) => {
    // Ensure url correctness
    if(!req.query.id){
        res.status(400).send("Invalid query param");
        return;
    }

    const id = req.query.id;

    // Try to find a user with id, result will be null if empty
    const result = await User.findByIdAndRemove(id);
    if(!result){
        res.status(404).send(`No user with id ${id} found`);
        return;
    }

    res.status(200).send(`User with id ${id} was deleted!`);
});

/**
 * Method: GET
 * It does: takes in a user's Id, and spits out an array of posts from people that user is following
 * the posts are sorted according to date, 
 * TODO: and takes in a paginator + posts per page
 */
router.get("/follower-posts", async(req: Request, res: Response) => {
    // Ensure we have a query paramter
    if(!req.query.userId){
        res.status(400).send(`Please send userId in query paramter`);
        return;
    }

    // Find the user
    const user = await User.findById(req.query.userId);
    if(!user){
        res.status(404).send(`No user with id ${req.query.userId} found`);
        return;
    }

    // Get all the users we follow
    const ids: Array<string> = user.following;
    const usersWeFollow: (IUser & {
        _id: any;
    })[] = await User.find().where('_id').in(ids).exec();

    // Get all the posts from these followers
    const postsFromFollowers: (mongoose.Document<unknown, any, IPost> & IPost & {
        _id: mongoose.Types.ObjectId;
    })[] = [];

    // Get page and limit from query parameter
	if(!req.query.page || !req.query.postsPerPage) {
		res.status(400).send(`Please send page & postsPerPage in query paramter`);
		return;	
	}
    const page: number = parseInt(req.query.page as string); // Page number
	const limit: number = parseInt(req.query.postsPerPage as string); // Number of posts per page

	let unfetched_posts = false; // Flag to continue fetching

	// Limit and skip for pagination
    for await (const u of usersWeFollow){
        const posts = await Post.find().where('_id').in(u.posts).limit(limit).skip((page - 1) * limit).exec(); // Get the posts for the current page from this user
		const next_posts = await Post.find().where('_id').in(u.posts).limit(limit).skip((page) * limit).exec(); // Check next pages posts from this user
		if (next_posts.length > 0) { // Posts left to fetch from this user
			unfetched_posts = true; // If any user has unfetched posts, there are posts left to fetch
		}
            postsFromFollowers.push(...posts);
    }

    // Sort the postsFromFollowers according to date
    postsFromFollowers.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1
    });
    
    // Done return!
    res.status(200).json({posts: postsFromFollowers, next: unfetched_posts}) // Continue fetch flag gets sent to front-end as next
});

export default router;