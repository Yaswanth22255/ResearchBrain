# Architecture

## System Overview
The Academic Research Brainstorming System uses a standard MERN stack architecture.

### Frontend
- **React + Vite**: Fast, modern frontend framework.
- **Tailwind CSS v4**: Utility-first styling.
- **Recharts**: Data visualization for timelines.
- **React Router**: Client-side routing.

### Backend
- **Node.js + Express**: REST API server.
- **MongoDB + Mongoose**: Document storage for Papers, Projects, and Ideas.
- **Axios**: HTTP client for external API integrations.
- **Google GenAI SDK**: Integrates with Gemini for LLM functionality.

## Core Modules
1. **Academic Sources Integration**: Interfaces with OpenAlex API to search and retrieve paper metadata.
2. **Hybrid Retrieval**: Combines keyword filtering and semantic search to rank papers.
3. **RAG Pipeline**: Retrieves selected papers and injects their context into an LLM prompt to generate grounded summaries.
4. **Verification Engine**: A neuro-symbolic engine that applies explicit rules (symbolic) alongside LLM validation (neuro) to verify citations.
