import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Share2, User } from "lucide-react";
import { format } from "date-fns";
import BookingWidget from "@/components/booking-widget";
import SimilarArticles from "@/components/similar-articles";

interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  region: string;
  publishedAt: string;
  imageUrl?: string;
  readTime?: number;
  tags?: string[];
  slug: string;
}

export default function ArticleDetail() {
  const params = useParams();
  const articleId = params.id;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: ['/api/articles', articleId],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}`);
      if (!response.ok) throw new Error('Article not found');
      return response.json();
    }
  });

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="aspect-video bg-gray-200 rounded-lg" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="capitalize">
            {article.category}
          </Badge>
          <Badge variant="outline" className="uppercase text-xs">
            {article.region}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-theatre-dark mb-4 leading-tight" 
            style={{ fontFamily: 'Playfair Display, serif' }}>
          {article.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>By {article.author}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>
          </div>
          
          {article.readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min read</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1 hover:bg-gray-100"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Booking Widget - Unobtrusive placement */}
      <BookingWidget articleId={article.id} className="float-right w-80 ml-6 mb-4" />

      {/* Article Content */}
      <article className="prose prose-lg max-w-none mb-12">
        <div 
          dangerouslySetInnerHTML={{ __html: article.content }}
          className="leading-relaxed text-gray-800"
        />
      </article>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Similar Articles */}
      <SimilarArticles 
        currentArticleId={article.id}
        category={article.category}
        tags={article.tags}
        region={article.region}
        limit={3}
      />

      {/* Back to Top */}
      <div className="text-center mt-12">
        <Button 
          variant="outline" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to Top
        </Button>
      </div>
    </div>
  );
}