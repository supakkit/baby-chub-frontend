import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { AnimatePresence } from "framer-motion";
import { getReviews, addReview } from "../services/reviewsService.js";

function timeAgo(review) {
  if (!review) return "";
  const timestamp = review.updatedAt || review.createdAt;
  if (!timestamp) return "";

  const now = new Date();
  const diff = Math.floor((now - new Date(timestamp)) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function UserReview({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviews(productId);
        if (data) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (typeof productId === "string" && productId.trim() !== "") {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || rating === 0) return;
    try {
      setSubmitting(true);
      const newReview = await addReview(productId, { text, rating });
      if (newReview) {
        setReviews((prev) => [newReview, ...prev]);
        setText("");
        setRating(0);
      }
    } catch (err) {
      console.error("Failed to add review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <h2 className="text-2xl font-bold">Reviews</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-lg border p-4 shadow-sm"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Rating value={rating} onChange={setRating}>
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isActive = hoverRating
                  ? starValue <= hoverRating
                  : starValue <= rating;

                return (
                  <RatingButton
                    key={index}
                    size={24}
                    className={`cursor-pointer transform transition duration-150 ease-in-out
                ${isActive ? "text-yellow-400" : "text-yellow-300"}
                hover:text-yellow-400 hover:scale-110`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${starValue} star`}
                  />
                );
              })}
            </Rating>

            <span className="text-sm text-muted-foreground">
              {rating > 0 ? `${rating} / 5` : "Select rating"}
            </span>
          </div>

          <Textarea
            placeholder="Write your review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting || !text.trim() || rating === 0}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No reviews yet.
          </div>
        ) : (
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review.id || review._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>
                    {review.name?.slice(0, 2) || "??"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{review.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {timeAgo(review)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rating value={review.rating} readOnly>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <RatingButton
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </Rating>
                    <span className="text-sm text-muted-foreground">
                      {review.text}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
