---

# Insurance Claim Handler AI Agent

## Overview

This project is an intelligent **AI-powered Insurance Claims Assistant** that streamlines the claim handling process through an automated agentic workflow. The system processes accident images uploaded by customers, generates AI-based damage descriptions, and triggers a sophisticated backend agent that retrieves relevant insurance policies using vector search to provide actionable claim recommendations to handlers.

---

## High-Level Architecture

![Insurance Claim Agent Architecture](architecture/Claim_Agent_Architecture.png)  

The application follows a comprehensive agentic workflow that bridges structured and unstructured data:

1. **Customer Input:** Customers upload damage photos through a web interface  
2. **AI Image Analysis:** Advanced AI models analyze and describe accident damage in real-time  
3. **Intelligent Agent Processing:** [LangGraph](https://langchain-ai.github.io/langgraph/)-powered agent processes the description through multiple decision points  
4. **Vector-Based Policy Retrieval:** Agent uses semantic search to find relevant insurance guidelines  
5. **Automated Claim Processing:** Agent creates comprehensive claim summaries with structured recommendations  
6. **Handler Assignment:** System assigns claims to appropriate handlers with complete documentation

---

## Where MongoDB Shines

This project leverages [**MongoDB Atlas Vector Search**](https://www.mongodb.com/products/platform/atlas/vector-search) to efficiently handle the complete insurance workflow, providing fast and relevant retrieval of information. [MongoDB Atlas](https://www.mongodb.com/atlas/database) offers robust and scalable database solutions, making it ideal for handling large volumes of data and complex queries.

### Key MongoDB Capabilities

- **Unified Data Platform**  
  Seamlessly handles both structured claim data (customer info, policy details) and unstructured data (damage photos, policy documents, accident reports) in a single database. No more data silos or complex ETL processes.

- **[Atlas Vector Search](https://www.mongodb.com/products/platform/atlas/vector-search)**  
  Powers semantic similarity search using advanced embeddings to find relevant insurance policies based on accident descriptions, enabling intelligent claim routing and policy recommendations with unprecedented accuracy.

- **Flexible Schema Evolution**  
  Perfect for evolving agentic workflows where claim structures, agent tools, and processing steps continuously adapt to new regulations, products, and customer needs without database migrations.

- **Flexibility—Multi-modal Data Storage**  
  MongoDB provides unmatched flexibility in supporting multi-modal data. It efficiently stores and indexes diverse data types, including structured claim records, document-like policies, unstructured accident images, vector embeddings, and even time-series sensor data. This enables seamless workflows where all your data—optimized for AI/ML processing and real-time analytics—resides in a single, unified platform.

---

## Key Features

- **Guideline Retrieval:** Vector-based search for relevant insurance guidelines based on accident descriptions  
- **Persistent State Management:** Store claim data, chat history, and agent states in MongoDB with full audit trails  
- **Vector-Powered Policy Retrieval:** Semantic search through insurance guidelines using OpenAI embeddings with cosine similarity  
- **Flexible Data Storage:** MongoDB's document structure handles dynamic claim data and evolving workflows

---

## Tech Stack

### Backend Framework

- **[FastAPI](https://fastapi.tiangolo.com/):** Modern, high-performance web framework for building APIs  
- **[Uvicorn](https://www.uvicorn.org/):** ASGI web server for running FastAPI applications  
- **Python 3.10:** Core programming language (>=3.10,<3.11)

### AI/ML Stack

- **[LangChain](https://python.langchain.com/docs/):** Framework for developing applications with language models  
- **[LangGraph](https://langchain-ai.github.io/langgraph/):** Library for building stateful, multi-actor agentic applications  
- **[OpenAI API](https://platform.openai.com/docs/overview):** LLM, vision, and embedding inference provider  
- **GPT-4o mini:** Fast multimodal model for agent orchestration and image understanding  
- **text-embedding-3-large:** Embeddings model for vector search

### Database & Vector Search

- **[MongoDB Atlas](https://www.mongodb.com/atlas/database):** Cloud-native document database with vector search capabilities  
- **[MongoDB Atlas Vector Search](https://www.mongodb.com/products/platform/atlas/vector-search):** Semantic similarity search for policy retrieval  
- **[PyMongo](https://pymongo.readthedocs.io/en/stable/):** Python driver for MongoDB operations  
- **[LangGraph MongoDB Checkpoint](https://langchain-ai.github.io/langgraph/integrations/mongodb_checkpoint/):** Agent state persistence and workflow tracking

### Frontend

- **[Next.js](https://nextjs.org/):** React framework with server-side rendering  
- **[React](https://reactjs.org/):** Frontend JavaScript library  
- **[CSS Modules](https://github.com/css-modules/css-modules):** Scoped component styling

### Containerization & Deployment

- **[Docker](https://www.docker.com/):** Container platform for consistent deployments  
- **[Docker Compose](https://docs.docker.com/compose/):** Multi-container application orchestration  
- **[Poetry](https://python-poetry.org/):** Python dependency management and packaging  
- **[Make](https://www.gnu.org/software/make/):** Build automation and deployment commands

---

## Setup Instructions

### Step 0: Set Up MongoDB Database and Collections

1. Log in to [MongoDB Atlas](https://www.mongodb.com/atlas/database) and create a new database named `insurance_claims`
2. Create the following collections:  
    - `processed_claims` – For storing final claim summaries  
    - `chat_history` – For agent conversation persistence  
    - `policy_documents` – For insurance guidelines and policies (with vector embeddings)
3. **Set up MongoDB Vector Search Index for the `policy_documents` collection:**

> `numDimensions` must match your selected embedding model:
> - `text-embedding-3-small` -> `1536`
> - `text-embedding-3-large` -> `3072` (default in this repo)

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

---

### Step 1: Configure AI Provider (OpenAI)

- Create an [OpenAI API key](https://platform.openai.com/api-keys)  
- Add `OPENAI_API_KEY` to your environment variables  
- Optionally configure model overrides:
    - `LLM_MODEL` (default: `gpt-4o-mini`)  
    - `VISION_MODEL` (default: `gpt-4o-mini`)  
    - `EMBEDDING_MODEL` (default: `text-embedding-3-large`)  

---

## Run with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your machine  
- [`make`](https://www.gnu.org/software/make/) installed (`sudo apt install make` on Ubuntu or `brew install make` on macOS)

### Docker Setup Instructions

Clone the repository:

```sh
git clone <repo-url>
cd insurance-claim-agent
```

#### Configure Environment Variables

Create a `.env` file in the root directory:

```dotenv
# OpenAI Configuration
OPENAI_API_KEY=""
LLM_MODEL=gpt-4o-mini
VISION_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-large

# MongoDB Configuration
MONGODB_URI=""
DATABASE_NAME=insurance_claims
COLLECTION_NAME=policy_documents
COLLECTION_NAME_2=processed_claims
CHAT_HISTORY_COLLECTION=chat_history

# Frontend Configuration
NEXT_PUBLIC_IMAGE_DESCRIPTOR_API_URL=http://localhost:8000/imageDescriptor
NEXT_PUBLIC_RUN_AGENT_API_URL=http://localhost:8000/runAgent
```

#### Build the Application

```sh
make build
```

#### Access the Application

- Frontend UI: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Deploy to Railway

Yes — you can host both the frontend and backend on [Railway](https://railway.app/) with no AWS dependency in this setup.

> **Important:** this project now uses OpenAI models for chat, vision, and embeddings.

### Recommended Railway Setup (2 services)

Create two Railway services from the same repo:

1. **Backend service**
   - Deploy from `Dockerfile.backend`
   - Expose port `8080`
   - Add environment variables:
     - `OPENAI_API_KEY`
     - `LLM_MODEL` (optional, default `gpt-4o-mini`)
     - `VISION_MODEL` (optional, default `gpt-4o-mini`)
     - `EMBEDDING_MODEL` (optional, default `text-embedding-3-large`)
     - `MONGODB_URI`
     - `DATABASE_NAME`
     - `COLLECTION_NAME`
     - `COLLECTION_NAME_2`
     - `CHAT_HISTORY_COLLECTION`

2. **Frontend service**
   - Deploy from `Dockerfile.frontend`
   - Expose port `8080` (container port)
   - Add environment variables:
     - `NEXT_PUBLIC_IMAGE_DESCRIPTOR_API_URL=https://<your-backend-domain>/imageDescriptor`
     - `NEXT_PUBLIC_RUN_AGENT_API_URL=https://<your-backend-domain>/runAgent`
     - `NEXT_PUBLIC_API_BASE=https://<your-backend-domain>` (optional fallback)

### Full step-by-step deployment

For a complete Railway checklist (MongoDB preparation, env templates, deploy validation, and troubleshooting), see:

- [`docs/RAILWAY_DEPLOYMENT.md`](docs/RAILWAY_DEPLOYMENT.md)

### Notes for Production

- Use Railway's generated backend URL in the two `NEXT_PUBLIC_*` frontend variables.
- Keep MongoDB Atlas network access open to Railway egress IPs (or temporarily allow `0.0.0.0/0` with strict DB user permissions).
- No AWS credentials are required for this deployment path.

---

### Docker Management Commands

Start services (if already built):

```sh
make start
```

Stop all services:

```sh
make stop
```

View logs:

```sh
docker-compose logs -f
```

Clean up containers and images:

```sh
make clean
```

---

## Run Locally (Development)

### Backend Setup

Clone the repository:

```sh
git clone <repo-url>
cd insurance-claim-agent/backend
```

Install Poetry (if not already installed):

```sh
make install_poetry
```

Configure Poetry and install dependencies:

```sh
poetry install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```dotenv
# OpenAI Configuration
OPENAI_API_KEY=""
LLM_MODEL=gpt-4o-mini
VISION_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-large

# MongoDB Configuration
MONGODB_URI=""
DATABASE_NAME=insurance_claims
COLLECTION_NAME=policy_documents
COLLECTION_NAME_2=processed_claims
CHAT_HISTORY_COLLECTION=chat_history

```

Start the backend server.

### Frontend Setup

Open a new terminal and navigate to `frontend`:

```sh
cd ../frontend  # or 'cd frontend' if starting from project root
```

#### Configure Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```dotenv
NEXT_PUBLIC_IMAGE_DESCRIPTOR_API_URL=http://localhost:8000/imageDescriptor
NEXT_PUBLIC_RUN_AGENT_API_URL=http://localhost:8000/runAgent
```

Install dependencies:

```sh
npm install
```

Start the frontend development server:

```sh
npm run dev
```

#### Access Local Development

- Frontend UI: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Troubleshooting

### Common Issues

#### Poetry Installation Issues

If you get package installation errors, use:

```sh
poetry install --no-root
```

#### Makefile Assistance

The provided Makefile streamlines common setup and development tasks. If you encounter issues with setting up Poetry, Docker containers, or running the application, try using the provided make commands, such as:

- `make install_poetry` – Installs Poetry for dependency management  
- `make build` – Builds Docker images for backend and frontend  
- `make start` / `make stop` – Starts or stops the full stack using Docker Compose  
- `make clean` – Cleans up containers and images to resolve potential environment conflicts  

Refer to the Makefile itself or run `make help` for a full list and description of available commands.

#### Docker Issues

- Ensure Docker Desktop is running before using Make commands
- Check that `OPENAI_API_KEY` is set correctly in your environment
- Verify that ports `3000` and `8000` are not in use by other applications

#### OpenAI Access

- Ensure `OPENAI_API_KEY` is valid and has access to your selected models
- Verify `LLM_MODEL`, `VISION_MODEL`, and `EMBEDDING_MODEL` names are correct

#### MongoDB Connection

- Verify your MongoDB URI format and network connectivity
- Ensure all required collections (`processed_claims`, `chat_history`, `policy_documents`) exist
- Check that your Vector Search index is properly configured with correct field names

#### Environment Variables

- Ensure `.env` files are in the correct directories
- Verify all required environment variables are set
- Check that sensitive values are properly configured (no placeholder text)

---
