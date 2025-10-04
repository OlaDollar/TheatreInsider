import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Play, X } from "lucide-react";

interface ContentAdvisory {
  level: 'none' | 'guidance' | 'warning' | 'restricted';
  categories: string[];
  description: string;
  ageRating: string;
  localeSpecific: {
    [key: string]: {
      rating: string;
      warning: string;
      required: boolean;
    };
  };
}

interface ContentWarningOverlayProps {
  advisory: ContentAdvisory;
  locale: string;
  onProceed: () => void;
  onCancel: () => void;
  contentTitle: string;
  contentType: 'article' | 'review';
}

export function ContentWarningOverlay({ 
  advisory, 
  locale, 
  onProceed, 
  onCancel, 
  contentTitle,
  contentType 
}: ContentWarningOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [canProceed, setCanProceed] = useState(false);

  const localeAdvisory = advisory.localeSpecific[locale] || advisory.localeSpecific.international;

  useEffect(() => {
    if (!localeAdvisory.required) {
      onProceed();
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanProceed(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [localeAdvisory.required, onProceed]);

  if (!isVisible || !localeAdvisory.required) {
    return null;
  }

  const getOverlayTheme = () => {
    switch (advisory.level) {
      case 'restricted':
        return 'bg-red-900/95 border-red-500';
      case 'warning':
        return 'bg-orange-900/95 border-orange-500';
      case 'guidance':
        return 'bg-yellow-900/95 border-yellow-500';
      default:
        return 'bg-gray-900/95 border-gray-500';
    }
  };

  const getIconColor = () => {
    switch (advisory.level) {
      case 'restricted':
        return 'text-red-400';
      case 'warning':
        return 'text-orange-400';
      case 'guidance':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <Card className={`max-w-2xl mx-4 ${getOverlayTheme()} text-white border-2`}>
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`h-8 w-8 ${getIconColor()}`} />
              <div>
                <h2 className="text-2xl font-bold">Content Advisory</h2>
                <p className="text-sm opacity-75">{localeAdvisory.rating}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content Details */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{contentTitle}</h3>
            <p className="text-sm opacity-75 mb-4">
              {contentType === 'article' ? 'Theatre News Article' : 'Theatre Review'}
            </p>
            
            <div className="bg-black/30 rounded-lg p-4 mb-4">
              <p className="text-lg mb-3">{advisory.description}</p>
              {localeAdvisory.warning && (
                <p className="text-sm opacity-90 mb-3">{localeAdvisory.warning}</p>
              )}
              
              {advisory.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {advisory.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Age Rating Notice */}
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <p className="text-sm">
                <strong>Age Rating:</strong> {localeAdvisory.rating}
              </p>
              {advisory.level === 'restricted' && (
                <p className="text-xs mt-1 opacity-75">
                  This content may not be suitable for all audiences. Viewer discretion is advised.
                </p>
              )}
            </div>

            {/* Locale-specific notices */}
            {locale === 'uk' && advisory.categories.includes('Gambling References') && (
              <div className="bg-blue-900/50 rounded-lg p-3 mb-4">
                <p className="text-xs">
                  UK Notice: This content contains gambling references. For gambling support, visit 
                  <a href="https://www.gamcare.org.uk" className="underline ml-1" target="_blank" rel="noopener">
                    GamCare.org.uk
                  </a>
                </p>
              </div>
            )}

            {locale === 'us' && advisory.categories.includes('Mental Health Themes') && (
              <div className="bg-green-900/50 rounded-lg p-3 mb-4">
                <p className="text-xs">
                  US Notice: Mental health support available 24/7 at 
                  <a href="tel:988" className="underline ml-1">988 Suicide & Crisis Lifeline</a>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onProceed}
              disabled={!canProceed}
              className="flex-1 bg-white text-black hover:bg-gray-200 disabled:opacity-50"
            >
              <Play className="h-4 w-4 mr-2" />
              {canProceed ? 'Continue Reading' : `Continue in ${countdown}s`}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-white text-white hover:bg-white/10"
            >
              Go Back
            </Button>
          </div>

          {/* Legal Footer */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-xs opacity-60 text-center">
              Content ratings are automatically generated based on detected themes. 
              For concerns about content classification, contact our editorial team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}