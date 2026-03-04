from langchain_openai import ChatOpenAI

import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)


def get_llm(
    model_id: str = os.getenv("LLM_MODEL", "gpt-4o-mini"),
    api_key: str = os.getenv("OPENAI_API_KEY"),
) -> ChatOpenAI:
    """Return the chat model used by the insurance agent."""
    return ChatOpenAI(model=model_id, api_key=api_key, temperature=0)
