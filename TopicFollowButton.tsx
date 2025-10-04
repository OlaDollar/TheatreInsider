import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellRing } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface TopicFollowButtonProps {
  topic: string;
  topicType: 'show' | 'performer' | 'venue' | 'category' | 'keyword';
  className?: string;
}

export function TopicFollowButton({ topic, topicType, className }: TopicFollowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("immediate");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to follow this topic.",
        variant: "destructive",
      });
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await apiRequest("/api/topic-alerts/subscribe", {
        method: "POST",
        body: {
          email,
          topic,
          topicType,
          frequency
        }
      });

      if (response.success) {
        setIsFollowing(true);
        setIsOpen(false);
        toast({
          title: "Successfully Following",
          description: `You'll receive ${frequency} alerts about ${topic}`,
        });
      } else {
        toast({
          title: "Subscription Failed",
          description: response.message || "Failed to subscribe to topic alerts",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe to topic alerts",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const getTopicDescription = () => {
    switch (topicType) {
      case 'show':
        return `Get alerts whenever we publish new articles or reviews about "${topic}"`;
      case 'performer':
        return `Get alerts about news, interviews, and career updates for "${topic}"`;
      case 'venue':
        return `Get alerts about shows and events at "${topic}"`;
      case 'category':
        return `Get alerts about all content in the "${topic}" category`;
      case 'keyword':
        return `Get alerts whenever "${topic}" is mentioned in our articles`;
      default:
        return `Get alerts about "${topic}"`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isFollowing ? "default" : "outline"}
          size="sm"
          className={className}
        >
          {isFollowing ? (
            <>
              <BellRing className="h-4 w-4 mr-2" />
              Following
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Follow Topic
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Follow "{topic}"</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {getTopicDescription()}
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Alert Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (as published)</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="flex-1"
            >
              {isSubscribing ? "Subscribing..." : "Start Following"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            You can unsubscribe at any time. We'll only send alerts about "{topic}".
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}