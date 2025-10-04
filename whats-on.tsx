import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Clock, Ticket, Star, AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface WhatsOnShow {
  id: number;
  title: string;
  venue: string;
  region: 'uk' | 'us';
  venueType: string;
  genre: string;
  status: string;
  description: string;
  ticketUrl: string;
  officialWebsite: string;
  imageUrl: string;
  director?: string;
  composer?: string;
  cast: string[];
  duration?: string;
  ageRating?: string;
  popularity: number;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  affiliateLinks?: {
    tickets: string;
    hotels: string;
    travel: string;
  };
  ticketAvailability: 'available' | 'limited' | 'sold_out' | 'not_on_sale';
  similarShows?: WhatsOnShow[];
  lastUpdated: string;
}

// Shows are now returned as a flat array from the API

export default function WhatsOn() {
  const [activeTab, setActiveTab] = useState("both");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const { data: whatsOnShows, isLoading, refetch } = useQuery<WhatsOnShow[]>({
    queryKey: ["/api/whats-on", {
      region: activeTab === "both" ? undefined : activeTab,
      search: searchTerm,
      genre: selectedGenres.join(','),
      venue_type: selectedVenueTypes.join(','),
      min_price: priceRange.min,
      max_price: priceRange.max
    }],
    refetchInterval: 60 * 60 * 1000, // Auto-refresh every hour
  });

  // Auto-refresh every hour
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [refetch]);

  const { data: optionsData } = useQuery({
    queryKey: ["/api/whats-on/options"]
  });

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleVenueTypeToggle = (venueType: string) => {
    setSelectedVenueTypes(prev => 
      prev.includes(venueType) 
        ? prev.filter(vt => vt !== venueType)
        : [...prev, venueType]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setSelectedVenueTypes([]);
    setPriceRange({ min: "", max: "" });
  };

  // Filter shows by region for tab display
  const filterShowsByRegion = (region: 'uk' | 'us') => {
    if (!whatsOnShows) return [];
    return whatsOnShows.filter(show => show.region === region);
  };

  const formatPrice = (price: { min: number; max: number; currency: string }) => {
    const symbol = price.currency === 'GBP' ? '£' : '$';
    return `${symbol}${price.min} - ${symbol}${price.max}`;
  };

  const formatVenueType = (venueType: string) => {
    return venueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'limited':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'sold_out':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Ticket className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'limited':
        return 'Limited';
      case 'sold_out':
        return 'Sold Out';
      case 'not_on_sale':
        return 'Not On Sale';
      default:
        return 'Unknown';
    }
  };



  const ShowCard = ({ show }: { show: WhatsOnShow }) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={show.imageUrl} 
          alt={show.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-purple-600 text-white">
            {formatVenueType(show.venueType)}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-white">
            {show.genre.charAt(0).toUpperCase() + show.genre.slice(1)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{show.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {show.venue}
            </CardDescription>
          </div>
          <div className="flex items-center ml-2">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{show.popularity}/100</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {show.description}
        </p>
        
        <div className="space-y-2 mb-4">
          {show.director && (
            <p className="text-xs text-gray-500">
              <strong>Director:</strong> {show.director}
            </p>
          )}
          {show.composer && (
            <p className="text-xs text-gray-500">
              <strong>Composer:</strong> {show.composer}
            </p>
          )}
          {show.duration && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {show.duration}
            </div>
          )}
          {show.priceRange && (
            <div className="flex items-center text-xs text-gray-500">
              <Ticket className="w-3 h-3 mr-1" />
              {formatPrice(show.priceRange)}
            </div>
          )}
          
          {/* Ticket Availability */}
          <div className="flex items-center text-xs">
            {getAvailabilityIcon(show.ticketAvailability)}
            <span className={`ml-1 font-medium ${
              show.ticketAvailability === 'sold_out' ? 'text-red-600' :
              show.ticketAvailability === 'limited' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {getAvailabilityText(show.ticketAvailability)}
            </span>
          </div>
        </div>

        {show.ticketAvailability === 'sold_out' ? (
          <div className="space-y-3">
            <Button 
              size="sm" 
              className="w-full bg-gray-400 cursor-not-allowed"
              disabled
              aria-label={`${show.title} tickets are sold out`}
            >
              {show.title} - Sold Out
            </Button>
            
            {/* Similar Shows Suggestion */}
            {show.similarShows && show.similarShows.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs font-medium text-blue-800 mb-2">Similar {show.genre} shows with tickets available:</p>
                <div className="space-y-1">
                  {show.similarShows.slice(0, 2).map((similarShow) => (
                    <div key={similarShow.id} className="flex items-center justify-between text-xs">
                      <span className="text-blue-700 font-medium truncate flex-1">
                        {similarShow.title}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2 py-1 h-auto ml-2 border-blue-300 text-blue-600 hover:bg-blue-100"
                        onClick={() => window.open(similarShow.affiliateLinks?.tickets || similarShow.ticketUrl, '_blank')}
                        aria-label={`Book tickets for ${similarShow.title}`}
                      >
                        Book Tickets
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className={`flex-1 ${
                show.ticketAvailability === 'limited' 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
              onClick={() => window.open(show.affiliateLinks?.tickets || show.ticketUrl, '_blank')}
              aria-label={`Book ${show.title} tickets at ${show.venue}`}
            >
              {show.ticketAvailability === 'limited' ? 'Book Now - Limited Seats' : `Book ${show.title} Tickets`}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(show.affiliateLinks?.travel, '_blank')}
              aria-label={`Plan your theatre trip to see ${show.title}`}
            >
              Plan Theatre Trip
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* SEO-optimized page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Theatre Shows Near You | West End & Broadway Listings
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Discover current theatre shows in London's West End and New York's Broadway. 
          Book tickets, plan your theatre trip, and explore similar shows.
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <span>Updated hourly</span>
          {whatsOnShows && whatsOnShows.length > 0 && (
            <span className="ml-2">
              • Last refresh: {new Date(whatsOnShows[0].lastUpdated).toLocaleTimeString()}
            </span>
          )}
          <span className="ml-2">• {whatsOnShows?.length || 0} shows currently playing</span>
        </div>
      </div>

      {/* SEO-optimized filters section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Find Your Perfect Theatre Show</CardTitle>
          <CardDescription>Filter by genre, location, price range and availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search West End, Broadway shows, venues, or performers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search theatre shows by title, venue, or performer"
            />
          </div>

          {/* Genres */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Genre</Label>
            <div className="flex flex-wrap gap-2">
              {optionsData?.genres?.map((genre: any) => (
                <div key={genre.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre.value}
                    checked={selectedGenres.includes(genre.value)}
                    onCheckedChange={() => handleGenreToggle(genre.value)}
                  />
                  <Label htmlFor={genre.value} className="text-sm">{genre.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="£0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="£200"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearFilters} aria-label="Clear all search filters">
              Clear All Filters
            </Button>
            <span className="text-sm text-gray-500 self-center">
              {whatsOnShows?.length || 0} theatre shows currently available
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="both">All Theatre Shows</TabsTrigger>
          <TabsTrigger value="uk">UK & West End ({filterShowsByRegion('uk').length})</TabsTrigger>
          <TabsTrigger value="us">US & Broadway ({filterShowsByRegion('us').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="both" className="space-y-8">
          {/* UK Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-purple-800">United Kingdom Theatre Shows | West End & Regional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterShowsByRegion('uk').map((show) => (
                <ShowCard key={`uk-${show.id}`} show={show} />
              ))}
            </div>
          </div>

          {/* US Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-purple-800">United States Theatre Shows | Broadway & Off-Broadway</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterShowsByRegion('us').map((show) => (
                <ShowCard key={`us-${show.id}`} show={show} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="uk">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterShowsByRegion('uk').map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="us">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterShowsByRegion('us').map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading current theatre shows...</p>
        </div>
      )}

      {!isLoading && whatsOnShows && whatsOnShows.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No theatre shows found matching your search criteria.</p>
          <Button variant="outline" onClick={clearFilters}>
            View All Available Shows
          </Button>
        </div>
      )}
    </div>
  );
}