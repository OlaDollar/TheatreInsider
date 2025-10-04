import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeToNewsletter = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been successfully subscribed to our newsletter.",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeToNewsletter.mutate(email);
    }
  };

  return (
    <div className="bg-theatre-primary text-white p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
        Stay in the Spotlight
      </h3>
      <p className="text-gray-200 mb-4 text-sm">
        Get exclusive theatre news, reviews, and insider access delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full text-gray-900"
          required
        />
        <Button
          type="submit"
          className="w-full bg-theatre-secondary text-theatre-dark hover:bg-yellow-500"
          disabled={subscribeToNewsletter.isPending}
        >
          {subscribeToNewsletter.isPending ? "Subscribing..." : "Subscribe Free"}
        </Button>
      </form>
      <p className="text-xs text-gray-300 mt-2">Join 50,000+ theatre enthusiasts</p>
    </div>
  );
}
