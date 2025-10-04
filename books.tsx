import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, ExternalLink, Star, Search, Filter } from "lucide-react";

interface TheatreBook {
  id: string;
  title: string;
  author: string;
  category: 'biography' | 'history' | 'technique' | 'script' | 'criticism' | 'photography' | 'reference';
  description: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  price: string;
  publisher: string;
  publicationYear: number;
  pageCount: number;
  isbn: string;
  affiliateLinks: {
    amazon: string;
    theatreBooksDirect: string;
    waterstones?: string;
    barnesNoble?: string;
  };
  featured: boolean;
  relatedShows: string[];
  relatedPerformers: string[];
}

export default function Books() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Mock data - in production would come from API
  const { data: books, isLoading } = useQuery<TheatreBook[]>({
    queryKey: ["/api/books", selectedCategory, sortBy],
    queryFn: () => Promise.resolve([
      {
        id: "1",
        title: "Finishing the Hat: Collected Lyrics (1954-1981) with Attendant Comments, Principles, Heresies, Grudges, Whines and Anecdotes",
        author: "Stephen Sondheim",
        category: "biography",
        description: "The first of two volumes of Stephen Sondheim's collected lyrics, with his own commentary on his work and career.",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300",
        rating: 4.8,
        reviewCount: 234,
        price: "£18.99",
        publisher: "Knopf",
        publicationYear: 2010,
        pageCount: 464,
        isbn: "9780679439073",
        affiliateLinks: {
          amazon: "https://www.amazon.co.uk/dp/0679439072?tag=theatrespotlight-21",
          theatreBooksDirect: "https://www.theatrebooksdirect.com/sondheim-finishing-hat?ref=THEATRESPOTLIGHT"
        },
        featured: true,
        relatedShows: ["Company", "Sweeney Todd", "Into the Woods"],
        relatedPerformers: ["Stephen Sondheim"]
      },
      {
        id: "2",
        title: "My Name is Asher Lev",
        author: "Chaim Potok",
        category: "script",
        description: "The powerful play adaptation of Potok's novel about art, faith, and family conflict.",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300",
        rating: 4.6,
        reviewCount: 156,
        price: "£12.99",
        publisher: "Samuel French",
        publicationYear: 2002,
        pageCount: 96,
        isbn: "9780573629358",
        affiliateLinks: {
          amazon: "https://www.amazon.co.uk/dp/0573629358?tag=theatrespotlight-21",
          theatreBooksDirect: "https://www.theatrebooksdirect.com/asher-lev-script?ref=THEATRESPOTLIGHT"
        },
        featured: false,
        relatedShows: ["My Name is Asher Lev"],
        relatedPerformers: []
      },
      {
        id: "3",
        title: "The Complete Guide to Acting Technique",
        author: "Lee Strasberg",
        category: "technique",
        description: "The definitive guide to method acting from the legendary teacher at the Actors Studio.",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
        rating: 4.7,
        reviewCount: 189,
        price: "£22.50",
        publisher: "Bantam",
        publicationYear: 1987,
        pageCount: 368,
        isbn: "9780553265392",
        affiliateLinks: {
          amazon: "https://www.amazon.co.uk/dp/0553265393?tag=theatrespotlight-21",
          theatreBooksDirect: "https://www.theatrebooksdirect.com/strasberg-acting?ref=THEATRESPOTLIGHT"
        },
        featured: true,
        relatedShows: [],
        relatedPerformers: ["Lee Strasberg"]
      }
    ])
  });

  const filteredBooks = books?.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedBooks = filteredBooks?.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.publicationYear - a.publicationYear;
      case "price-low":
        return parseFloat(a.price.replace(/[£$]/, "")) - parseFloat(b.price.replace(/[£$]/, ""));
      case "price-high":
        return parseFloat(b.price.replace(/[£$]/, "")) - parseFloat(a.price.replace(/[£$]/, ""));
      case "featured":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading theatre books...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Theatre Books
        </h1>
        <p className="text-gray-600 mb-6">
          Discover essential reading for theatre lovers, from biographies and scripts to technique guides and industry histories
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search books, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="biography">Biographies</SelectItem>
              <SelectItem value="script">Scripts & Plays</SelectItem>
              <SelectItem value="technique">Acting Technique</SelectItem>
              <SelectItem value="history">Theatre History</SelectItem>
              <SelectItem value="criticism">Criticism & Reviews</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Featured Books Section */}
      {sortBy === "featured" && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Books</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedBooks?.filter(book => book.featured).slice(0, 3).map((book) => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] relative">
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    Featured
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription>by {book.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({book.reviewCount})</span>
                  </div>
                  
                  <Badge variant="outline" className="mb-2 capitalize">
                    {book.category}
                  </Badge>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {book.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-theatre-primary">{book.price}</span>
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <a href={book.affiliateLinks.amazon} target="_blank" rel="noopener sponsored">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Amazon
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href={book.affiliateLinks.theatreBooksDirect} target="_blank" rel="noopener sponsored">
                          <Book className="h-3 w-3 mr-1" />
                          Specialist
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Books Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBooks?.map((book) => (
          <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] relative">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
              {book.featured && (
                <Badge className="absolute top-2 right-2 bg-yellow-500">
                  Featured
                </Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
              <CardDescription className="text-sm">by {book.author}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(book.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">({book.reviewCount})</span>
              </div>
              
              <Badge variant="outline" className="mb-2 text-xs capitalize">
                {book.category}
              </Badge>
              
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {book.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-theatre-primary">{book.price}</span>
                  <span className="text-xs text-gray-500">{book.publicationYear}</span>
                </div>
                
                <div className="flex gap-1">
                  <Button asChild size="sm" className="flex-1 text-xs">
                    <a href={book.affiliateLinks.amazon} target="_blank" rel="noopener sponsored">
                      Amazon
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
                    <a href={book.affiliateLinks.theatreBooksDirect} target="_blank" rel="noopener sponsored">
                      Specialist
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Affiliate Disclosure */}
      <div className="mt-12 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 italic">
          <strong>Affiliate Disclosure:</strong> Theatre Spotlight may earn commission from purchases made through book links to Amazon, Theatre Books Direct, and other retailers. This helps support our independent theatre journalism at no extra cost to you. We only recommend books we believe will genuinely interest our readers.
        </p>
      </div>

      {/* Categories Overview */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Biographies", key: "biography", desc: "Lives of theatre legends" },
            { name: "Scripts & Plays", key: "script", desc: "Complete play texts" },
            { name: "Acting Technique", key: "technique", desc: "Master your craft" },
            { name: "Theatre History", key: "history", desc: "Stories behind the curtain" },
            { name: "Criticism & Reviews", key: "criticism", desc: "Expert analysis" },
            { name: "Photography", key: "photography", desc: "Behind-the-scenes imagery" },
            { name: "Reference", key: "reference", desc: "Essential guides" }
          ].map((category) => (
            <Card 
              key={category.key} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCategory(category.key)}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>{category.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}