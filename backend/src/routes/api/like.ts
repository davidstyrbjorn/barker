import { Request, Response, Router } from "express";
import { addLikeToPost, Post, removeLikeFromPost } from "../../models/Post";
import { addLikeToUser, removeLikeFromUser } from "../../models/User";

const router: Router = Router();

// when the user clicks like
router.post('/like', async (req: Request, res: Response) => {
    if(!req.query.userId || !req.query.postId) {
        res.status(400).send("Invalid query parameter, should contain userId & postId");
        return;
    } 

    const userId = req.query.userId as string;
    const postId = req.query.postId as string;

    // Tell post document with postId we got a like from user with userId
    await addLikeToPost(userId, postId);
    await addLikeToUser(userId, postId);

    res.sendStatus(200);
});

// when the user dislikes
router.post('/dislike', async (req: Request, res: Response) => {
    if(!req.query.userId || !req.query.postId) {
        res.status(400).send("Invalid query parameter, should contain userId & postId");
        return;
    } 

    const userId = req.query.userId as string;
    const postId = req.query.postId as string;

    // Update user and post doc to remove eachother from their array of likes field
    await removeLikeFromPost(userId, postId);
    await removeLikeFromUser(userId, postId);

    res.sendStatus(200);
});

export default router;