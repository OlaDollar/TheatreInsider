import { Link } from "wouter";
import type { Review } from "@shared/schema";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const regionBadgeColor = review.region === "uk" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800";

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-theatre-secondary text-theatre-secondary" : "text-gray-300"}
      />
    ));
  };

  return (
    <Link href={`/reviews/${review.id}`} className="block">
      <article className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start space-x-4">
          <img 
            src={review.imageUrl} 
            alt={review.showTitle}
            className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">{review.rating}/5 Stars</span>
              <Badge className={`ml-2 ${regionBadgeColor}`}>
                {review.region.toUpperCase()}
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-theatre-dark mb-2 hover:text-theatre-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
              {review.showTitle}: {review.venue}
            </h3>
            <p className="text-gray-600 mb-3">
              {review.excerpt}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>{review.reviewer === "ShentonAI" ? "ShentonAI" : `By ${review.reviewer}`}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(review.createdAt)}</span>
              <span className="mx-2">•</span>
              <span>{getReadingTime(review.reviewText)}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
