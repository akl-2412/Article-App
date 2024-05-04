import express from 'express';
import {verifyToken,isAdmin,isInstrucor,isStudent} from '../utils/verifyUser.js';
import {create} from '../controllers/post.controller.js';
import {getposts,deletepost,updatepost,getInstructorPost} from '../controllers/post.controller.js'
import {createRating,getAllRating} from '../controllers/RatingAndReview.controller.js'
const router = express.Router();

router.post('/create',verifyToken,create);
router.get('/getposts',getposts);
router.delete('/deletepost/:postId/:userId',verifyToken,deletepost);
router.put('/updatepost/:postId/:userId',verifyToken,updatepost);
//Rating and review routes
router.post("/createRating",verifyToken,createRating)
//router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)
router.get("/getInstructorPost",verifyToken,getInstructorPost);

export default router;