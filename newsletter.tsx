import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Star, Users, Globe, CheckCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [region, setRegion] = useState("both");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const interestOptions = [
    { id: "west_end", label: "West End News" },
    { id: "broadway", label: "Broadway Updates" },
    { id: "reviews", label: "Theatre Reviews" },
    { id: "performers", label: "Star Interviews" },
    { id: "cabaret", label: "Cabaret & Concerts" },
    { id: "youth", label: "Youth Theatre" },
    { id: "development", label: "New Writing" },
  ];

  const subscribeMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/newsletter/subscribe", "POST", data),
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Welcome to Theatre Spotlight!",
        description: "You're now subscribed to our exclusive theatre newsletter.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/newsletter'] });
    },
    onError: () => {
      toast({
        title: "Subscription Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, interestId]);
    } else {
      setInterests(interests.filter(id => id !== interestId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    subscribeMutation.mutate({
      email,
      name: name || null,
      interests: interests.length > 0 ? interests : null,
      region,
      source: "newsletter_page"
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-theatre-primary/10 to-theatre-accent/10 flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-theatre-dark mb-4">Welcome Aboard!</h2>
            <p className="text-gray-600 mb-6">
              You're now part of our exclusive theatre community. Check your email for a welcome message and your first edition of Theatre Spotlight Weekly.
            </p>
            <div className="bg-theatre-primary/5 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-theatre-dark mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Weekly theatre news digest every Friday</li>
                <li>• Exclusive performer interviews</li>
                <li>• Early access to show reviews</li>
                <li>• Insider tips on ticket deals</li>
              </ul>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-theatre-primary hover:bg-theatre-primary/90"
            >
              Explore Theatre Spotlight
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-theatre-primary/10 to-theatre-accent/10">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-theatre-dark mb-4">
            Join Theatre Spotlight
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get exclusive access to Mark Shenton's expert theatre insights, performer interviews, 
            and breaking news from the world's premier theatre destinations.
          </p>
          
          {/* Value Proposition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Star className="h-8 w-8 text-theatre-accent mx-auto mb-4" />
              <h3 className="font-semibold text-theatre-dark mb-2">Expert Analysis</h3>
              <p className="text-sm text-gray-600">Mark Shenton's renowned theatre criticism and industry insights</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-theatre-accent mx-auto mb-4" />
              <h3 className="font-semibold text-theatre-dark mb-2">Exclusive Access</h3>
              <p className="text-sm text-gray-600">Behind-the-scenes interviews with theatre's biggest stars</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Globe className="h-8 w-8 text-theatre-accent mx-auto mb-4" />
              <h3 className="font-semibold text-theatre-dark mb-2">Global Coverage</h3>
              <p className="text-sm text-gray-600">West End, Broadway, and international theatre news</p>
            </div>
          </div>
        </div>

        {/* Newsletter Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-theatre-dark">
              <Mail className="h-6 w-6" />
              Subscribe to Theatre Spotlight Weekly
            </CardTitle>
            <p className="text-gray-600">
              Join 10,000+ theatre enthusiasts who trust us for the latest news and reviews
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name (Optional)
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Region Preference */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Theatre Region Preference</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="uk"
                      checked={region === "uk"}
                      onChange={(e) => setRegion(e.target.value)}
                      className="text-theatre-primary"
                    />
                    <span className="text-sm">UK Theatre Focus</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="us"
                      checked={region === "us"}
                      onChange={(e) => setRegion(e.target.value)}
                      className="text-theatre-primary"
                    />
                    <span className="text-sm">US Theatre Focus</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="both"
                      checked={region === "both"}
                      onChange={(e) => setRegion(e.target.value)}
                      className="text-theatre-primary"
                    />
                    <span className="text-sm">Global Coverage</span>
                  </label>
                </div>
              </div>

              {/* Interest Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Content Interests (Optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {interestOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={interests.includes(option.id)}
                        onCheckedChange={(checked) => handleInterestChange(option.id, !!checked)}
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-600">
                <p className="mb-2">
                  <strong>Privacy Promise:</strong> We respect your inbox. You'll receive our weekly newsletter plus occasional breaking news alerts. No spam, ever.
                </p>
                <p>
                  Unsubscribe anytime with one click. We never share your email with third parties.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={subscribeMutation.isPending || !email}
                className="w-full bg-theatre-primary hover:bg-theatre-primary/90 text-white py-3 text-lg font-medium"
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Join Theatre Spotlight"}
              </Button>
            </form>

            {/* Social Proof */}
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-gray-600 mb-4">
                Trusted by theatre professionals, critics, and enthusiasts worldwide
              </p>
              <div className="flex justify-center items-center space-x-8 text-xs text-gray-500">
                <div>10,000+ Subscribers</div>
                <div>•</div>
                <div>98% Open Rate</div>
                <div>•</div>
                <div>5-Star Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Content Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-theatre-dark text-center mb-8">
            What Our Subscribers Read This Week
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-theatre-accent">
              <CardContent className="p-6">
                <h3 className="font-semibold text-theatre-dark mb-2">
                  Exclusive: Patti LuPone on Her Next West End Return
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  The Broadway legend reveals her plans for a surprise London appearance in our exclusive interview...
                </p>
                <span className="text-xs text-theatre-secondary font-medium">PREMIUM INTERVIEW</span>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-theatre-primary">
              <CardContent className="p-6">
                <h3 className="font-semibold text-theatre-dark mb-2">
                  Breaking: Hamilton Announces Extended UK Tour
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Lin-Manuel Miranda's hit musical adds 12 new cities to its British tour, with tickets available...
                </p>
                <span className="text-xs text-theatre-accent font-medium">BREAKING NEWS</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}