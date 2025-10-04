import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Advertisement {
  id: string;
  type: 'banner' | 'sponsored_content' | 'ticket_offer';
  title: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  landingUrl: string;
  sponsor: string;
  badge?: string;
}

const advertisements: Advertisement[] = [
  {
    id: 'disney-lion-king',
    type: 'ticket_offer',
    title: 'The Lion King - Book Now',
    description: 'Experience the magic of Disney\'s award-winning musical at the Lyceum Theatre. Premium seats available.',
    imageUrl: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    ctaText: 'Book Tickets',
    landingUrl: 'https://www.thelionking.co.uk',
    sponsor: 'Disney Theatrical',
    badge: 'Official Partner'
  },
  {
    id: 'hamilton-tickets',
    type: 'ticket_offer',
    title: 'Hamilton - Victoria Palace Theatre',
    description: 'The revolutionary musical that\'s changing theatre forever. Get your tickets now.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    ctaText: 'Get Tickets',
    landingUrl: 'https://hamiltonmusical.com/london',
    sponsor: 'Cameron Mackintosh',
    badge: 'Limited Availability'
  },
  {
    id: 'phantom-anniversary',
    type: 'sponsored_content',
    title: 'The Phantom of the Opera',
    description: 'The longest-running musical in West End history. Don\'t miss your final chance to see this legendary show.',
    imageUrl: 'https://images.unsplash.com/photo-1516715094483-75da06977943?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    ctaText: 'Final Performances',
    landingUrl: 'https://www.thephantomoftheopera.com',
    sponsor: 'Really Useful Group',
    badge: 'Final Season'
  },
  {
    id: 'wicked-anniversary',
    type: 'ticket_offer',
    title: 'Wicked - 20th Anniversary',
    description: 'Celebrating 20 years of defying gravity. The West End\'s most popular musical.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    ctaText: 'Anniversary Tickets',
    landingUrl: 'https://www.wickedthemusical.co.uk',
    sponsor: 'Universal Stage Productions',
    badge: '20th Anniversary'
  },
  {
    id: 'chicago-extended',
    type: 'banner',
    title: 'Chicago - Extended Run',
    description: 'The jazz-age musical that never goes out of style. Now booking through 2025.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    ctaText: 'Book Extended Run',
    landingUrl: 'https://chicagothemusical.com',
    sponsor: 'Barry Weissler',
    badge: 'Extended'
  },
  {
    id: 'matilda-family',
    type: 'ticket_offer',
    title: 'Matilda The Musical',
    description: 'Perfect family entertainment from the Royal Shakespeare Company. Children\'s tickets from £20.',
    imageUrl: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200',
    ctaText: 'Family Tickets',
    landingUrl: 'https://uk.matildathemusical.com',
    sponsor: 'RSC',
    badge: 'Family Show'
  }
];

interface AdvertisementProps {
  placement: 'sidebar' | 'banner' | 'inline';
  className?: string;
}

export default function Advertisement({ placement, className = '' }: AdvertisementProps) {
  const [currentAd, setCurrentAd] = useState<Advertisement>(advertisements[0]);

  useEffect(() => {
    // Rotate ads every 30 seconds for banner/sidebar placements
    if (placement === 'banner' || placement === 'sidebar') {
      const interval = setInterval(() => {
        setCurrentAd(prev => {
          const currentIndex = advertisements.indexOf(prev);
          const nextIndex = (currentIndex + 1) % advertisements.length;
          return advertisements[nextIndex];
        });
      }, 30000);

      return () => clearInterval(interval);
    } else {
      // Random ad for inline placement
      const randomAd = advertisements[Math.floor(Math.random() * advertisements.length)];
      setCurrentAd(randomAd);
    }
  }, [placement]);

  const handleClick = () => {
    // Track ad click for analytics
    console.log('Ad clicked:', currentAd.id);
    window.open(currentAd.landingUrl, '_blank', 'noopener,noreferrer');
  };

  if (placement === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-purple-900 to-purple-700 text-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentAd.imageUrl && (
                <img 
                  src={currentAd.imageUrl} 
                  alt={currentAd.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg">{currentAd.title}</h3>
                  {currentAd.badge && (
                    <Badge variant="secondary" className="bg-gold text-purple-900">
                      {currentAd.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-purple-100">{currentAd.description}</p>
                <p className="text-xs text-purple-200 mt-1">Sponsored by {currentAd.sponsor}</p>
              </div>
            </div>
            <Button 
              onClick={handleClick}
              className="bg-gold text-purple-900 hover:bg-yellow-300 font-semibold"
            >
              {currentAd.ctaText}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (placement === 'sidebar') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm ${className}`}>
        {currentAd.imageUrl && (
          <img 
            src={currentAd.imageUrl} 
            alt={currentAd.title}
            className="w-full h-32 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm text-gray-900">{currentAd.title}</h4>
            {currentAd.badge && (
              <Badge variant="outline" className="text-xs">
                {currentAd.badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-3">{currentAd.description}</p>
          <Button 
            onClick={handleClick}
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {currentAd.ctaText}
          </Button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Sponsored by {currentAd.sponsor}
          </p>
        </div>
      </div>
    );
  }

  // Inline placement
  return (
    <div className={`bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {currentAd.imageUrl && (
            <img 
              src={currentAd.imageUrl} 
              alt={currentAd.title}
              className="w-12 h-12 object-cover rounded"
            />
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-sm text-gray-900">{currentAd.title}</h4>
              {currentAd.badge && (
                <Badge variant="outline" className="text-xs">
                  {currentAd.badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-600">{currentAd.description}</p>
            <p className="text-xs text-gray-400">Sponsored by {currentAd.sponsor}</p>
          </div>
        </div>
        <Button 
          onClick={handleClick}
          size="sm"
          variant="outline"
          className="border-purple-600 text-purple-600 hover:bg-purple-50"
        >
          {currentAd.ctaText}
        </Button>
      </div>
    </div>
  );
}