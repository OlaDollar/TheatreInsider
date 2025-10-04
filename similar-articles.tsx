import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  region: string;
  publishedAt: string;
  imageUrl?: string;
  readTime?: number;
}

interface SimilarArticlesProps {
  currentArticleId: number;
  category?: string;
  tags?: string[];
  region?: string;
  limit?: number;
}

export default function SimilarArticles({ 
  currentArticleId, 
  category, 
  tags = [], 
  region,
  limit = 3 
}: SimilarArticlesProps) {
  const { data: similarArticles, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles/similar', currentArticleId, category, tags, region, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        exclude: currentArticleId.toString(),
        limit: limit.toString()
      });
      
      if (category) params.append('category', category);
      if (region) params.append('region', region);
      if (tags.length > 0) params.append('tags', tags.join(','));
      
      const response = await fetch(`/api/articles/similar?${params}`);
      if (!response.ok) throw new Error('Failed to fetch similar articles');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Similar Articles</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg" />
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!similarArticles || similarArticles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-theatre-dark mb-6">
          You Might Also Like
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarArticles.map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-shadow">
              <Link href={`/articles/${article.slug}`}>
                <div className="cursor-pointer">
                  {article.imageUrl && (
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-white/90 text-theatre-dark">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-theatre-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                      {article.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min read
                        </span>
                      )}
                      {article.region !== 'both' && (
                        <Badge variant="outline" className="text-xs">
                          {article.region.toUpperCase()}
                        </Badge>
                      )}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center text-theatre-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Read more</span>
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
      
      {/* SEO and engagement boost */}
      <div className="text-center py-4">
        <Link href="/news">
          <span className="text-theatre-primary hover:underline font-medium">
            Explore all theatre news →
          </span>
        </Link>
      </div>
    </div>
  );
}