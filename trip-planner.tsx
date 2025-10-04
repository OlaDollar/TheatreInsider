import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Calendar as CalendarIcon, Plane, Hotel, Ship, Ticket, Star, ExternalLink, Users, Clock, Banknote } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";

interface TripPlan {
  destination: 'london' | 'newyork' | 'multi';
  startDate: Date;
  endDate: Date;
  nights: number;
  travelers: number;
  budget: number;
  showCount: number;
  preferences: {
    accommodation: 'budget' | 'mid' | 'luxury';
    showTypes: string[];
    transport: 'flight' | 'cruise' | 'train';
    flexibility: boolean;
  };
}

interface ShowOption {
  id: string;
  title: string;
  venue: string;
  dates: Date[];
  priceFrom: number;
  rating: number;
  category: string;
  duration: string;
  description: string;
  ticketUrl: string;
  imageUrl: string;
}

interface TravelOption {
  type: 'flight' | 'hotel' | 'cruise';
  provider: string;
  name: string;
  price: number;
  rating: number;
  location?: string;
  features: string[];
  bookingUrl: string;
  imageUrl: string;
}

export default function TripPlanner() {
  const [tripPlan, setTripPlan] = useState<TripPlan>({
    destination: 'london',
    startDate: new Date(),
    endDate: addDays(new Date(), 3),
    nights: 3,
    travelers: 2,
    budget: 1500,
    showCount: 2,
    preferences: {
      accommodation: 'mid',
      showTypes: ['musical', 'play'],
      transport: 'flight',
      flexibility: true
    }
  });

  const [selectedShows, setSelectedShows] = useState<ShowOption[]>([]);
  const [currentStep, setCurrentStep] = useState<'details' | 'shows' | 'travel' | 'summary'>('details');

  // Mock data - in production would come from APIs
  const { data: availableShows = [] } = useQuery<ShowOption[]>({
    queryKey: ['/api/shows/available', tripPlan.destination, tripPlan.startDate, tripPlan.endDate],
    queryFn: () => Promise.resolve([
      {
        id: '1',
        title: 'The Lion King',
        venue: 'Lyceum Theatre',
        dates: [tripPlan.startDate, addDays(tripPlan.startDate, 1), addDays(tripPlan.startDate, 2)],
        priceFrom: 45,
        rating: 4.8,
        category: 'Musical',
        duration: '2h 45m',
        description: 'Disney\'s award-winning musical spectacular',
        ticketUrl: 'https://www.seetickets.com/event/the-lion-king/lyceum-theatre/2024?aff=THEATRESPOTLIGHT',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
      },
      {
        id: '2', 
        title: 'Hamilton',
        venue: 'Victoria Palace Theatre',
        dates: [addDays(tripPlan.startDate, 1), addDays(tripPlan.startDate, 2), addDays(tripPlan.startDate, 3)],
        priceFrom: 65,
        rating: 4.9,
        category: 'Musical',
        duration: '2h 55m',
        description: 'Lin-Manuel Miranda\'s revolutionary musical',
        ticketUrl: 'https://www.ticketmaster.com/hamilton-tickets/artist/2374064?tm_link=TM_AFF_THEATRE_SPOTLIGHT',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'
      },
      {
        id: '3',
        title: 'The Phantom of the Opera',
        venue: 'His Majesty\'s Theatre',
        dates: [tripPlan.startDate, addDays(tripPlan.startDate, 2), addDays(tripPlan.startDate, 3)],
        priceFrom: 35,
        rating: 4.7,
        category: 'Musical',
        duration: '2h 30m',
        description: 'Andrew Lloyd Webber\'s timeless classic',
        ticketUrl: 'https://www.atgtickets.com/shows/the-phantom-of-the-opera?affiliate=THEATRESPOTLIGHT',
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'
      }
    ])
  });

  const { data: travelOptions = [] } = useQuery<TravelOption[]>({
    queryKey: ['/api/travel/options', tripPlan.destination, tripPlan.budget, tripPlan.preferences.accommodation],
    queryFn: () => Promise.resolve([
      // Flights
      {
        type: 'flight',
        provider: 'British Airways',
        name: 'London Return Flight',
        price: 280,
        rating: 4.2,
        features: ['Direct flight', 'Checked bag included', 'Seat selection'],
        bookingUrl: 'https://www.expedia.com/Flights?aff=THEATRESPOTLIGHT',
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'
      },
      // Hotels
      {
        type: 'hotel',
        provider: 'Premier Inn',
        name: 'Premier Inn London County Hall',
        price: 85,
        rating: 4.4,
        location: 'South Bank, 10min to West End',
        features: ['Free WiFi', 'Air conditioning', 'Restaurant', 'Gym'],
        bookingUrl: 'https://www.booking.com/hotel/gb/premier-inn-london-county-hall.html?aid=THEATRESPOTLIGHT',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
      },
      {
        type: 'hotel',
        provider: 'The Savoy',
        name: 'The Savoy London',
        price: 450,
        rating: 4.8,
        location: 'Covent Garden, 5min to West End',
        features: ['Luxury suites', 'Butler service', 'Michelin dining', 'Spa'],
        bookingUrl: 'https://www.booking.com/hotel/gb/savoy.html?aid=THEATRESPOTLIGHT',
        imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400'
      },
      // Cruises
      {
        type: 'cruise',
        provider: 'P&O Cruises',
        name: 'Thames to Broadway Cruise',
        price: 1200,
        rating: 4.6,
        features: ['7 nights', 'All meals included', 'Theatre shows onboard', 'Shore excursions'],
        bookingUrl: 'https://www.getyourguide.com/london-cruises?partner_id=THEATRESPOTLIGHT',
        imageUrl: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400'
      }
    ])
  });

  const updateTripPlan = (updates: Partial<TripPlan>) => {
    setTripPlan(prev => ({ ...prev, ...updates }));
  };

  const calculateNights = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalCost = () => {
    const accommodationCost = travelOptions
      .filter(opt => opt.type === 'hotel')
      .find(opt => 
        (tripPlan.preferences.accommodation === 'budget' && opt.price < 100) ||
        (tripPlan.preferences.accommodation === 'mid' && opt.price >= 100 && opt.price < 300) ||
        (tripPlan.preferences.accommodation === 'luxury' && opt.price >= 300)
      )?.price || 0;

    const transportCost = travelOptions
      .filter(opt => opt.type === tripPlan.preferences.transport)
      .reduce((sum, opt) => sum + opt.price, 0);

    const showsCost = selectedShows.reduce((sum, show) => sum + show.priceFrom, 0);

    return (accommodationCost * tripPlan.nights + transportCost + showsCost) * tripPlan.travelers;
  };

  const generateItinerary = () => {
    const itinerary = [];
    const currentDate = new Date(tripPlan.startDate);
    
    for (let i = 0; i < tripPlan.nights + 1; i++) {
      const dayShows = selectedShows.filter(show => 
        show.dates.some(date => isSameDay(date, currentDate))
      );
      
      itinerary.push({
        date: new Date(currentDate),
        day: i + 1,
        shows: dayShows,
        activities: i === 0 ? ['Arrival & Check-in'] : 
                   i === tripPlan.nights ? ['Check-out & Departure'] : 
                   ['Free time for sightseeing']
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return itinerary;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Plan My Theatre Trip
        </h1>
        <p className="text-gray-600 mb-6">
          Create the perfect theatre getaway with curated shows, flights, hotels, and experiences
        </p>

        {/* Progress Steps */}
        <div className="flex items-center space-x-4 mb-6">
          {[
            { id: 'details', label: 'Trip Details', icon: MapPin },
            { id: 'shows', label: 'Select Shows', icon: Ticket },
            { id: 'travel', label: 'Travel & Stay', icon: Plane },
            { id: 'summary', label: 'Summary', icon: CalendarIcon }
          ].map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = ['details', 'shows', 'travel', 'summary'].indexOf(currentStep) > index;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${isActive ? 'bg-theatre-primary border-theatre-primary text-white' : 
                    isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                    'bg-white border-gray-300 text-gray-400'}
                `}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${isActive ? 'text-theatre-primary' : 'text-gray-500'}`}>
                  {step.label}
                </span>
                {index < 3 && <div className="w-12 h-px bg-gray-300 mx-4" />}
              </div>
            );
          })}
        </div>
      </div>

      <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)}>
        {/* Step 1: Trip Details */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Tell us about your perfect theatre getaway</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Destination */}
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Select value={tripPlan.destination} onValueChange={(value: any) => updateTripPlan({ destination: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="london">London West End</SelectItem>
                      <SelectItem value="newyork">New York Broadway</SelectItem>
                      <SelectItem value="multi">Multi-City (London + NYC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Travelers */}
                <div className="space-y-2">
                  <Label>Number of Travelers</Label>
                  <Select value={tripPlan.travelers.toString()} onValueChange={(value) => updateTripPlan({ travelers: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3">3 People</SelectItem>
                      <SelectItem value="4">4 People</SelectItem>
                      <SelectItem value="5">5+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(tripPlan.startDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tripPlan.startDate}
                        onSelect={(date) => date && updateTripPlan({ 
                          startDate: date,
                          endDate: addDays(date, tripPlan.nights)
                        })}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(tripPlan.endDate, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tripPlan.endDate}
                        onSelect={(date) => {
                          if (date) {
                            const nights = calculateNights(tripPlan.startDate, date);
                            updateTripPlan({ endDate: date, nights });
                          }
                        }}
                        disabled={(date) => date <= tripPlan.startDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label>Budget per Person (£{tripPlan.budget})</Label>
                <Slider
                  value={[tripPlan.budget]}
                  onValueChange={([value]) => updateTripPlan({ budget: value })}
                  max={5000}
                  min={200}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>£200</span>
                  <span>£5000+</span>
                </div>
              </div>

              {/* Show Count */}
              <div className="space-y-2">
                <Label>Number of Shows ({tripPlan.showCount})</Label>
                <Slider
                  value={[tripPlan.showCount]}
                  onValueChange={([value]) => updateTripPlan({ showCount: value })}
                  max={Math.min(tripPlan.nights + 1, 6)}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="font-semibold">Preferences</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Accommodation</Label>
                    <Select value={tripPlan.preferences.accommodation} onValueChange={(value: any) => 
                      updateTripPlan({ preferences: { ...tripPlan.preferences, accommodation: value } })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget (£50-£100)</SelectItem>
                        <SelectItem value="mid">Mid-range (£100-£300)</SelectItem>
                        <SelectItem value="luxury">Luxury (£300+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Transport</Label>
                    <Select value={tripPlan.preferences.transport} onValueChange={(value: any) => 
                      updateTripPlan({ preferences: { ...tripPlan.preferences, transport: value } })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flight">Flight</SelectItem>
                        <SelectItem value="cruise">Cruise</SelectItem>
                        <SelectItem value="train">Train (Eurostar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Show Types</Label>
                    <div className="space-y-2">
                      {['Musical', 'Play', 'Comedy', 'Drama'].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={tripPlan.preferences.showTypes.includes(type.toLowerCase())}
                            onCheckedChange={(checked) => {
                              const showTypes = checked 
                                ? [...tripPlan.preferences.showTypes, type.toLowerCase()]
                                : tripPlan.preferences.showTypes.filter(t => t !== type.toLowerCase());
                              updateTripPlan({ preferences: { ...tripPlan.preferences, showTypes } });
                            }}
                          />
                          <Label htmlFor={type} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => setCurrentStep('shows')} className="w-full">
                Find Available Shows
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Show Selection */}
        <TabsContent value="shows">
          <Card>
            <CardHeader>
              <CardTitle>Available Shows</CardTitle>
              <CardDescription>
                Choose {tripPlan.showCount} shows for your {tripPlan.nights}-night trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableShows.map((show) => (
                  <Card 
                    key={show.id} 
                    className={`cursor-pointer transition-all ${
                      selectedShows.find(s => s.id === show.id) 
                        ? 'ring-2 ring-theatre-primary bg-purple-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      if (selectedShows.find(s => s.id === show.id)) {
                        setSelectedShows(prev => prev.filter(s => s.id !== show.id));
                      } else if (selectedShows.length < tripPlan.showCount) {
                        setSelectedShows(prev => [...prev, show]);
                      }
                    }}
                  >
                    <div className="aspect-video relative">
                      <img 
                        src={show.imageUrl} 
                        alt={show.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2">
                        {show.category}
                      </Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{show.title}</CardTitle>
                          <CardDescription>{show.venue}</CardDescription>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm">{show.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-3">{show.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {show.duration}
                        </span>
                        <span className="font-semibold text-theatre-primary">
                          From £{show.priceFrom}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Available dates:</p>
                        <div className="flex flex-wrap gap-1">
                          {show.dates.slice(0, 3).map((date, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {format(date, 'MMM d')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {selectedShows.find(s => s.id === show.id) && (
                        <Badge className="w-full mt-2 justify-center">
                          Selected
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Selected {selectedShows.length} of {tripPlan.showCount} shows
                </p>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setCurrentStep('details')}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep('travel')}
                    disabled={selectedShows.length === 0}
                  >
                    Continue to Travel Options
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Travel & Accommodation */}
        <TabsContent value="travel">
          <div className="space-y-6">
            {/* Transport Options */}
            <Card>
              <CardHeader>
                <CardTitle>Transport</CardTitle>
                <CardDescription>Choose your preferred way to travel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {travelOptions.filter(opt => opt.type === tripPlan.preferences.transport).map((option, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <div className="aspect-video relative">
                        <img 
                          src={option.imageUrl} 
                          alt={option.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                        <CardDescription>{option.provider}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm">{option.rating}</span>
                            </div>
                            <span className="font-bold text-theatre-primary">
                              £{option.price}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {option.features.map((feature, idx) => (
                              <p key={idx} className="text-sm text-gray-600">• {feature}</p>
                            ))}
                          </div>

                          <Button asChild className="w-full">
                            <a href={option.bookingUrl} target="_blank" rel="noopener sponsored">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Book Now
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hotel Options */}
            <Card>
              <CardHeader>
                <CardTitle>Accommodation</CardTitle>
                <CardDescription>Hotels near the theatre district</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {travelOptions.filter(opt => opt.type === 'hotel').map((hotel, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <div className="aspect-video relative">
                        <img 
                          src={hotel.imageUrl} 
                          alt={hotel.name}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{hotel.name}</CardTitle>
                        <CardDescription>
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {hotel.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm">{hotel.rating}</span>
                            </div>
                            <span className="font-bold text-theatre-primary">
                              £{hotel.price}/night
                            </span>
                          </div>

                          <div className="space-y-1">
                            {hotel.features.map((feature, idx) => (
                              <p key={idx} className="text-sm text-gray-600">• {feature}</p>
                            ))}
                          </div>

                          <Button asChild className="w-full">
                            <a href={hotel.bookingUrl} target="_blank" rel="noopener sponsored">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Book {tripPlan.nights} nights
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('shows')}>
                Back to Shows
              </Button>
              <Button onClick={() => setCurrentStep('summary')}>
                Review Trip Summary
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Step 4: Summary */}
        <TabsContent value="summary">
          <div className="space-y-6">
            {/* Trip Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Summary</CardTitle>
                <CardDescription>
                  Your {tripPlan.nights}-night theatre adventure in {tripPlan.destination === 'london' ? 'London' : tripPlan.destination === 'newyork' ? 'New York' : 'London & New York'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="h-5 w-5 text-theatre-primary" />
                      <div>
                        <p className="font-medium">Travel Dates</p>
                        <p className="text-sm text-gray-600">
                          {format(tripPlan.startDate, 'MMM d')} - {format(tripPlan.endDate, 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-theatre-primary" />
                      <div>
                        <p className="font-medium">Travelers</p>
                        <p className="text-sm text-gray-600">{tripPlan.travelers} people</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Banknote className="h-5 w-5 text-theatre-primary" />
                      <div>
                        <p className="font-medium">Estimated Total Cost</p>
                        <p className="text-lg font-bold text-theatre-primary">£{getTotalCost().toLocaleString()}</p>
                        <p className="text-xs text-gray-500">For {tripPlan.travelers} people</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Selected Shows</h3>
                    {selectedShows.map((show) => (
                      <div key={show.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Ticket className="h-5 w-5 text-theatre-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{show.title}</p>
                          <p className="text-sm text-gray-600">{show.venue}</p>
                        </div>
                        <span className="text-sm font-medium">£{show.priceFrom}+</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Your Itinerary</CardTitle>
                <CardDescription>Day-by-day breakdown of your trip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generateItinerary().map((day, index) => (
                    <div key={index} className="border-l-2 border-theatre-primary pl-4 pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-theatre-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {day.day}
                        </div>
                        <div>
                          <p className="font-medium">{format(day.date, 'EEEE, MMM d')}</p>
                          <p className="text-sm text-gray-600">
                            {day.day === 1 ? 'Arrival Day' : 
                             day.day === tripPlan.nights + 1 ? 'Departure Day' :
                             `Day ${day.day - 1}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="ml-10 space-y-2">
                        {day.activities.map((activity, idx) => (
                          <p key={idx} className="text-sm text-gray-600">• {activity}</p>
                        ))}
                        
                        {day.shows.map((show) => (
                          <div key={show.id} className="flex items-center space-x-2 p-2 bg-purple-50 rounded">
                            <Ticket className="h-4 w-4 text-theatre-primary" />
                            <span className="text-sm font-medium">{show.title} at {show.venue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Start Booking</CardTitle>
                <CardDescription>Book your trip components through our trusted partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button asChild className="h-auto p-4 flex-col">
                    <a href="#" target="_blank" rel="noopener">
                      <Ticket className="h-6 w-6 mb-2" />
                      <span>Book Show Tickets</span>
                      <span className="text-xs opacity-75 mt-1">From £{selectedShows.reduce((min, show) => Math.min(min, show.priceFrom), Infinity)}</span>
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-4 flex-col">
                    <a href="#" target="_blank" rel="noopener">
                      <Hotel className="h-6 w-6 mb-2" />
                      <span>Book Accommodation</span>
                      <span className="text-xs opacity-75 mt-1">{tripPlan.nights} nights</span>
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="h-auto p-4 flex-col">
                    <a href="#" target="_blank" rel="noopener">
                      <Plane className="h-6 w-6 mb-2" />
                      <span>Book Transport</span>
                      <span className="text-xs opacity-75 mt-1">{tripPlan.travelers} travelers</span>
                    </a>
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Booking Tip:</strong> Book show tickets first as availability is limited. 
                    Accommodation and transport can be adjusted based on your final show schedule.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setCurrentStep('travel')}>
                Back to Travel Options
              </Button>
              <Button onClick={() => setCurrentStep('details')}>
                Plan Another Trip
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Affiliate Disclosure */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 italic">
          <strong>Partner Disclosure:</strong> Theatre Spotlight may earn commission from bookings made through our travel and ticket partners including Booking.com, Expedia, Ticketmaster, and See Tickets. This helps support our independent theatre journalism at no extra cost to you. We only recommend services we trust and believe will enhance your theatre experience.
        </p>
      </div>
    </div>
  );
}