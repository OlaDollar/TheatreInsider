import { Link } from "wouter";
import type { Article } from "@shared/schema";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const regionBadgeColor = article.region === "uk" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800";
  
  if (featured) {
    return (
      <Link href={`/articles/${article.id}`} className="block">
        <div className="relative overflow-hidden rounded-xl cursor-pointer group">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-theatre-accent text-white">Breaking News</Badge>
              <Badge className={regionBadgeColor}>
                {article.region.toUpperCase()}
              </Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {article.title}
            </h2>
            <p className="text-gray-200 mb-4 text-lg">
              {article.excerpt}
            </p>
            <div className="flex items-center text-sm text-gray-300">
              <span>{article.author === "ShentonAI" ? "ShentonAI" : `By ${article.author}`}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/articles/${article.id}`} className="block">
      <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="text-sm theatre-accent">
              {article.category === 'news' ? 'Breaking News' : 'Review'}
            </Badge>
            <Badge className={regionBadgeColor}>
              {article.region.toUpperCase()}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-theatre-dark mt-2 mb-3 group-hover:text-theatre-primary transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{article.author === "ShentonAI" ? "ShentonAI" : `By ${article.author}`}</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
