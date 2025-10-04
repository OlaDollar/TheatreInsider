import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Search, MapPin, Clock, Users, Phone, Globe, 
  Car, Train, Accessibility, Coffee, ShoppingBag,
  Star, Calendar, Navigation, Building
} from "lucide-react";

interface Theatre {
  id: number;
  name: string;
  address: string;
  city: string;
  region: 'uk' | 'us';
  state_province: string;
  postcode: string;
  venue_type: string;
  capacity: number;
  opened_year: number;
  architect?: string;
  description: string;
  history: string;
  exterior_image: string;
  interior_image: string;
  auditorium_image?: string;
  current_shows: Array<{
    title: string;
    dates: string;
    ticket_url: string;
  }>;
  amenities: {
    accessibility: {
      wheelchair_access: boolean;
      hearing_loop: boolean;
      audio_description: boolean;
      accessible_toilets: boolean;
    };
    facilities: {
      bar: boolean;
      restaurant: boolean;
      gift_shop: boolean;
      parking: boolean;
      air_conditioning: boolean;
    };
    seating: {
      total_capacity: number;
    };
  };
  contact: {
    phone: string;
    website: string;
    box_office_hours: string;
  };
  transport: {
    nearest_tube?: string;
    nearest_subway?: string;
    parking_info: string;
  };
  rating: number;
  review_count: number;
  featured: boolean;
}

interface TheatreData {
  uk: Theatre[];
  us: Theatre[];
  total: number;
  featured: Theatre[];
  lastUpdated: string;
}

