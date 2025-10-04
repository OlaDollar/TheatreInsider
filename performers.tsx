import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Link } from "wouter";
import { formatDate } from "@/lib/utils";

interface Performer {
  id: number;
  name: string;
  biography: string;
  birthDate?: string;
  deathDate?: string;
  nationality: string;
  status: string;
  notableFor: string;
  awards: string[];
  imageUrl: string;
  isFeatured: boolean;
  slug: string;
}

export default function Performers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [nationalityFilter, setNationalityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: performers = [], isLoading } = useQuery({
    queryKey: ['/api/performers', { nationality: nationalityFilter, status: statusFilter }],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['/api/performers/search', { q: searchQuery }],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: searchQuery.length > 2,
  });

  const displayedPerformers = searchQuery.length > 2 ? searchResults : performers;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'retired': return 'bg-blue-100 text-blue-800';
      case 'deceased': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNationalityFlag = (nationality: string) => {
    switch (nationality) {
      case 'uk': return '🇬🇧';
      case 'us': return '🇺🇸';
      case 'international': return '🌍';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theatre-primary/5 to-theatre-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theatre-primary/5 to-theatre-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-theatre-dark mb-4">Theatre Performers</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover the stars of stage and screen. From Broadway legends to West End favorites, 
            explore comprehensive profiles of theatre's greatest performers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search Performers</label>
              <Input
                placeholder="Search by name, role, or show..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nationality</label>
              <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All nationalities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All nationalities</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                  <SelectItem value="us">US</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Performers */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-theatre-dark mb-6">Featured Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performers.filter((p: Performer) => p.isFeatured).map((performer: Performer) => (
                <Card key={performer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[3/4] bg-gray-200 relative">
                    <img
                      src={performer.imageUrl}
                      alt={performer.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(performer.status)}>
                        {performer.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-2xl">{getNationalityFlag(performer.nationality)}</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{performer.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{performer.notableFor}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {performer.awards.slice(0, 2).map((award, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {award}
                        </Badge>
                      ))}
                      {performer.awards.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{performer.awards.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <Link href={`/performers/${performer.slug}`}>
                      <Button className="w-full bg-theatre-primary hover:bg-theatre-primary/90">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Performers */}
        <div>
          <h2 className="text-2xl font-bold text-theatre-dark mb-6">
            {searchQuery ? `Search Results (${displayedPerformers.length})` : 'All Performers'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedPerformers.map((performer: Performer) => (
              <Card key={performer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[3/4] bg-gray-200 relative">
                  <img
                    src={performer.imageUrl}
                    alt={performer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={getStatusColor(performer.status)} size="sm">
                      {performer.status}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="text-lg">{getNationalityFlag(performer.nationality)}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1 line-clamp-2">{performer.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{performer.notableFor}</p>
                  {performer.birthDate && (
                    <p className="text-xs text-gray-500 mb-3">
                      Born: {formatDate(performer.birthDate)}
                      {performer.deathDate && ` - ${formatDate(performer.deathDate)}`}
                    </p>
                  )}
                  <Link href={`/performers/${performer.slug}`}>
                    <Button size="sm" className="w-full bg-theatre-primary hover:bg-theatre-primary/90">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {displayedPerformers.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No performers found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}