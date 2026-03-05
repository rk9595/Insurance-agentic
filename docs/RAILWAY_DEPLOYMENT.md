# Railway Deployment Guide (OpenAI + MongoDB Atlas)

This guide provides an end-to-end deployment path for this repository on Railway.

## 1) Prerequisites

- Railway account and project access.
- OpenAI API key with access to your chosen models.
- MongoDB Atlas cluster and a database named `insurance_claims`.

## 2) MongoDB setup

Create these collections:

- `policy_documents`
- `processed_claims`
- `chat_history`

### Vector index setup (important)

The vector index dimension **must** match your embedding model.

- `text-embedding-3-small` -> `numDimensions: 1536`
- `text-embedding-3-large` -> `numDimensions: 3072`

Create the Atlas Vector Search index on `policy_documents`:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "descriptionEmbedding",
      "numDimensions": 3072,
      "similarity": "cosine"
    }
  ]
}
```

> If you use `text-embedding-3-small`, change `numDimensions` to `1536`.

Also ensure `policy_documents` actually contains documents with:

- `description`
- `descriptionEmbedding` (same dimensionality as index)

## 3) Railway project/services

Create **two services** from this repo:

- `insurance-agentic-backend` using `Dockerfile.backend`
- `insurance-agentic-frontend` using `Dockerfile.frontend`

Both containers expose port `8080`.

## 4) Backend environment variables (Railway)

Set these on the backend service:

```dotenv
OPENAI_API_KEY=<your-openai-key>
LLM_MODEL=gpt-4o-mini
VISION_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-large

MONGODB_URI=<your-mongodb-uri>
DATABASE_NAME=insurance_claims
COLLECTION_NAME=policy_documents
COLLECTION_NAME_2=processed_claims
CHAT_HISTORY_COLLECTION=chat_history
PORT=8080
```

## 5) Frontend environment variables (Railway)

Use the backend public URL from Railway, e.g. `https://backend-production-xxxx.up.railway.app`.

Set these on the frontend service:

```dotenv
NEXT_PUBLIC_IMAGE_DESCRIPTOR_API_URL=https://<backend-domain>/imageDescriptor
NEXT_PUBLIC_RUN_AGENT_API_URL=https://<backend-domain>/runAgent

# Optional fallbacks
NEXT_PUBLIC_API_BASE=https://<backend-domain>
PORT=8080
```

## 6) Deploy

- Trigger deployment on both services.
- Verify backend logs show successful startup.
- Open backend `/docs` endpoint and frontend root URL.

## 7) Post-deploy smoke test

1. Open frontend URL.
2. Upload an image and run image description.
3. Run agent workflow.
4. Confirm a document is created in `processed_claims`.

## 8) Common issues and fixes

- **Error: vector dimensions mismatch**
  - Align Atlas index `numDimensions` with `EMBEDDING_MODEL`.
- **Error: OpenAI auth/model access**
  - Validate `OPENAI_API_KEY` and model names.
- **Agent returns no guideline context**
  - Ensure `policy_documents` contains embedded records.
- **Frontend cannot reach backend**
  - Recheck `NEXT_PUBLIC_IMAGE_DESCRIPTOR_API_URL` and `NEXT_PUBLIC_RUN_AGENT_API_URL`.

## 9) What you still need to do manually

- Maintain OpenAI usage/billing limits.
- Keep Atlas network access and DB user permissions secure.
- Seed/update your `policy_documents` collection as your policy corpus evolves.