export default function Theatres() {
  const [activeTab, setActiveTab] = useState("both");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [capacityRange, setCapacityRange] = useState({ min: "", max: "" });

  const { data: theatreData, isLoading } = useQuery<TheatreData>({
    queryKey: ["/api/theatres", {
      region: activeTab === "both" ? undefined : activeTab,
      searchTerm,
      venueType: selectedVenueTypes.join(','),
      city: selectedCity,
      minCapacity: capacityRange.min,
      maxCapacity: capacityRange.max
    }],
    refetchInterval: 60 * 60 * 1000, // Refresh hourly
  });

  const { data: optionsData } = useQuery({
    queryKey: ["/api/theatres/options", { region: "uk" }]
  });

  const formatVenueType = (venueType: string) => {
    return venueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatCapacity = (capacity: number) => {
    return capacity.toLocaleString();
  };

  const getTheatresByRegion = (region: 'uk' | 'us') => {
    if (!theatreData) return [];
    return theatreData[region] || [];
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedVenueTypes([]);
    setSelectedCity("");
    setCapacityRange({ min: "", max: "" });
  };

  const handleVenueTypeToggle = (venueType: string) => {
    setSelectedVenueTypes(prev => 
      prev.includes(venueType) 
        ? prev.filter(vt => vt !== venueType)
        : [...prev, venueType]
    );
  };

  const TheatreCard = ({ theatre }: { theatre: Theatre }) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      {/* Exterior Image */}
      <div className="relative">
        <img 
          src={theatre.exterior_image} 
          alt={`${theatre.name} exterior`}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge className={theatre.featured ? "bg-yellow-600 text-white" : "bg-purple-600 text-white"}>
            {theatre.featured ? "Featured" : formatVenueType(theatre.venue_type)}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-white flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {formatCapacity(theatre.capacity)}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{theatre.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {theatre.city}, {theatre.state_province}
            </CardDescription>
            <div className="flex items-center mt-1">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{theatre.rating}/5</span>
              <span className="text-sm text-gray-500 ml-1">({theatre.review_count} reviews)</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {theatre.description}
        </p>

        {/* Current Shows */}
        {theatre.current_shows.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              What's On
            </h4>
            {theatre.current_shows.map((show, index) => (
              <div key={index} className="text-sm bg-gray-50 rounded p-2 mb-2">
                <div className="font-medium">{show.title}</div>
                <div className="text-gray-500 text-xs">{show.dates}</div>
              </div>
            ))}
          </div>
        )}

        {/* Amenities Icons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {theatre.amenities.accessibility.wheelchair_access && (
            <div className="flex items-center text-xs text-green-600" title="Wheelchair accessible">
              <Accessibility className="w-3 h-3 mr-1" />
              Accessible
            </div>
          )}
          {theatre.amenities.facilities.bar && (
            <div className="flex items-center text-xs text-blue-600" title="Bar available">
              <Coffee className="w-3 h-3 mr-1" />
              Bar
            </div>
          )}
          {theatre.amenities.facilities.gift_shop && (
            <div className="flex items-center text-xs text-purple-600" title="Gift shop">
              <ShoppingBag className="w-3 h-3 mr-1" />
              Shop
            </div>
          )}
          {theatre.amenities.facilities.parking && (
            <div className="flex items-center text-xs text-gray-600" title="Parking available">
              <Car className="w-3 h-3 mr-1" />
              Parking
            </div>
          )}
        </div>

        {/* Transport Info */}
        <div className="text-xs text-gray-500 mb-4">
          <div className="flex items-center mb-1">
            <Train className="w-3 h-3 mr-1" />
            {theatre.transport.nearest_tube || theatre.transport.nearest_subway}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => window.open(theatre.contact.website, '_blank')}
              aria-label={`Visit ${theatre.name} website`}
            >
              <Globe className="w-4 h-4 mr-1" />
              Visit Theatre Website
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1"
              onClick={() => window.open(`tel:${theatre.contact.phone}`, '_self')}
              aria-label={`Call ${theatre.name} box office`}
            >
              <Phone className="w-4 h-4 mr-1" />
              Box Office
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(`/theatre/${theatre.id}`, '_blank')}
              aria-label={`View detailed information about ${theatre.name}`}
            >
              <Building className="w-4 h-4 mr-1" />
              Full Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* SEO-optimized page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Theatre Directory | West End & Broadway Venue Guide
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Complete theatre venue information including seating charts, accessibility, transport links, 
          and current shows. Plan your perfect theatre visit with insider venue knowledge.
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <span>Venue information updated daily</span>
          {theatreData && (
            <span className="ml-2">
              • {theatreData.total} theatres in our directory
            </span>
          )}
          <span className="ml-2">• Including capacity, accessibility & transport info</span>
        </div>
      </div>

      {/* Value Proposition Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Discover Your Perfect Theatre Venue</h2>
            <p className="text-purple-100">
              Complete venue guides with seating charts, accessibility info, and insider tips from theatre experts
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">4.9/5</div>
            <div className="text-sm text-purple-200">Rated by theatre visitors</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Find Theatre Venues Near You</CardTitle>
          <CardDescription>Search by location, capacity, amenities and venue type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search theatre names, cities, or current shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search theatres by name, location, or current productions"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City Selection */}
            <div>
              <Label htmlFor="city">City</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All cities</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="new york">New York</SelectItem>
                  <SelectItem value="manchester">Manchester</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Capacity Range */}
            <div>
              <Label htmlFor="minCapacity">Min Capacity</Label>
              <Input
                id="minCapacity"
                type="number"
                placeholder="500"
                value={capacityRange.min}
                onChange={(e) => setCapacityRange(prev => ({ ...prev, min: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="maxCapacity">Max Capacity</Label>
              <Input
                id="maxCapacity"
                type="number"
                placeholder="2000"
                value={capacityRange.max}
                onChange={(e) => setCapacityRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>
          </div>

          {/* Venue Types */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Venue Type</Label>
            <div className="flex flex-wrap gap-2">
              {['west_end', 'off_west_end', 'broadway', 'off_broadway', 'national', 'regional'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={selectedVenueTypes.includes(type)}
                    onCheckedChange={() => handleVenueTypeToggle(type)}
                  />
                  <Label htmlFor={type} className="text-sm">{formatVenueType(type)}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
            <span className="text-sm text-gray-500 self-center">
              {theatreData?.total || 0} theatre venues available
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="both">All Theatre Venues</TabsTrigger>
          <TabsTrigger value="uk">UK Theatres ({theatreData?.uk?.length || 0})</TabsTrigger>
          <TabsTrigger value="us">US Theatres ({theatreData?.us?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="both" className="space-y-8">
          {/* Featured Theatres */}
          {theatreData?.featured && theatreData.featured.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-purple-800">Featured Theatre Venues</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {theatreData.featured.map((theatre) => (
                  <TheatreCard key={`featured-${theatre.id}`} theatre={theatre} />
                ))}
              </div>
              <Separator className="my-8" />
            </div>
          )}

          {/* UK Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-purple-800">United Kingdom Theatres | West End & Regional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTheatresByRegion('uk').map((theatre) => (
                <TheatreCard key={`uk-${theatre.id}`} theatre={theatre} />
              ))}
            </div>
          </div>

          <Separator className="my-8" />

          {/* US Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-purple-800">United States Theatres | Broadway & Regional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTheatresByRegion('us').map((theatre) => (
                <TheatreCard key={`us-${theatre.id}`} theatre={theatre} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="uk">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getTheatresByRegion('uk').map((theatre) => (
              <TheatreCard key={theatre.id} theatre={theatre} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="us">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getTheatresByRegion('us').map((theatre) => (
              <TheatreCard key={theatre.id} theatre={theatre} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading theatre venues...</p>
        </div>
      )}

      {theatreData && theatreData.total === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No theatre venues found matching your search criteria.</p>
          <Button variant="outline" onClick={clearFilters}>
            View All Theatre Venues
          </Button>
        </div>
      )}
    </div>
  );
}