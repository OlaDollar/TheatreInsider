import { useQuery } from "@tanstack/react-query";
import type { Review } from "@shared/schema";
import ReviewCard from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Reviews() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const filteredReviews = reviews?.filter(review => 
    selectedRegion === "all" || review.region === selectedRegion
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Theatre Reviews
        </h1>
        <p className="text-gray-600 mb-6">
          Expert reviews and critiques of the latest West End and Broadway productions
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex space-x-2">
            <span className="text-sm font-medium text-gray-700 self-center">Region:</span>
            <Button
              variant={selectedRegion === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion("all")}
              className={selectedRegion === "all" ? "bg-theatre-primary text-white" : ""}
            >
              All
            </Button>
            <Button
              variant={selectedRegion === "uk" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion("uk")}
              className={selectedRegion === "uk" ? "bg-theatre-primary text-white" : ""}
            >
              UK
            </Button>
            <Button
              variant={selectedRegion === "us" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRegion("us")}
              className={selectedRegion === "us" ? "bg-theatre-primary text-white" : ""}
            >
              US
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {!filteredReviews || filteredReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews found for the selected filters.</p>
        </div>
      ) : null}
    </div>
  );
}
