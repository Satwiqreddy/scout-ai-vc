# VC Intelligence Interface + Live Enrichment

A premium "AI Scout" for Venture Capitalists to discover, profile, and enrich company data using live web scraping and LLMs.

## Features

- **Discovery Directory**: High-performance company table with multi-parameter search and sector filtering.
- **Premium Profile View**: Deep-dive into company data with signals timelines and user notes.
- **AI Live Enrichment**: One-click extraction of summaries, keywords, and derived signals directly from company websites.
- **Sourcing Pipelines**: Manage custom company lists and saved search queries.
- **Technical Excellence**: Built with Next.js 15, Tailwind CSS, Lucide icons, Cheerio for scraping, and Google Gemini for intelligence.

## Setup Instructions

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the root and add your Google AI API Key:
   ```env
   GOOGLE_AI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is provided, the app will gracefully fallback to high-quality mock enrichment for demonstration purposes.*

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

## Architecture

- **Server-side Enrichment**: The `/api/enrich` endpoint handles scraping and AI processing on the server, keeping API keys secure and avoiding CORS issues.
- **Persistence**: Lists and saved searches are designed to persist in `localStorage` for the MVP scope.
- **Design System**: Global CSS tokens with glassmorphism effects and Inter typography.

## Project Structure

- `/app`: Next.js App Router (Pages & API)
- `/components`: Reusable UI components
- `/lib`: Utilities and mock data models
- `globals.css`: Premium theme and design tokens
