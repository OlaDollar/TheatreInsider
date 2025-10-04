import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  schema?: object;
}

export function PageMeta({ 
  title, 
  description, 
  keywords = [], 
  canonicalUrl,
  ogImage,
  schema 
}: PageMetaProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Update keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }
    
    // Update Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    };
    
    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    updateOgTag('og:type', 'website');
    
    if (ogImage) {
      updateOgTag('og:image', ogImage);
    }
    
    if (canonicalUrl) {
      updateOgTag('og:url', canonicalUrl);
      
      // Update canonical link
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }
    
    // Add structured data
    if (schema) {
      let schemaScript = document.querySelector('#schema-org');
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('id', 'schema-org');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }
    
  }, [title, description, keywords, canonicalUrl, ogImage, schema]);
  
  return null;
}

// Pre-built schema generators for common page types
export const generateEventSchema = (show: any) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": show.title,
  "description": show.description,
  "location": {
    "@type": "Place",
    "name": show.venue,
    "address": show.region === 'uk' ? 'London, UK' : 'New York, US'
  },
  "offers": {
    "@type": "Offer",
    "availability": show.ticketAvailability === 'available' ? 'InStock' : 'OutOfStock',
    "url": show.ticketUrl
  }
});

export const generateArticleSchema = (article: any) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "datePublished": article.publishedAt,
  "publisher": {
    "@type": "Organization",
    "name": "Theatre Spotlight"
  }
});