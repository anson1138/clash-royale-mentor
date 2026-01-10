# Clash Royale Mentor

An AI-powered Clash Royale coaching application to help players improve their gameplay through deck analysis, counter guides, replay analysis, and expert tutorials.

## Features

- **Deck Doctor**: AI-powered deck analysis with S-F tier grading and actionable improvements
- **Counter Guide**: Learn how to counter any card with placement diagrams
- **Replay Analyzer**: Analyze battles from the Clash Royale API (local dev only initially)
- **Tutorials**: 20+ lessons on deck building and strategy
- **Pro Tips**: Advanced techniques from top players
- **Admin Sources**: Manage expert content sources with automatic ingestion

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Prisma with SQLite (local) / Postgres (production)
- **Deployment**: Vercel
- **AI/RAG**: OpenAI (or your preferred LLM provider)

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Set up your environment variables in `.env.local`:
   ```
   DATABASE_URL="file:./dev.db"
   CLASH_ROYALE_API_TOKEN="your_token_here"
   CR_API_MODE="local_only"
   OPENAI_API_KEY="your_openai_key_here"
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

### Prerequisites
- A Vercel account
- Vercel Postgres database (create one in your Vercel dashboard)

### Deployment Steps

1. **Connect your repository to Vercel**

2. **Configure Environment Variables** in Vercel Dashboard → Project Settings → Environment Variables:
   ```
   DATABASE_URL="<your_vercel_postgres_connection_string>"
   OPENAI_API_KEY="your_openai_key_here"
   CR_API_MODE="production"
   ```

3. **Important**: The Clash Royale API replay analyzer will not work in production until you set up a static-IP proxy (required for API IP allowlisting)

4. **Build Settings** (automatic with Next.js):
   - Build Command: `npm run build` or `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Deploy**:
   ```bash
   vercel --prod
   ```

### Database Setup for Production

Vercel Postgres is recommended:

1. In your Vercel dashboard, go to **Storage** → **Create Database** → **Postgres**
2. Copy the connection string
3. Add it as `DATABASE_URL` in your environment variables
4. The database schema will be automatically applied via `postinstall` hook

### Switching from SQLite to Postgres

For production deployment, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
}
```

Then run migrations on your Vercel Postgres database.

## Clash Royale API (Local Only)

The Replay Analyzer feature requires:
- A Clash Royale API token from [developer.clashroyale.com](https://developer.clashroyale.com)
- Your IP address allowlisted in the developer portal
- Currently works **local development only**

For production, you'll need to set up a static-IP proxy service (documented in the plan).

## Project Structure

```
/app                    # Next.js App Router pages
  /deck-doctor         # Deck analysis feature
  /counter-guide       # Card counter guide
  /replay-analyzer     # Battle replay analysis
  /tutorials           # Tutorial lessons
  /pro-tips            # Advanced strategies
  /admin/sources       # Content source management
/lib                   # Core business logic
  /rag                 # RAG retrieval & citations
  /deckDoctor          # Deck grading rubric
  /clashApi            # Clash Royale API client
  /ingest              # Content ingestion pipeline
/prisma                # Database schema & migrations
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `CLASH_ROYALE_API_TOKEN` | Your CR API token | For replay analyzer |
| `CR_API_MODE` | `local_only` or `production` | Yes |
| `OPENAI_API_KEY` | OpenAI API key for RAG | For AI features |

## License

MIT