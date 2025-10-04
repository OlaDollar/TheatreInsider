import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";
import ArticleCard from "@/components/article-card";
import { TopicFollowButton } from "@/components/TopicFollowButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles?category=news"],
  });

  const filteredArticles = articles?.filter(article => {
    const categoryMatch = selectedCategory === "all" || article.category === selectedCategory;
    const regionMatch = selectedRegion === "all" || article.region === selectedRegion || article.region === "both";
    return categoryMatch && regionMatch;
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Theatre News
        </h1>
        <p className="text-gray-600 mb-6">
          Stay up to date with the latest news from West End and Broadway
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

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles?.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {!filteredArticles || filteredArticles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No articles found for the selected filters.</p>
        </div>
      ) : null}
    </div>
  );
}
