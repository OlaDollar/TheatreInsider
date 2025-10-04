import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Lightbulb } from "lucide-react";
import { Link } from "wouter";

interface TheatreFact {
  id: string;
  date: string;
  type: 'show' | 'performer' | 'venue' | 'history';
  title: string;
  fact: string;
  relatedShow?: string;
  relatedPerformer?: string;
  imageUrl?: string;
}

export default function DailyFactWidget() {
  const { data: todaysFact, isLoading } = useQuery<TheatreFact>({
    queryKey: ["/api/theatre-facts"],
    refetchInterval: 24 * 60 * 60 * 1000, // Refresh daily
  });

  const shareFact = async () => {
    if (!todaysFact) return;
    
    const shareData = {
      title: `Theatre Fact: ${todaysFact.title}`,
      text: todaysFact.fact,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `Theatre Fact: ${todaysFact.title}\n\n${todaysFact.fact}\n\nFrom Theatre Spotlight`
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
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-800">Today's Theatre Fact</h3>
          </div>
          <div className="text-gray-500">Loading today's theatre fact...</div>
        </CardContent>
      </Card>
    );
  }

  if (!todaysFact) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-purple-200 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-purple-800">Today's Theatre Fact</h3>
            <Badge className={getTypeColor(todaysFact.type)}>
              {getTypeIcon(todaysFact.type)} {todaysFact.type.charAt(0).toUpperCase() + todaysFact.type.slice(1)}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={shareFact}
            className="text-purple-600 hover:text-purple-700"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-2">{todaysFact.title}</h4>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{todaysFact.fact}</p>
        
        {(todaysFact.relatedShow || todaysFact.relatedPerformer) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {todaysFact.relatedShow && (
              <Badge variant="outline" className="text-xs">Show: {todaysFact.relatedShow}</Badge>
            )}
            {todaysFact.relatedPerformer && (
              <Badge variant="outline" className="text-xs">Performer: {todaysFact.relatedPerformer}</Badge>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Updated daily • {new Date(todaysFact.date).toLocaleDateString()}
          </span>
          <Link href="/facts">
            <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
              More Theatre Facts
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}