import { useEffect,useState } from "react"
import { toast } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';
//import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"
import {Button } from 'flowbite-react';
//import {toast} from "react-hot-toast"
//import { useDispatch, useSelector } from 'react-redux';
//import { createRating } from "../../../services/operations/courseDetailsAPI"
//import IconBtn from "../../common/IconBtn"

export default function PostReviewModal({ setReviewModal}) {
  const { currentUser } = useSelector((state) => state.user);
  const [formData,setFormData]=useState({});
  const [starRating,setStarRating]=useState(null);
  const [publishError, setPublishError] = useState(null);

  const ratingChanged = (newRating) => {
    //console.log(newRating)
    setStarRating(newRating);
  }
  //console.log(starRating);
  useEffect(()=>{
    setFormData({...formData,rating:starRating});
  },[starRating])
  const modal=()=>{
    toast.error("Please Login First");
    setReviewModal(false);
  }
  const handleSubmit = async (e) => {
    //console.log("hi");
    e.preventDefault();
    
    console.log(formData);
    try {
      
      const res = await fetch('/api/post/createRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        setReviewModal(false);
        toast("You have already reviewed about this App");
        return;
      }

      if (res.ok){
        toast("Thanks for the review");
        setReviewModal(false)
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  }
  if(currentUser==null){
    modal();
    return;
  }
 
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-black bg-slate-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={currentUser.profilePicture}
              alt={currentUser.username + "profile"}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div className="">
              <p className="font-semibold text-richblack-5">
                {currentUser.username}
              </p>
              <p className="text-sm text-richblack-5">Posting Publicly</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col items-center"
          >
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
            />
            <div className="flex w-11/12 flex-col space-y-2">
              <label
                className="text-sm text-richblack-5"
                htmlFor="courseExperience"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="review"
                placeholder="Add Your Experience"
                onChange={(e)=>{
                  setFormData({...formData,review:e.target.value})
                }}
                className="form-style resize-x-none min-h-[130px] w-full rounded-md text-black"
              />
            </div>
            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              <button
                onClick={() => setReviewModal(false)}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
              >
                Cancel
              </button>
            </div>
            <Button type='submit' gradientDuoTone='purpleToPink'>
                  Publish
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}