import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { getQueryFn } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Award, Book, Film, User, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PerformerProduction {
  id: number;
  title: string;
  venue: string;
  region: string;
  venue_type: string;
  openingDate: string;
  closingDate?: string;
  isCurrentlyRunning: boolean;
  director?: string;
  role: string;
  roleType: string;
  isOriginalCast: boolean;
}

interface PerformerMedia {
  id: number;
  mediaType: string;
  title: string;
  description: string;
  releaseDate: string;
  url?: string;
  isRecent: boolean;
}

interface PerformerDetail {
  id: number;
  name: string;
  biography: string;
  birthDate?: string;
  deathDate?: string;
  nationality: string;
  status: string;
  notableFor: string;
  awards: string[];
  socialLinks: string[];
  imageUrl: string;
  isFeatured: boolean;
  slug: string;
  productions: PerformerProduction[];
  media: PerformerMedia[];
}

export default function PerformerDetail() {
  const [match, params] = useRoute("/performers/:slug");
  const slug = params?.slug;

  const { data: performer, isLoading, error } = useQuery({
    queryKey: [`/api/performers/slug/${slug}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theatre-primary/5 to-theatre-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !performer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theatre-primary/5 to-theatre-accent/5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Performer Not Found</h1>
          <p className="text-gray-500">The performer you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'retired': return 'bg-blue-100 text-blue-800';
      case 'deceased': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVenueTypeLabel = (venueType: string) => {
    switch (venueType) {
      case 'west_end': return 'West End';
      case 'off_west_end': return 'Off-West End';
      case 'broadway': return 'Broadway';
      case 'off_broadway': return 'Off-Broadway';
      case 'national': return 'National Theatre';
      case 'regional': return 'Regional';
      case 'youth': return 'Youth Theatre';
      case 'development': return 'Development';
      case 'cabaret': return 'Cabaret';
      case 'concert_hall': return 'Concert Hall';
      default: return venueType;
    }
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'book':
      case 'biography':
        return <Book className="h-4 w-4" />;
      case 'documentary':
      case 'tv_show':
      case 'film':
        return <Film className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-theatre-primary/5 to-theatre-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-1">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={performer.imageUrl}
                  alt={performer.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-theatre-dark">{performer.name}</h1>
                <Badge className={getStatusColor(performer.status)}>
                  {performer.status}
                </Badge>
              </div>
              
              <p className="text-xl text-theatre-secondary font-medium mb-4">{performer.notableFor}</p>
              
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                {performer.birthDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Born: {formatDate(performer.birthDate)}</span>
                    {performer.deathDate && <span> - {formatDate(performer.deathDate)}</span>}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{performer.nationality.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {performer.awards.map((award, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {award}
                  </Badge>
                ))}
              </div>

              {performer.socialLinks.length > 0 && (
                <div className="flex gap-2">
                  {performer.socialLinks.map((link, index) => (
                    <Button key={index} variant="outline" size="sm" asChild>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Follow
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{performer.biography}</p>
              </CardContent>
            </Card>

            {/* Theatre Productions */}
            <Card>
              <CardHeader>
                <CardTitle>Theatre Productions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performer.productions.map((production, index) => (
                    <div key={production.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{production.title}</h4>
                          <p className="text-theatre-secondary font-medium">{production.role}</p>
                          <p className="text-sm text-gray-600">{production.venue}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{getVenueTypeLabel(production.venue_type)}</Badge>
                          {production.isOriginalCast && (
                            <Badge className="ml-2 bg-theatre-accent text-white">Original Cast</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mb-2">
                        <span>{formatDate(production.openingDate)}</span>
                        {production.closingDate ? (
                          <span>- {formatDate(production.closingDate)}</span>
                        ) : production.isCurrentlyRunning ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">Currently Running</Badge>
                        ) : null}
                      </div>
                      {production.director && (
                        <p className="text-sm text-gray-600">Directed by {production.director}</p>
                      )}
                      {index < performer.productions.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Media & Publications */}
            {performer.media.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Media & Publications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performer.media.map((media) => (
                      <div key={media.id} className="border-l-4 border-theatre-secondary pl-4">
                        <div className="flex items-start gap-2 mb-2">
                          {getMediaIcon(media.mediaType)}
                          <div className="flex-1">
                            <h5 className="font-medium">{media.title}</h5>
                            <p className="text-xs text-gray-500 mb-1">{formatDate(media.releaseDate)}</p>
                            {media.isRecent && (
                              <Badge size="sm" className="bg-theatre-accent text-white">Recent</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{media.description}</p>
                        {media.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={media.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Career Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Productions</span>
                    <span className="font-semibold">{performer.productions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Cast Roles</span>
                    <span className="font-semibold">
                      {performer.productions.filter(p => p.isOriginalCast).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Awards</span>
                    <span className="font-semibold">{performer.awards.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Media Appearances</span>
                    <span className="font-semibold">{performer.media.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}