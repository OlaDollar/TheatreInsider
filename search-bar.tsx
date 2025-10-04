import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Article } from "@shared/schema";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: searchResults, isLoading } = useQuery<Article[]>({
    queryKey: [`/api/articles/search?q=${query}`],
    enabled: query.length > 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowResults(true);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex">
        <Input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-48"
          onFocus={() => query.length > 2 && setShowResults(true)}
        />
        <Button
          type="submit"
          size="sm"
          className="ml-2 bg-theatre-primary hover:bg-purple-700"
        >
          <Search size={16} />
        </Button>
      </form>

      {showResults && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              {searchResults.slice(0, 5).map((article) => (
                <div
                  key={article.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    window.location.href = `/news/${article.id}`;
                    setShowResults(false);
                  }}
                >
                  <h4 className="font-medium text-sm">{article.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    By {article.author}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No articles found for "{query}"
            </div>
          )}
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowResults(false)}
          >
            ×
          </button>
        </div>
      )}

      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
