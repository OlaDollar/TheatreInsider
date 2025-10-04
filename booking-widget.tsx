import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Calendar, Pounds, ExternalLink, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

interface BookingInfo {
  bookingAvailable: boolean;
  available?: boolean;
  showTitle?: string;
  venue?: string;
  availableSeats?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  nextAvailableDate?: string;
  trackingUrl?: string;
}

interface BookingWidgetProps {
  articleId: number;
  className?: string;
}

export default function BookingWidget({ articleId, className = "" }: BookingWidgetProps) {
  const [, setLocation] = useLocation();
  const [isBooking, setIsBooking] = useState(false);

  const { data: bookingInfo, isLoading } = useQuery<BookingInfo>({
    queryKey: ['/api/articles', articleId, 'booking'],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}/booking`);
      if (!response.ok) throw new Error('Failed to fetch booking info');
      return response.json();
    }
  });

  // Check for booking completion in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('booking_complete') === 'true') {
      // Clear the parameter and redirect to home
      setTimeout(() => {
        setLocation('/');
      }, 2000);
    }
  }, [setLocation]);

  const handleBookNow = () => {
    if (!bookingInfo?.trackingUrl) return;
    
    setIsBooking(true);
    
    // Track the booking click
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'booking_clicked',
        article_id: articleId,
        show_title: bookingInfo.showTitle
      })
    }).catch(console.error);
    
    // Open booking page in new window
    const bookingWindow = window.open(
      bookingInfo.trackingUrl,
      '_blank',
      'width=1024,height=768,scrollbars=yes,resizable=yes'
    );
    
    if (bookingWindow) {
      // Monitor the booking window
      const checkClosed = setInterval(() => {
        if (bookingWindow.closed) {
          clearInterval(checkClosed);
          setIsBooking(false);
          
          // Show completion message and redirect after delay
          setTimeout(() => {
            setLocation('/?booking_complete=true');
          }, 1000);
        }
      }, 1000);
      
      // Fallback: stop monitoring after 30 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        setIsBooking(false);
      }, 30 * 60 * 1000);
    } else {
      // Fallback: direct navigation if popup blocked
      window.location.href = bookingInfo.trackingUrl;
    }
  };

  if (isLoading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bookingInfo?.bookingAvailable || !bookingInfo.available) {
    return null; // Don't show widget if no booking available
  }

  const isUrlComplete = new URLSearchParams(window.location.search).get('booking_complete') === 'true';

  if (isUrlComplete) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Booking completed!</p>
              <p className="text-sm text-green-600">Redirecting to home page...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-theatre-primary/20 bg-purple-50/50 ${className} mb-6`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Ticket className="h-4 w-4 text-theatre-primary" />
            <CardTitle className="text-base">Tickets Available</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
            Available
          </Badge>
        </div>
        {bookingInfo.showTitle && (
          <CardDescription>
            <strong>{bookingInfo.showTitle}</strong>
            {bookingInfo.venue && ` at ${bookingInfo.venue}`}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Availability Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Next Available</p>
                <p className="text-gray-600">
                  {bookingInfo.nextAvailableDate ? 
                    new Date(bookingInfo.nextAvailableDate).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      month: 'short', 
                      day: 'numeric'
                    }) : 
                    'Multiple dates'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Pounds className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">From</p>
                <p className="text-gray-600">
                  £{bookingInfo.priceRange?.min} - £{bookingInfo.priceRange?.max}
                </p>
              </div>
            </div>
          </div>

          {/* Seats Available */}
          {bookingInfo.availableSeats && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Seats available:</span>
              <span className="font-medium text-green-600">
                {bookingInfo.availableSeats.toLocaleString()}+
              </span>
            </div>
          )}

          {/* Book Now Button */}
          <Button 
            onClick={handleBookNow}
            disabled={isBooking}
            className="w-full bg-theatre-primary hover:bg-theatre-primary/90"
          >
            {isBooking ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Opening booking page...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Book Tickets Now
              </>
            )}
          </Button>

          {/* Affiliate Disclosure */}
          <p className="text-xs text-gray-500 text-center mt-2">
            Affiliate partner • Supports independent journalism
          </p>
        </div>
      </CardContent>
    </Card>
  );
}