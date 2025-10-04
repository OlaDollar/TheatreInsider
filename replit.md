# Theatre Spotlight - Modern Web Application

## Overview
Theatre Spotlight is a full-stack web application providing theatre enthusiasts with news, professional reviews, and exclusive content for West End and Broadway productions. It aims to be a comprehensive platform for theatre information and engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

Editorial Guidelines:
- Site aggregates external theatre content and creates AI-generated "observations" rather than republishing existing articles
- If show was reviewed by Mark Shenton personally = star rating allowed
- If AI-generated content = "observation on" format without star ratings, branded as "ShentonAI"
- No external authors' content should appear on site - only original analysis and observations
- Clear distinction between professional reviews (Mark Shenton) and AI observations (ShentonAI)
- Images from Shentonstage.com can be reused with permission

Daily Features Preferences:
- Theatre facts should appear as widget on homepage after lead content, not separate page
- Crossword should be full interactive page with show name highlighting and ticket CTAs
- Crossword answers should save for 30 days for logged-in users, 1 day for anonymous users
- Show names in crossword should be highlighted green when completed
- Completed show names should link to ticket booking with prominent CTA
- Crossword grid must be mobile-first design with proper black squares, aligned numbers, and touch-friendly navigation
- Mobile users should have spacebar/arrow key controls for direction changes since Tab key unavailable

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom theatre-themed design system (burgundy, gold, charcoal)
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Design**: Responsive, mobile-first approach.

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful API design
- **Build**: esbuild

### Automated Theatre Data Collection
- **Theatre Cast Scraper**: Daily cast tracking for 10+ major West End shows
- **Venue Show Scraper**: Comprehensive venue and show schedule updates
- **Daily Theatre Scraper**: Orchestrates full scraping operations with change detection
- **Environment Controls**: Scrapers disabled in development, enabled for live/UAT only
- **Manual Triggers**: Available for testing and immediate updates when needed

### Database
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Storage**: DatabaseStorage class implementing IStorage interface
- **Schema**: Type-safe schema definitions with automated migrations
- **Data Models**: Users, Articles, Reviews, Shows, Newsletter.
- **Features**: Automatic slug generation, meta descriptions, tag extraction, view tracking, content performance monitoring, automatic sample data seeding.

### Key Features
- **AI Content Generation**: GPT-4o powered content generation in Mark Shenton's style, including comprehensive coverage (West End, Broadway, etc.), automated publishing, content moderation, manual submission, and content rewriting.
- **Content Aggregation**: RSS feed monitoring from major theatre sources.
- **Real-time Data Scraper**: Monitors major UK and US venues hourly for current/upcoming shows, cast changes, and updates.
- **Crossword Engine**: Authentic newspaper-quality crossword generation using a template-based generator with theatre vocabulary.
- **SEO**: Optimized URLs, meta descriptions, tag extraction, and consistent styling.
- **User Engagement**: Newsletter subscription, search functionality, regional filtering, topic following system with alerts.
- **Business Features**: Premium subscription system (Theatre Fan, Theatre Insider, Industry Professional), theatre jobs section, industry professional database, video content strategy, affiliate marketing, advertising system, revenue tracking.
- **Compliance**: GDPR/CCPA-compliant Cookie Consent System, Netflix-style content warning overlay.

## External Dependencies

### Core
- React ecosystem (React, React DOM)
- Radix UI
- TanStack Query
- Wouter
- Tailwind CSS
- Drizzle ORM

### Development
- Vite
- TypeScript
- ESBuild
- PostCSS, Autoprefixer

### Database
- Neon Database serverless PostgreSQL
- PostgreSQL
- Drizzle Kit

### Integrations
- OpenAI (GPT-4o) for AI content generation
- RSS feeds from major theatre sources
- Affiliate booking integrations (tickets, books, hotels, streaming)
- Social media platforms (Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube) for automated posting.