import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

export default function ReviewSlider({ reviewModal }) {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getReviews");
      const data = await res.json();
      setReviews(data.data);
    };
    fetchPosts();
  }, [reviewModal]);

  // Define responsive settings for Swiper
  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 25,
    },
    1440: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  };

  return (
    <div className="text-white">
      <div className="my-8 lg:my-[50px] max-w-maxContentTab lg:max-w-maxContent ml-4 lg:ml-[20px] mr-4 lg:mr-[20px]">
        <Swiper
          breakpoints={breakpoints}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col gap-3 bg-purple-900 rounded-lg p-3 text-[14px] text-richblack-25">
                <div className="flex items-center gap-4">
                  <img
                    src={review?.user?.profilePicture}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">{`${review?.user?.username}`}</h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.post?.title}
                    </h2>
                  </div>
                </div>
                <p className="font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncateWords)
                        .join(" ")} ...`
                    : `${review?.review}`}
                </p>
                <div className="flex items-center gap-2 ">
                  <h3 className="font-semibold text-yellow-100">
                    {review.rating.toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
