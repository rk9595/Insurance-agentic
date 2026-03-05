from langchain_openai import OpenAIEmbeddings

import logging
import os
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

load_dotenv()


def get_embedding_model(model_id: str | None = None) -> OpenAIEmbeddings:
    selected_model = model_id or os.getenv("EMBEDDING_MODEL", "text-embedding-3-large")
    return OpenAIEmbeddings(model=selected_model, api_key=os.getenv("OPENAI_API_KEY"))


def get_embedding(text: str, model_id: str | None = None):
    if not text or not isinstance(text, str):
        logging.error("Invalid input. Please provide a valid text input.")
        return None

    embeddings = get_embedding_model(model_id=model_id)
    try:
        return embeddings.embed_documents([text])[0]
    except Exception as e:
        print(f"Error in get_embedding: {e}")
        return None
