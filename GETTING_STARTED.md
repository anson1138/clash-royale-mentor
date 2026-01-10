# Clash Royale Mentor - Getting Started Guide

Congratulations! The Clash Royale Mentor MVP has been successfully built. This guide will help you set it up and start using it.

## 🎉 What's Been Built

All planned features have been implemented:

1. ✅ **Deck Doctor** - AI-powered deck grading (S-F tier) with expert recommendations
2. ✅ **Counter Guide** - Card counters with arena placement diagrams
3. ✅ **Replay Analyzer** - Battle log analysis with pattern detection (local dev)
4. ✅ **Tutorials** - 20+ lessons from your seed file
5. ✅ **Admin Sources** - URL ingestion for YouTube/articles with RAG
6. ✅ **RAG System** - Retrieval with citations from expert sources

## 🚀 Quick Start (Local Development)

### 1. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Clash Royale API (get token from developer.clashroyale.com)
CLASH_ROYALE_API_TOKEN="your_token_here"
CR_API_MODE="local_only"

# OpenAI (for embeddings and RAG)
OPENAI_API_KEY="your_openai_key_here"
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Start the Development Server

The migrations are already run, so just start the server:

```bash
npm run dev
```

The app will be available at http://localhost:3000 (or 3001 if 3000 is in use).

### 4. Ingest the Seed Content

1. Open http://localhost:3000/admin/sources
2. Click **"Ingest Seed Tutorials"**
3. Wait for it to complete (this creates embeddings for all 20 tutorials)

Now your knowledge base is populated and the RAG system is ready!

## 🎮 Using the Features

### Deck Doctor
1. Go to http://localhost:3000/deck-doctor
2. Enter 8 card names (e.g., "Hog Rider", "Zap", "Musketeer", etc.)
3. Click "Analyze Deck"
4. Get your grade (S-F), issues, strengths, and expert advice

### Counter Guide
1. Go to http://localhost:3000/counter-guide
2. Type a card name (e.g., "Mega Knight", "Hog Rider")
3. See placement diagrams, counter strategies, and pro tips

### Replay Analyzer (Local Only)
1. Get your Clash Royale player tag from in-game (tap your profile)
2. Make sure your token is in `.env.local` and your laptop IP is allowlisted
3. Go to http://localhost:3000/replay-analyzer
4. Enter your player tag (e.g., #ABC123XYZ)
5. View battle patterns and coaching recommendations

### Tutorials
1. Go to http://localhost:3000/tutorials
2. Browse 20+ lessons on deck building
3. Filter by category (basics, synergy, advanced)
4. Click any card to read the full lesson

### Add Expert Sources
1. Go to http://localhost:3000/admin/sources
2. Paste a YouTube URL or article link
3. Add tags (optional)
4. The system will fetch, chunk, embed, and make it searchable

## 📦 Deploying to Vercel

### 1. Set Up Vercel Postgres

1. In your Vercel dashboard: **Storage → Create Database → Postgres**
2. Copy the connection string (starts with `postgres://...`)

### 2. Update Schema for Postgres

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
}
```

### 3. Set Environment Variables in Vercel

In **Project Settings → Environment Variables**, add:

```
DATABASE_URL=<your_vercel_postgres_connection_string>
OPENAI_API_KEY=<your_openai_key>
CR_API_MODE=production
```

### 4. Deploy

```bash
vercel --prod
```

The `postinstall` script will automatically run `prisma generate` and migrations.

### ⚠️ Important: Replay Analyzer in Production

The Replay Analyzer **will not work** in production initially because:
- Clash Royale API requires IP allowlisting
- Vercel serverless functions don't have static IPs

**Solution:** Set up a static-IP proxy:
1. Deploy a tiny proxy on Fly.io/VPS/AWS with a static IP
2. Allowlist that IP in the Clash Royale developer portal
3. Route all CR API calls through your proxy

See the plan document for detailed proxy setup instructions.

## 🧪 Testing the App

### Test Deck Doctor
Try this deck:
- Hog Rider
- Zap
- Musketeer
- Knight
- Ice Spirit
- Cannon
- Fireball
- Skeleton Army

Expected: Grade A or B (good cycle deck)

### Test Counter Guide
Search for: "Hog Rider" or "Mega Knight"
Expected: Counter strategies with placement diagrams

### Test Replay Analyzer
Use your real player tag (make sure API token is set)
Expected: Battle patterns and expert coaching

## 🔧 Expanding the App

### Add More Cards to Deck Doctor
Edit `lib/deckDoctor/cardDatabase.ts` and add cards to the `CARDS` object.

### Add More Counter Strategies
Edit `lib/counterGuide/strategies.ts` and add to `COUNTER_STRATEGIES`.

### Add More Expert Sources
Use the Admin Sources page to add YouTube videos or articles. They'll be automatically:
- Fetched (transcript for YouTube, text for articles)
- Chunked into searchable segments
- Embedded with OpenAI
- Made available to all RAG queries

## 📊 Database Schema

The app uses these main tables:
- `User` / `PlayerProfile` - User accounts and CR profiles
- `Deck` - Saved deck analyses
- `BattleSnapshot` / `MistakePattern` - Replay analysis data
- `Source` / `SourceChunk` - RAG knowledge base
- `CounterPlacement` - Counter guide placements
- `Tutorial` - Lesson content

View the full schema in `prisma/schema.prisma`.

## 🛠 Troubleshooting

### "Unknown cards" error in Deck Doctor
The card database is limited to common cards. Add missing cards to `lib/deckDoctor/cardDatabase.ts`.

### Embeddings not generating
Check that `OPENAI_API_KEY` is set. The app falls back to dummy embeddings (all zeros) if the key is missing, which breaks retrieval.

### Replay Analyzer fails in prod
Expected behavior. See "Replay Analyzer in Production" above.

### No tutorials showing
Run the seed ingestion in Admin Sources first.

## 🎓 Next Steps

1. **Expand the card database** - Add all ~110 cards
2. **Add more counter strategies** - Cover all major cards
3. **Set up the proxy** - Enable Replay Analyzer in production
4. **Add user authentication** - Track progress and saved decks
5. **Improve pattern detection** - Add more sophisticated battle analysis
6. **Build a mobile version** - PWA or React Native

## 📞 Need Help?

Check the main README.md for architecture details, or refer to the plan document for implementation notes.

Happy coaching! 🏆
