import base64
import os
from openai import OpenAI


def _encode_image(image_path: str) -> str:
    with open(image_path, 'rb') as image_file:
        image_bytes = image_file.read()
    return base64.b64encode(image_bytes).decode('utf-8')


def _infer_media_type(image_path: str) -> str:
    _, ext = os.path.splitext(image_path.lower())
    if ext == '.png':
        return 'image/png'
    if ext in ('.jpg', '.jpeg'):
        return 'image/jpeg'
    return 'image/jpeg'


def stream_image_description(
    image_path: str,
    model_id: str = None,
    prompt: str = "What do you see in this image? Give a concise description and focus and what happened to vehicles.",
):
    """Generate a concise image description with an OpenAI vision model."""

    model = model_id or os.getenv("VISION_MODEL", "gpt-4o-mini")
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    b64_image = _encode_image(image_path)
    media_type = _infer_media_type(image_path)

    response = client.responses.create(
        model=model,
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": prompt},
                    {
                        "type": "input_image",
                        "image_url": f"data:{media_type};base64,{b64_image}",
                    },
                ],
            }
        ],
    )

    text = (response.output_text or "").strip()
    if not text:
        text = "Unable to describe the image."

    for i in range(0, len(text), 60):
        yield text[i:i + 60]
