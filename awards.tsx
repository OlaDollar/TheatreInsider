import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Calendar, MapPin, User, Star, Award } from "lucide-react";
import { useState } from "react";

interface AwardCeremony {
  id: number;
  name: string;
  year: number;
  ceremonyDate: string;
  venue: string;
  location: string;
  host: string;
  theme?: string;
  description?: string;
}

interface Winner {
  nominee: string;
  show: string;
  category: string;
  year: number;
  ceremony: string;
}

export default function Awards() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedAward, setSelectedAward] = useState<string>("all");

  const { data: ceremonies = [], isLoading: ceremoniesLoading } = useQuery<AwardCeremony[]>({
    queryKey: ["/api/awards/ceremonies", selectedYear],
    queryFn: async () => {
      const params = selectedYear !== "all" ? `?year=${selectedYear}` : "";
      const response = await fetch(`/api/awards/ceremonies${params}`);
      if (!response.ok) throw new Error("Failed to fetch ceremonies");
      return response.json();
    },
  });

  const { data: olivierWinners = [], isLoading: olivierLoading } = useQuery<Winner[]>({
    queryKey: ["/api/awards/winners", "Olivier Awards", "Best Actor"],
    queryFn: async () => {
      const response = await fetch(`/api/awards/winners/Olivier Awards/Best Actor?limit=5`);
      if (!response.ok) throw new Error("Failed to fetch winners");
      return response.json();
    },
  });

  const { data: tonyWinners = [], isLoading: tonyLoading } = useQuery<Winner[]>({
    queryKey: ["/api/awards/winners", "Tony Awards", "Best Actor"],
    queryFn: async () => {
      const response = await fetch(`/api/awards/winners/Tony Awards/Best Actor?limit=5`);
      if (!response.ok) throw new Error("Failed to fetch winners");
      return response.json();
    },
  });

  const majorAwards = [
    {
      name: "Olivier Awards",
      description: "The UK's premier theatre awards, named after Sir Laurence Olivier",
      icon: "🎭",
      color: "bg-purple-600",
      nextCeremony: "April 2025",
      categories: 25
    },
    {
      name: "Tony Awards", 
      description: "Broadway's highest honor for excellence in theatre",
      icon: "🏆",
      color: "bg-blue-600",
      nextCeremony: "June 2025",
      categories: 24
    },
    {
      name: "Drama Desk Awards",
      description: "Recognizing excellence in New York theatre",
      icon: "⭐",
      color: "bg-green-600", 
      nextCeremony: "May 2025",
      categories: 20
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Theatre Awards & Ceremonies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrating excellence in theatre. Explore the Olivier Awards, Tony Awards, 
            and other prestigious ceremonies that honor the best in theatrical performance.
          </p>
        </div>

        {/* Major Awards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {majorAwards.map((award) => (
            <Card key={award.name} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-16 h-16 ${award.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                  {award.icon}
                </div>
                <CardTitle className="text-xl">{award.name}</CardTitle>
                <CardDescription className="text-sm">{award.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Next Ceremony:</span>
                    <span>{award.nextCeremony}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Categories:</span>
                    <span>{award.categories}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Winners
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special Feature: Sir Larry Connection */}
        <div className="bg-purple-600 text-white rounded-lg p-8 mb-12">
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              Awards Named After Sir Larry
            </h2>
            <p className="text-lg mb-6">
              The Olivier Awards, named after Sir Laurence Olivier, are the UK's most prestigious theatre awards. 
              The next ceremony is expected in April 2025. The previous Best Actor winner was Mark Gatiss 
              for "The Motive and the Cue" at the 2024 ceremony.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <div className="bg-purple-700 rounded p-4">
                <h3 className="font-bold">Next Ceremony</h3>
                <p>April 2026 (TBA)</p>
              </div>
              <div className="bg-purple-700 rounded p-4">
                <h3 className="font-bold">Named After</h3>
                <p>Sir Laurence Olivier</p>
              </div>
              <div className="bg-purple-700 rounded p-4">
                <h3 className="font-bold">2024 Best Actor</h3>
                <p>Mark Gatiss</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex justify-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedAward} onValueChange={setSelectedAward}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select award" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Awards</SelectItem>
              <SelectItem value="olivier">Olivier Awards</SelectItem>
              <SelectItem value="tony">Tony Awards</SelectItem>
              <SelectItem value="drama-desk">Drama Desk Awards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recent Ceremonies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recent Ceremonies</h2>
          {ceremoniesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ceremonies.map((ceremony) => (
                <Card key={ceremony.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{ceremony.year}</Badge>
                      <Award className="w-5 h-5 text-amber-500" />
                    </div>
                    <CardTitle className="text-lg">{ceremony.name}</CardTitle>
                    <CardDescription>{ceremony.theme || `${ceremony.year} Ceremony`}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(ceremony.ceremonyDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {ceremony.venue}, {ceremony.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2" />
                        Hosted by {ceremony.host}
                      </div>
                      {ceremony.description && (
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {ceremony.description}
                        </p>
                      )}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      View Winners
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Winners Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Olivier Winners */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-purple-600" />
              Recent Olivier Award Winners
            </h3>
            {olivierLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {olivierWinners.slice(0, 5).map((winner, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{winner.nominee}</h4>
                          <p className="text-sm text-gray-600">{winner.show}</p>
                          <p className="text-xs text-gray-500">{winner.category}</p>
                        </div>
                        <Badge variant="outline">{winner.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Tony Winners */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-blue-600" />
              Recent Tony Award Winners
            </h3>
            {tonyLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {tonyWinners.slice(0, 5).map((winner, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{winner.nominee}</h4>
                          <p className="text-sm text-gray-600">{winner.show}</p>
                          <p className="text-xs text-gray-500">{winner.category}</p>
                        </div>
                        <Badge variant="outline">{winner.year}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-amber-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Stay Updated on Theatre Awards
          </h2>
          <p className="text-lg mb-6">
            Get notified about ceremony dates, nominations, and winners from all major theatre awards.
          </p>
          <Button variant="secondary" size="lg">
            Subscribe to Awards Updates
          </Button>
        </div>
      </div>
    </div>
  );
}