import { forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// SEO-optimized button variants with consistent styling and wording
export interface SEOButtonProps extends ButtonProps {
  intent?: 'ticket' | 'trip' | 'read' | 'subscribe' | 'search' | 'filter' | 'navigation' | 'action';
  availability?: 'available' | 'limited' | 'sold_out' | 'coming_soon';
  location?: 'uk' | 'us' | 'both';
  showTitle?: string;
}

const SEOButton = forwardRef<HTMLButtonElement, SEOButtonProps>(
  ({ className, intent = 'action', availability = 'available', location, showTitle, children, ...props }, ref) => {
    
    // SEO-optimized button text based on intent and context
    const getButtonText = () => {
      if (children) return children;
      
      switch (intent) {
        case 'ticket':
          if (availability === 'sold_out') return 'Sold Out';
          if (availability === 'limited') return 'Book Now - Limited Availability';
          if (availability === 'coming_soon') return 'Notify When Available';
          return showTitle ? `Book ${showTitle} Tickets` : 'Book Theatre Tickets';
          
        case 'trip':
          const locationText = location === 'uk' ? 'London' : location === 'us' ? 'New York' : '';
          return showTitle 
            ? `Plan ${showTitle} Trip ${locationText ? `to ${locationText}` : ''}`
            : `Plan Your Theatre Trip ${locationText ? `to ${locationText}` : ''}`;
            
        case 'read':
          return 'Read Full Article';
          
        case 'subscribe':
          return 'Get Theatre Updates';
          
        case 'search':
          return 'Search Theatre Shows';
          
        case 'filter':
          return 'Filter Results';
          
        case 'navigation':
          return 'View All Shows';
          
        default:
          return 'Continue';
      }
    };

    // Consistent styling based on intent and availability
    const getButtonStyle = () => {
      const baseClasses = "font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2";
      
      switch (intent) {
        case 'ticket':
          if (availability === 'sold_out') {
            return cn(baseClasses, "bg-gray-400 text-gray-700 cursor-not-allowed hover:bg-gray-400");
          }
          if (availability === 'limited') {
            return cn(baseClasses, "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500");
          }
          return cn(baseClasses, "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500");
          
        case 'trip':
          return cn(baseClasses, "border border-purple-300 text-purple-700 hover:bg-purple-50 focus:ring-purple-500");
          
        case 'read':
          return cn(baseClasses, "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500");
          
        case 'subscribe':
          return cn(baseClasses, "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500");
          
        case 'search':
          return cn(baseClasses, "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500");
          
        case 'filter':
          return cn(baseClasses, "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500");
          
        case 'navigation':
          return cn(baseClasses, "text-purple-600 hover:text-purple-700 underline focus:ring-purple-500");
          
        default:
          return cn(baseClasses, "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500");
      }
    };

    // SEO attributes
    const seoAttributes = {
      'aria-label': getButtonText(),
      title: intent === 'ticket' && showTitle ? `Book tickets for ${showTitle}` : undefined,
      ...props
    };

    return (
      <Button
        className={cn(getButtonStyle(), className)}
        ref={ref}
        disabled={availability === 'sold_out' || props.disabled}
        {...seoAttributes}
      >
        {getButtonText()}
      </Button>
    );
  }
);

SEOButton.displayName = "SEOButton";

export { SEOButton };