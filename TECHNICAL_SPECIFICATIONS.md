# Theatre Spotlight - Technical Specifications

## Architecture Overview

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom theatre theme
- **UI Library**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and production
- **Package Manager**: npm

### Backend Stack
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon Database serverless
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Authentication**: Passport.js with OpenID Connect (Replit Auth)
- **Content Scheduling**: node-cron for automated tasks
- **Web Scraping**: Cheerio for HTML parsing, RSS Parser for feeds

### Database Schema

#### Core Tables
```sql
-- Users table (required for Replit Auth)
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table (required for Replit Auth)
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Shows table (main theatre database)
CREATE TABLE shows (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  venue VARCHAR NOT NULL,
  region VARCHAR NOT NULL CHECK (region IN ('uk', 'us')),
  venue_type VARCHAR CHECK (venue_type IN ('west_end', 'broadway', 'regional', 'national', 'off_west_end', 'off_broadway')),
  status VARCHAR DEFAULT 'running',
  popularity INTEGER DEFAULT 0,
  description TEXT,
  ticket_url VARCHAR,
  official_website VARCHAR,
  image_url VARCHAR,
  director VARCHAR,
  composer VARCHAR,
  cast TEXT[], -- JSON array of cast members
  genre VARCHAR,
  duration VARCHAR,
  age_rating VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author VARCHAR NOT NULL,
  category VARCHAR CHECK (category IN ('news', 'review', 'announcement')),
  region VARCHAR CHECK (region IN ('uk', 'us', 'both')),
  slug VARCHAR UNIQUE,
  meta_description TEXT,
  tags TEXT[],
  image_url VARCHAR,
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  show_title VARCHAR NOT NULL,
  venue VARCHAR NOT NULL,
  reviewer VARCHAR NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_date DATE DEFAULT CURRENT_DATE,
  region VARCHAR CHECK (region IN ('uk', 'us')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Endpoints

#### Theatre Data
- `GET /api/whats-on` - List all shows with filtering
  - Query params: region, venue_type, search, genres, price_range
- `GET /api/whats-on/options` - Filter options (genres, venues, etc.)
- `GET /api/shows/trending` - Popular shows by region
- `GET /api/shows/:id` - Individual show details

#### Content Management
- `GET /api/articles` - List articles with pagination
  - Query params: category, region, search, featured, premium
- `GET /api/articles/:id` - Individual article
- `GET /api/reviews` - List reviews with filtering
- `GET /api/reviews/:id` - Individual review

#### Daily Features
- `GET /api/crossword` - Daily crossword puzzle
  - Query params: difficulty (easy/medium/hard/expert)
- `GET /api/theatre-facts` - Daily theatre fact
- `GET /api/newsletter/subscribe` - Newsletter subscription

#### Search and Discovery
- `GET /api/search` - Global search across content
- `GET /api/sitemap` - SEO sitemap generation

### Crossword System Technical Details

#### Grid Generation
- **Grid Size**: 15x15 standard crossword format
- **Pattern Source**: Authentic layouts from Guardian, Sun, Express
- **Symmetry**: Rotational symmetry required
- **Black Squares**: Strategic placement for word intersections

#### Vocabulary Database
- **Size**: 182,000+ theatre-specific terms
- **Categories**: Shows, composers, venues, actors, terminology
- **Clue Types**: Biographical, cryptic, straightforward
- **Difficulty Scaling**: Easy (3-6 letters), Medium (4-8), Hard (5-10), Expert (6-12)

#### Algorithm
```typescript
interface CrosswordGrid {
  id: string;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  grid: string[][]; // 15x15 array
  blackSquares: [number, number][];
  numberedCells: GridCell[];
  clues: {
    across: Clue[];
    down: Clue[];
  };
}

interface GridCell {
  row: number;
  col: number;
  number: number;
  letter?: string;
}

interface Clue {
  number: number;
  clue: string;
  answer: string;
  length: number;
}
```

### Content Aggregation System

#### Data Sources
```typescript
interface NewsSource {
  url: string;
  name: string;
  type: 'rss' | 'scraping';
  region: 'uk' | 'us' | 'both';
  updateFrequency: number; // minutes
}

const THEATRE_SOURCES = [
  { url: 'https://www.whatsonstage.com/rss/news', name: 'WhatsOnStage', type: 'rss', region: 'uk' },
  { url: 'https://www.playbill.com/rss', name: 'Playbill', type: 'rss', region: 'us' },
  { url: 'https://www.broadwayworld.com/rss', name: 'BroadwayWorld', type: 'rss', region: 'both' },
  { url: 'https://www.thestage.co.uk/feed', name: 'The Stage', type: 'rss', region: 'uk' }
];
```

#### Scheduling System
- **Daily Generation**: 6:00 AM GMT
- **Breaking News**: Every 30 minutes (9 AM - 6 PM GMT)
- **Intensive Aggregation**: Every 5 minutes for first 5 hours after deployment
- **Content Moderation**: AI safety checks before publication

### Revenue Generation Systems

#### Advertising Management
```typescript
interface AdCampaign {
  id: string;
  advertiserId: string;
  type: 'banner' | 'sponsored_content' | 'newsletter' | 'native';
  placement: string[];
  budget: number;
  startDate: Date;
  endDate: Date;
  targetMetrics: {
    impressions: number;
    clicks: number;
    ctr: number;
  };
}
```

#### Affiliate Integration
- **Ticket Platforms**: Official box offices, Ticketmaster, StubHub
- **Hotels**: Premier Inn, Travelodge, Booking.com
- **Commission Tracking**: Click tracking with revenue attribution
- **Link Generation**: Automatic affiliate URL insertion

### SEO Optimization

#### Meta Data Generation
```typescript
interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
  canonicalUrl: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
  };
}
```

#### Content Enhancement
- Automatic slug generation from titles
- Meta description extraction (150-160 characters)
- Tag extraction for content categorization
- Sitemap generation for search engines

### Performance Requirements

#### Response Times
- API endpoints: < 200ms average
- Crossword generation: < 3 seconds
- Search queries: < 500ms
- Page loads: < 2 seconds

#### Scalability
- Database connection pooling
- CDN integration for static assets
- Caching strategy for frequently accessed data
- Progressive Web App for offline functionality

### Security Considerations

#### Content Safety
- AI content moderation before publication
- Plagiarism detection for generated content
- Input sanitization for user-generated content
- Rate limiting on API endpoints

#### Data Protection
- GDPR compliance for EU users
- Secure session management
- Environment variable protection for secrets
- Content advisory system for age-appropriate material

### Deployment Architecture

#### Environment Configuration
- **Development**: tsx with hot reload
- **Production**: Compiled JavaScript
- **Database**: Neon Database serverless PostgreSQL
- **Hosting**: Replit with custom domain support

#### CI/CD Pipeline
- Automatic deployment on code changes
- Database migrations via Drizzle Kit
- Environment-specific configuration
- Health checks and monitoring

This technical specification provides the complete implementation details needed to rebuild or continue the Theatre Spotlight project.