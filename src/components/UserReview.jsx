import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating";
import { motion, AnimatePresence } from "framer-motion";

function timeAgo(timestamp) {
  const now = new Date();
  const diff = Math.floor((now - timestamp) / 1000); // diff เป็นวินาที

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
}

export default function UserReview() {
  const [reviews, setReviews] = useState([]);
  const [userText, setUserText] = useState("");
  const [userRating, setUserRating] = useState(5);

  const handleSubmit = () => {
    if (!userText) return;

    const newReview = {
      id: Date.now(),
      name: "You",
      avatar: "/placeholder-user.jpg",
      text: userText,
      rating: userRating,
      timestamp: new Date(),
    };

    setReviews([newReview, ...reviews]);
    setUserText("");
    setUserRating(5);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <div className="flex flex-col items-center gap-3">
          <Rating value={userRating} onValueChange={setUserRating}>
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton key={index} size={32} />
            ))}
          </Rating>
        </div>
        <div className="grid gap-2">
          <Textarea
            placeholder="Write your review..."
            className="resize-none rounded-md border border-input bg-background p-3 text-sm shadow-sm"
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
          />
          <Button className="justify-center" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No reviews yet.
          </div>
        ) : (
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-4"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={review.avatar} alt={review.name} />
                  <AvatarFallback>{review.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{review.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {timeAgo(review.timestamp)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Rating value={review.rating} readOnly>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <RatingButton
                          key={index}
                          size={16}
                          className={
                            index < review.rating
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
