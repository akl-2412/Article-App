import mongoose from 'mongoose'


const ratingAndReviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	rating: {
		type: Number,
		required: true,
	},
	review: {
		type: String,
		required: true,
	}
});

// Export the RatingAndReview model
const RatingAndReview = mongoose.model("RatingAndReview", ratingAndReviewSchema);
export default RatingAndReview;
