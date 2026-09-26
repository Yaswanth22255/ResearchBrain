# REST API Documentation

## Projects
- `GET /api/projects`: List all projects
- `POST /api/projects`: Create a project
- `GET /api/projects/:id`: Get project details
- `PUT /api/projects/:id`: Update project
- `DELETE /api/projects/:id`: Delete project

## Search
- `POST /api/search`: Search academic literature
  - **Body**: `{ query, domain, subdomain, yearStart }`
  - **Returns**: Array of normalized `Paper` objects.

## Summarization & Ideation
- `POST /api/summaries`: Generate grounded summary
  - **Body**: `{ query, paperIds }`
  - **Returns**: `{ summary, claims: [{ claim, citationIds }] }`

## Verification
- `POST /api/verification`: Verify claims and citations
  - **Body**: `{ claims: [...] }`
  - **Returns**: Verification results with status (`VERIFIED`, `UNSUPPORTED`) and checks.
