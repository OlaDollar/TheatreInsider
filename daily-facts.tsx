import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Share2, Bookmark, ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";

interface TheatreFact {
  id: string;
  date: string;
  type: 'show' | 'performer' | 'venue' | 'history';
  title: string;
  fact: string;
  relatedShow?: string;
  relatedPerformer?: string;
  imageUrl?: string;
  source?: string;
}

export default function DailyFacts() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookmarkedFacts, setBookmarkedFacts] = useState<Set<string>>(new Set());

  const { data: todaysFact, isLoading, refetch } = useQuery<TheatreFact>({
    queryKey: ["/api/theatre-facts", selectedDate],
    refetchInterval: false,
  });

  const { data: recentFacts } = useQuery<TheatreFact[]>({
    queryKey: ["/api/theatre-facts/recent", 7], // Last 7 days
    refetchInterval: false,
  });

  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    // Don't go beyond today
    const today = new Date();
    if (newDate <= today) {
      setSelectedDate(newDate.toISOString().split('T')[0]);
    }
  };

  const toggleBookmark = (factId: string) => {
    const newBookmarks = new Set(bookmarkedFacts);
    if (bookmarkedFacts.has(factId)) {
      newBookmarks.delete(factId);
    } else {
      newBookmarks.add(factId);
    }
    setBookmarkedFacts(newBookmarks);
  };

  const shareFact = async (fact: TheatreFact) => {
    const shareData = {
      title: `Theatre Fact: ${fact.title}`,
      text: fact.fact,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(
          `Theatre Fact: ${fact.title}\n\n${fact.fact}\n\nFrom Theatre Spotlight: ${window.location.href}`
        );
        alert('Fact copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'show': return 'bg-purple-100 text-purple-800';
      case 'performer': return 'bg-blue-100 text-blue-800';
      case 'venue': return 'bg-green-100 text-green-800';
      case 'history': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'show': return '🎭';
      case 'performer': return '⭐';
      case 'venue': return '🏛️';
      case 'history': return '📚';
      default: return '💡';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Loading today's theatre fact...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Daily Theatre Facts | Learn Something New Every Day
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Discover fascinating facts about Broadway shows, West End productions, theatre history, 
          and the performers who made it all possible. A new fact every day for 15+ years!
        </p>
      </div>

      {/* Value Proposition Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">15+ Years of Theatre Knowledge</h2>
            <p className="text-purple-100">
              Over 5,500 unique facts covering every aspect of theatre from 1600s to today
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              <Lightbulb className="w-8 h-8" />
            </div>
            <div className="text-sm text-purple-200">Daily learning</div>
          </div>
        </div>
      </div>

      {/* Today's Fact */}
      {todaysFact && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(todaysFact.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <Badge className={getTypeColor(todaysFact.type)}>
                  {getTypeIcon(todaysFact.type)} {todaysFact.type.charAt(0).toUpperCase() + todaysFact.type.slice(1)}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleBookmark(todaysFact.id)}
                  className={bookmarkedFacts.has(todaysFact.id) ? 'text-yellow-600' : ''}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareFact(todaysFact)}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-xl">{todaysFact.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysFact.imageUrl && (
              <img
                src={todaysFact.imageUrl}
                alt={todaysFact.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=300';
                }}
              />
            )}
            <p className="text-gray-700 leading-relaxed">{todaysFact.fact}</p>
            
            {(todaysFact.relatedShow || todaysFact.relatedPerformer) && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {todaysFact.relatedShow && (
                    <Badge variant="outline">Show: {todaysFact.relatedShow}</Badge>
                  )}
                  {todaysFact.relatedPerformer && (
                    <Badge variant="outline">Performer: {todaysFact.relatedPerformer}</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Date Navigation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Explore Other Dates</CardTitle>
          <CardDescription>Browse theatre facts from any date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigateDate('prev')}
              disabled={selectedDate <= '2024-01-01'}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous Day
            </Button>
            
            <div className="flex items-center space-x-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="2024-01-01"
                className="w-auto"
              />
              <Button onClick={() => refetch()}>
                Load Fact
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigateDate('next')}
              disabled={selectedDate >= new Date().toISOString().split('T')[0]}
            >
              Next Day
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Facts */}
      {recentFacts && recentFacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Theatre Facts</CardTitle>
            <CardDescription>Catch up on facts from the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFacts.map((fact) => (
                <div
                  key={fact.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getTypeColor(fact.type)}>
                        {getTypeIcon(fact.type)} {fact.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(fact.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(fact.id)}
                        className={bookmarkedFacts.has(fact.id) ? 'text-yellow-600' : ''}
                      >
                        <Bookmark className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareFact(fact)}
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{fact.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{fact.fact}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Access Today Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => {
            setSelectedDate(new Date().toISOString().split('T')[0]);
            refetch();
          }}
          className="rounded-full shadow-lg"
          size="lg"
        >
          Today's Fact
        </Button>
      </div>
    </div>
  );
}