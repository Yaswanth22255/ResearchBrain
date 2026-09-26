# AI-Powered Academic Research Brainstorming System

A fully functional MERN prototype that helps researchers quickly discover, understand, explore, and generate research ideas from relevant academic literature.

## Core Workflow
Discover → Understand → Explore → Ideate → Verify

## Features
- **Domain Profiler**: Target searches using OpenAlex.
- **Hybrid Retrieval**: Combine keyword and semantic searches.
- **Literature Explorer**: View thematic clusters and timeline distributions.
- **Grounded Ideation**: RAG-based LLM generation of summaries and research gaps.
- **Neuro-Symbolic Verification**: Verify that every LLM claim is backed by real literature citations.
- **Grounded Drafting**: Generate final proposal drafts with compliance checks.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini (via `@google/genai`)

## Setup Instructions

1. **Clone the repository**
2. **Start Backend**:
   \`\`\`bash
   cd server
   npm install
   # Configure .env with MONGODB_URI and LLM_API_KEY
   npm run dev
   \`\`\`
3. **Start Frontend**:
   \`\`\`bash
   cd client
   npm install
   npm run dev
   \`\`\`

## Architecture & Documentation
See the `docs/` folder for detailed documentation:
- [Architecture](docs/architecture.md)
- [API Endpoints](docs/api.md)
- [Verification Engine](docs/verification.md)
