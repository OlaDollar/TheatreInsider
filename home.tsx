import { useQuery } from "@tanstack/react-query";
import type { Article, Review, Show } from "@shared/schema";
import ArticleCard from "@/components/article-card";
import ReviewCard from "@/components/review-card";
import NewsletterSignup from "@/components/newsletter-signup";
import Advertisement from "@/components/advertisement";
import DailyFactWidget from "@/components/daily-fact-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  // Fetch featured article
  const { data: featuredArticles } = useQuery<Article[]>({
    queryKey: ["/api/articles?featured=true&limit=1"],
  });

  // Fetch latest articles
  const { data: articles } = useQuery<Article[]>({
    queryKey: ["/api/articles?limit=4"],
  });

  // Fetch latest reviews
  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["/api/reviews?limit=2"],
  });

  // Fetch trending shows
  const { data: trendingShows } = useQuery<Show[]>({
    queryKey: ["/api/shows/trending?limit=4"],
  });

  const featuredArticle = featuredArticles?.[0];
  const filteredArticles = articles?.filter(a => 
    selectedRegion === "all" || a.region === selectedRegion || a.region === "both"
  );

  return (
    <div>
      {/* Top Banner Advertisement */}
      <Advertisement placement="banner" />
      
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {featuredArticle ? (
                <ArticleCard article={featuredArticle} featured />
              ) : (
                <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
                  <p className="text-gray-500">Loading featured article...</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Advertisement */}
              <Advertisement placement="sidebar" />
              
              {/* Newsletter Signup */}
              <NewsletterSignup />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            
            {/* Featured News Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-theatre-dark" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Latest Theatre News
                </h2>
                <div className="flex space-x-2">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredArticles?.slice(0, 2).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Daily Theatre Fact Widget - positioned after lead content */}
              <div className="mb-8">
                <DailyFactWidget />
              </div>
            </section>

            {/* Reviews Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-theatre-dark" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Theatre Reviews
                </h2>
                <Link href="/reviews" className="theatre-primary hover:text-purple-700 font-medium">
                  View All Reviews
                </Link>
              </div>
              
              <div className="space-y-6">
                {reviews?.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>

            {/* Premium Content Teaser */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-theatre-primary to-theatre-accent rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <i className="fas fa-crown text-6xl text-theatre-secondary opacity-20"></i>
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Exclusive Premium Content
                </h2>
                <p className="text-gray-200 mb-6 max-w-2xl">
                  Get insider access to exclusive interviews, behind-the-scenes content, advance reviews, and theatre industry analysis. Join our premium community today.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button className="bg-theatre-secondary text-theatre-dark hover:bg-yellow-500">
                    Start Free Trial
                  </Button>
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-theatre-primary">
                    Learn More
                  </Button>
                </div>
                <p className="text-sm text-gray-300 mt-4">From £9.99/month • Cancel anytime</p>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            
            {/* Advertisement */}
            <Advertisement placement="sidebar" className="mb-8" />
            
            {/* Trending Shows */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-lg font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Trending Shows
              </h3>
              <div className="space-y-4">
                {trendingShows?.map((show, index) => (
                  <div key={show.id} className="flex items-center space-x-3">
                    <span className="text-2xl font-bold theatre-accent">{index + 1}</span>
                    <div>
                      <p className="font-medium text-theatre-dark">{show.title}</p>
                      <p className="text-sm text-gray-500">{show.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social Media Feed */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-lg font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Follow Us
              </h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <i className="fab fa-facebook-f text-blue-600"></i>
                  <span className="text-sm font-medium">Facebook - 45K followers</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors">
                  <i className="fab fa-twitter text-sky-500"></i>
                  <span className="text-sm font-medium">X - 32K followers</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <i className="fab fa-youtube text-red-600"></i>
                  <span className="text-sm font-medium">YouTube - 28K subscribers</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 bg-gray-900 text-gray-200 rounded-lg hover:bg-gray-800 transition-colors">
                  <i className="fab fa-tiktok"></i>
                  <span className="text-sm font-medium">TikTok - 15K followers</span>
                </a>
              </div>
            </div>
            
            {/* Shop Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Theatre Shop
              </h3>
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                  alt="Theatre merchandise and programs" 
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600">
                  Exclusive theatre merchandise, programmes, and collectibles from your favorite shows.
                </p>
                <Button className="w-full bg-theatre-secondary text-theatre-dark hover:bg-yellow-500">
                  Browse Shop
                </Button>
              </div>
            </div>
            
          </aside>
        </div>
      </main>
    </div>
  );
}
