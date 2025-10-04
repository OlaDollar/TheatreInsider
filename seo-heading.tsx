import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// SEO-optimized heading component with consistent structure
export interface SEOHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  intent?: 'page' | 'section' | 'subsection' | 'card' | 'navigation';
  location?: 'uk' | 'us' | 'both';
  keywords?: string[];
  children: React.ReactNode;
}

const SEOHeading = forwardRef<HTMLHeadingElement, SEOHeadingProps>(
  ({ className, level, intent = 'section', location, keywords, children, ...props }, ref) => {
    
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    
    // SEO-optimized styling based on level and intent
    const getHeadingStyle = () => {
      const baseClasses = "font-bold text-gray-900 dark:text-gray-100";
      
      switch (level) {
        case 1:
          return cn(baseClasses, "text-3xl md:text-4xl lg:text-5xl leading-tight");
        case 2:
          return cn(baseClasses, "text-2xl md:text-3xl lg:text-4xl leading-tight");
        case 3:
          return cn(baseClasses, "text-xl md:text-2xl lg:text-3xl leading-tight");
        case 4:
          return cn(baseClasses, "text-lg md:text-xl lg:text-2xl leading-tight");
        case 5:
          return cn(baseClasses, "text-base md:text-lg lg:text-xl leading-tight");
        case 6:
          return cn(baseClasses, "text-sm md:text-base lg:text-lg leading-tight");
        default:
          return baseClasses;
      }
    };

    // Add location context for SEO if applicable
    const enhancedContent = () => {
      if (typeof children === 'string' && location && level <= 2) {
        const locationText = location === 'uk' ? ' | UK Theatre' : 
                           location === 'us' ? ' | US Theatre' : 
                           ' | UK & US Theatre';
        return children + locationText;
      }
      return children;
    };

    // SEO attributes
    const seoAttributes = {
      ...props,
      itemProp: level === 1 ? 'headline' : undefined,
    };

    return (
      <HeadingTag
        className={cn(getHeadingStyle(), className)}
        ref={ref}
        {...seoAttributes}
      >
        {enhancedContent()}
      </HeadingTag>
    );
  }
);

SEOHeading.displayName = "SEOHeading";

export { SEOHeading };