import React from "react";
import { Button } from "../ui/button";
import { StarIcon } from "lucide-react";

export default function StarRatingComponent({ rating, handleRatingChange }) {
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star}
      className={`p-2 rounded-full transition-colors ${
        star <= rating
          ? "text-yellow-500 hover:bg-black"
          : "text-black hover:text-primary-foreground"
      }`}
      size="icon"
      variant="outline"
      onClick={handleRatingChange ? () => handleRatingChange(star) : null}
    >
      <StarIcon
        className={`w-6 h-6 ${
          star <= rating ? "fill-yellow-500" : "fill-black"
        }`}
      />
    </Button>
  ));
}
