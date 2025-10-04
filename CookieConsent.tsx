import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Cookie, Settings, Shield, BarChart3, Target, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CookieChoice {
  id: string;
  label: string;
  description: string;
  impact: string;
}

interface CookieCategory {
  name: string;
  description: string;
  required: boolean;
  impact: string;
}

interface CookiePolicy {
  locale: string;
  title: string;
  description: string;
  categories: {
    essential: CookieCategory;
    analytics: CookieCategory;
    marketing: CookieCategory;
    preferences: CookieCategory;
  };
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [policy, setPolicy] = useState<CookiePolicy | null>(null);
  const [choices, setChoices] = useState<any>(null);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const existingConsent = localStorage.getItem('cookie-consent');
    if (!existingConsent) {
      loadPolicyAndShow();
    }
  }, []);

  const loadPolicyAndShow = async () => {
    try {
      // Detect user locale (simplified)
      const locale = navigator.language.startsWith('en-GB') ? 'uk' :
                   navigator.language.startsWith('en-US') ? 'us' : 'international';
      
      const response = await apiRequest(`/api/cookies/choices/${locale}`);
      setChoices(response);
      setPolicy(response.policy);
      setIsVisible(true);
    } catch (error) {
      console.error('Failed to load cookie policy:', error);
      // Show basic consent even if API fails
      setIsVisible(true);
    }
  };

  const handleAcceptAll = async () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    await saveConsent(consent);
  };

  const handleEssentialOnly = async () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    await saveConsent(consent);
  };

  const handleCustomSave = async () => {
    await saveConsent(preferences);
  };

  const saveConsent = async (consent: any) => {
    setIsLoading(true);
    try {
      const locale = navigator.language.startsWith('en-GB') ? 'uk' :
                   navigator.language.startsWith('en-US') ? 'us' : 'international';
      
      await apiRequest("/api/cookies/consent", {
        method: "POST",
        body: {
          ...consent,
          locale,
          sessionId: generateSessionId()
        }
      });

      // Store consent locally
      localStorage.setItem('cookie-consent', JSON.stringify({
        ...consent,
        timestamp: new Date().toISOString()
      }));

      setIsVisible(false);
    } catch (error) {
      console.error('Failed to save consent:', error);
      // Still hide banner even if save fails
      localStorage.setItem('cookie-consent', JSON.stringify({
        ...consent,
        timestamp: new Date().toISOString()
      }));
      setIsVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSessionId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/50 to-transparent">
      <Card className="mx-auto max-w-4xl bg-white/95 backdrop-blur-sm border-2 border-yellow-400">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-lg">
              {policy?.title || "Cookie Preferences"}
            </CardTitle>
          </div>
          <CardDescription className="text-sm">
            {policy?.description || "We use cookies to improve your browsing experience and provide personalized theatre content."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showDetails ? (
            // Simple Choice View
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAcceptAll}
                disabled={isLoading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                Accept All Cookies
              </Button>
              <Button
                onClick={handleEssentialOnly}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                Essential Only
              </Button>
              <Button
                onClick={() => setShowDetails(true)}
                disabled={isLoading}
                variant="ghost"
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          ) : (
            // Detailed Settings View
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <Label className="font-medium">Essential Cookies</Label>
                  </div>
                  <Switch checked={true} disabled />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Required for site security and basic functionality. Cannot be disabled.
                </p>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <Label className="font-medium">Analytics Cookies</Label>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, analytics: checked }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Help us improve site performance and understand popular content.
                  <br />
                  <span className="text-red-600">Without these:</span> We can't optimize site speed or fix issues.
                </p>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <Label className="font-medium">Marketing Cookies</Label>
                  </div>
                  <Switch
                    checked={preferences.marketing}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Show relevant theatre ads and track campaign effectiveness.
                  <br />
                  <span className="text-red-600">Without these:</span> You'll see generic ads instead of theatre content.
                </p>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-600" />
                    <Label className="font-medium">Preference Cookies</Label>
                  </div>
                  <Switch
                    checked={preferences.preferences}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, preferences: checked }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Remember your region (UK/US) and content preferences.
                  <br />
                  <span className="text-red-600">Without these:</span> Settings reset each visit, less personalized experience.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleCustomSave}
                  disabled={isLoading}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={() => setShowDetails(false)}
                  disabled={isLoading}
                  variant="outline"
                >
                  Back
                </Button>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground border-t pt-2">
            <p>
              We respect your privacy. You can change these settings anytime in your account preferences.
              {policy?.legalInfo?.contact && (
                <> Contact us at {policy.legalInfo.contact} for questions.</>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}