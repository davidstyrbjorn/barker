import { Request, Response, Router } from "express";
import { unlink } from "fs";
import multer from "multer";
import downloadFile from "../../cloud-storage/download";
import uploadFile from "../../cloud-storage/upload";
import { addPostToUser, IPost, isoftypePost, Post } from "../../models/Post";

// TODO: Filename should be user.id
// Setting up how multer handles incoming files
const storage = multer.diskStorage({
    filename: function (_req, file, cb) {
        cb(null, file.originalname)
    },
    destination: function (_req, _file, cb) {
        cb(null, './uploads')
    },
});

const upload = multer({ storage })
const router: Router = Router();

// Create a single post given post info in body (POST)
router.post('/create', upload.single('file'), async (req: Request, res: Response) => {
	// Ensure body correctness
	if(!req.query.authorId){
		res.status(400).send("Invalid query parameter")
		return;
	}
	
	try {
		// Create and insert into mongoose
		const post = await new Post({author: req.query.authorId});
		await post.save();

		// Also add to the users posts array
		await addPostToUser(req.query.authorId as string, post.id);

		// Upload to GCP here also
		const result = await uploadFile(post.id, `./uploads/${req.file?.originalname}`);
		if(result.error){
			res.status(500).send(result.error);
		}else{
			res.status(201).json(post);
		}
	} catch (err) {
		res.status(500).send(err);
		return;
	}	

	// Remove the file from our server, later when GCP upload is done this can perhaps be removed if the file is "moved"
    // If it is only "copied" we will have to still delete it here
    unlink(`./uploads/${req.file?.originalname}`, (err) => {
		if(!err) return;
        console.log("Error during unlink of blob file, ERROR: " + err);
    });
});
//TODO: Fix validation?: https://youtu.be/DZBGEVgL2eE?t=765

// GET taking in an array of id's
// Returns alot of posts
router.get('/read', async (req: Request, res: Response) => {
	if(!req.query.ids){
		res.status(400).send("Invalid body, expecting ids: []");
		return;
	}

	const ids: Array<string> = req.query.ids as string[];

	try{
		// Find all posts with the given ids and return them
		const posts = await Post.find().where('_id').in(ids).exec();
		res.status(200).json(posts);
	}catch(e){
		res.status(500).send(`Query error: ${e}`);
	}
})

// Update a single post given an id in query parameter and updated info in body (POST)
router.put('/update', async (req: Request, res: Response) => {
	// Check correct body form
	if(!isoftypePost(req.body)){
		res.status(400).send("Invalid body");
		return;
	}

	//check if url is correct
	if(!req.query.id) {
		res.status(400).send("Invalid query param");
		return;
	}

	const id = req.query.id;

	const post = await Post.findByIdAndUpdate(id, {...req.body});

	if(!post){
		res.status(404).send(`No post with id ${id} found`);
		return;
	}

	res.status(200).json(post);
});

// Delete a single post given id in query parameter (POST)
router.post('/delete', async (req: Request, res: Response) => {
	if(!req.query.id) {
		res.status(400).send("Invalid query param");
		return;
	}

	const id = req.query.id;

	const result = await Post.findByIdAndDelete(id);

	// TODO: Also remove from the authors post array

	if(!result){
		res.status(404).send(`No post with id ${id} found`);
		return;
	}

	res.status(200).json(`Post with id: ${id} was deleted`);
});

router.get('/get-sound-url', async(req: Request, res: Response) => {
	if(!req.query.id){
		res.status(400).send("Invalid query param");
		return;
	}

	try {
		const id = req.query.id as string;
		const url = await downloadFile(id);
		res.json(url);
	}catch(e){
		res.status(200).send(`Failed to download signed url for sound with id ${req.query.id}`);
	}
});

export default router;