# Theatre Spotlight - Complete Project Requirements

## Project Overview
Build a comprehensive theatre website featuring news, reviews, products, daily crosswords, and theatre facts, aiming to become the highest-ranking theatre website within one month.

## Revenue Targets
- £1,000/month in 3 months
- £6,000/month in 6 months  
- £20,000/month in one year

## Core Requirements

### 1. Theatre Coverage (Must Have 100+ Shows)
**West End Coverage (40+ shows minimum):**
- All 10+ major West End theatres
- Lion King (Lyceum), Phantom (Her Majesty's), Wicked (Apollo Victoria)
- Hamilton (Victoria Palace), Chicago (Phoenix), Book of Mormon (Prince of Wales)
- Harry Potter (Palace), Dear England (Gielgud), Moulin Rouge (Piccadilly)
- Matilda (Cambridge), plus 30+ additional West End productions

**Broadway Coverage (30+ shows minimum):**
- All major Broadway and Off-Broadway shows
- Hamilton (Richard Rodgers), Wicked (Gershwin), Chicago (Ambassador)
- Book of Mormon (Eugene O'Neill), Lion King (Minskoff)
- Plus 25+ additional Broadway productions

**UK Regional Coverage (20+ shows minimum):**
- Royal Shakespeare Company (Stratford-upon-Avon)
- National Theatre (London)
- Regional theatres: Edinburgh, Birmingham, Bath, Manchester, etc.
- Romeo & Juliet (RSC), War Horse (National), Les Mis (Edinburgh)
- Plus 17+ additional regional productions

### 2. Crossword System (ShentonAI Brand)
**Quality Requirements:**
- Guardian-quality crosswords using authentic newspaper grid layouts
- 182,000+ theatre vocabulary words with biographical clue patterns
- Daily crosswords with 4 difficulty levels (easy/medium/hard/expert)
- 15x15 grid format matching professional standards
- Family-friendly content with PG rating
- Authentic grid patterns from Guardian, Sun, Express newspapers

**Technical Implementation:**
- Professional constraint satisfaction algorithm
- Authentic black square patterns with rotational symmetry
- Numbered cells with proper across/down clue generation
- Theatre-specific vocabulary database integration

### 3. Content Management System
**AI Content Generation:**
- Mark Shenton writing style with 38+ year career context (1986-present)
- Daily content generation covering all theatre sectors
- Content aggregation from major theatre sources
- Breaking news detection and alerts
- Content approval system for AI-generated articles

**Content Categories:**
- West End news and reviews
- Broadway coverage
- UK regional theatre
- Off-West End and Off-Broadway
- National Theatre and RSC coverage
- Youth theatre and new writing development
- Cabaret and musical theatre concerts

### 4. Database Requirements
**Show Data Structure:**
- Title, venue, region (uk/us), venue_type (west_end/broadway/regional/national)
- Status, popularity score, description, ticket URLs
- Cast information, director, composer details
- Duration, age rating, genre classification
- Image URLs and official website links

**Regional Filtering:**
- UK shows: West End, Regional, National Theatre
- US shows: Broadway, Off-Broadway
- Proper venue type classification for filtering

### 5. Technical Architecture
**Frontend:**
- React 18 with TypeScript
- Tailwind CSS with theatre-themed design (burgundy, gold, charcoal)
- Responsive mobile-first design
- Component-based architecture with shadcn/ui

**Backend:**
- Node.js with Express.js
- PostgreSQL database with Drizzle ORM
- RESTful API design
- Real-time data scraping from theatre sources

**Features Required:**
- Search functionality across all content
- Regional filtering (UK/US/Both)
- Newsletter subscription system
- SEO optimization for search rankings
- Progressive Web App (PWA) capabilities

### 6. Revenue Generation
**Advertising System:**
- Priority advertiser database with contact details
- Cameron Mackintosh, Disney, Ticketmaster, Premier Inn partnerships
- Banner ads, sponsored content, newsletter advertising
- Revenue tracking with monthly email reports

**Affiliate Programs:**
- Ticket booking (official box offices, Ticketmaster, StubHub)
- Hotel partnerships (Premier Inn, Travelodge, booking platforms)
- Merchandise and books affiliate links
- Travel and experience packages

**Subscription Tiers:**
- Theatre Fan (free): Basic content access
- Theatre Insider (£9.99): Video content, exclusive interviews
- Industry Professional (£29.99): Industry database, production pipeline

### 7. Professional Features
**Industry Database:**
- Producer and director contact information
- Casting opportunities and audition notices
- Production pipeline information (IMDb Pro equivalent for theatre)
- Behind-the-scenes video content

**Theatre Jobs Section:**
- Career guides for 5+ major roles (Director, Stage Manager, etc.)
- Salary ranges and progression paths
- Interview questions and industry contacts
- Video content strategy with leading professionals

### 8. Content Partnerships
**Video Content:**
- Behind-the-scenes footage partnerships
- Live interviews with industry professionals
- Exclusive theatre access arrangements
- Educational content for career development

**Publishing Strategy:**
- Kindle book publishing for career guides
- Print-on-demand opportunities
- Professional recruitment guide quality content (15,000+ words per guide)

### 9. Data Sources and Scraping
**Real-time Theatre Data:**
- Official London Theatre, WhatsOnStage monitoring
- Broadway.org, Playbill.com integration
- Individual major venue website scraping
- 40+ venue monitoring across UK and US
- Hourly updates for show announcements and cast changes

**Content Aggregation:**
- RSS feed monitoring from major theatre publications
- Breaking news detection and priority scoring
- Duplicate content prevention
- Content safety and moderation systems

### 10. SEO and Rankings
**Target Goal:** Become highest-ranking theatre website within one month

**SEO Strategy:**
- Comprehensive meta descriptions and title optimization
- Theatre facts database with daily rotation
- Article slug generation and tag extraction
- Search engine optimization for all content types
- Social media integration across all platforms

### 11. User Experience
**Navigation:**
- Intuitive homepage with featured content
- Clear categorization by region and venue type
- Advanced search and filtering capabilities
- Mobile-optimized interface

**Daily Features:**
- Daily crossword puzzle (ShentonAI branded)
- Theatre fact of the day (223+ character facts)
- Breaking news alerts
- Featured article recommendations

## Critical Success Factors
1. **Database must contain 100+ shows minimum** across all major venues
2. **Crossword quality must match Guardian standards** with theatre vocabulary
3. **Real-time data updates** from all major theatre sources
4. **Revenue generation systems** operational from day one
5. **SEO optimization** for rapid search ranking improvement
6. **Professional industry features** to attract paying subscribers

## Technical Debt and Known Issues
- Database persistence problems (shows reverting to 4 instead of 100+)
- Venue type classification missing causing filter failures
- AI content generation method errors
- RSS feed parsing issues with some sources
- Frontend JavaScript runtime errors in components

## Immediate Priorities
1. Fix database persistence to maintain 100+ shows
2. Implement proper venue type classification
3. Resolve frontend component errors
4. Complete comprehensive theatre coverage
5. Launch advertising and affiliate partnerships
6. Deploy SEO optimization strategies

This comprehensive requirements document should provide everything needed to rebuild or continue this project on another platform.