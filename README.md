# Clash Royale Mentor

An AI-powered Clash Royale coaching application to help players improve their gameplay through deck analysis, counter guides, replay analysis, and expert tutorials.

## Features

- **Deck Doctor**: AI-powered deck analysis with S-F tier grading and actionable improvements
- **Counter Guide**: Learn how to counter any card with placement diagrams
- **Replay Analyzer**: Analyze battles from the Clash Royale API
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
   CLASH_ROYALE_API_TOKEN="your_token_here"
   OPENAI_API_KEY="your_openai_key_here"
   ```


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

## Clash Royale API Setup

The Replay Analyzer feature uses the **RoyaleAPI Proxy** to access the Clash Royale API without requiring a static IP address.

### Setup Instructions

1. **Get an API Token**  
   Visit [developer.clashroyale.com](https://developer.clashroyale.com) and create an API token

2. **Whitelist the RoyaleAPI Proxy IP**  
   When creating/editing your token, add this IP to the allowlist: `45.79.218.79`

3. **Add Token to Environment Variables**  
   ```
   CLASH_ROYALE_API_TOKEN="your_token_here"
   ```

That's it! The app will automatically use the RoyaleAPI proxy (`https://proxy.royaleapi.dev`) which routes requests through the whitelisted IP.

### How It Works

- Instead of calling `https://api.clashroyale.com` directly, the app uses `https://proxy.royaleapi.dev`
- The proxy forwards requests through IP `45.79.218.79` (which you whitelisted)
- This works in both local development and production (including Vercel)
- No static IP or additional proxy setup required!

For more details, see the [RoyaleAPI Proxy Documentation](https://docs.royaleapi.com/proxy.html).

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
| `CLASH_ROYALE_API_TOKEN` | Your CR API token (whitelist 45.79.218.79) | For replay analyzer |
| `OPENAI_API_KEY` | OpenAI API key for RAG | For AI features |

## License

MIT