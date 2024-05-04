import Post from '../models/post.model.js';
import RatingAndReview from '../models/RatingAndReview.model.js' 
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';


export const createRating = async (req, res) => {
    try{
        const userId = req.user.id;                                                   //get user id
        const {rating, review, postId} = req.body;                                 //fetchdata from req body
        
        const alreadyReviewed = await RatingAndReview.findOne({user:userId});       //check if user already reviewed the course                                
                                             
        if(alreadyReviewed) {
                    return res.status(403).json({
                        success:false,
                        message:'Post is already reviewed by the user',
                    });
                }
        //create an entry for ratingandreview in RatingAndReview folder in DB;
        const ratingReview = await RatingAndReview.create({
                                        rating, review,
                                        user:userId,
                                    });
       
        //update course with this rating/review
        const updatedPostDetails = await Post.findByIdAndUpdate({_id:userId},
                                    {
                                        $push: {ratingAndReviews: ratingReview._id,}
                                    },
                                    {new: true});
    
        return res.status(200).json({                               //return response
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

export const getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({}).sort({rating: "desc"})  
                                    .populate({
                                        path:"user",
                                        select:"username email profilePicture",
                                    })
                                    .exec();

            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}

//module.exports =  {createRating ,getAllRating};