/**
 * Next.js API Route: Image Descriptor Proxy
 *
 * This route proxies image upload requests to the backend's /imageDescriptor endpoint.
 * It handles FormData uploads and streams the response back to the client.
 *
 * Environment variable priority:
 * 1) NEXT_PUBLIC_IMAGE_DESCRIPTOR_API_URL (explicit endpoint URL)
 * 2) INTERNAL_API_URL + /imageDescriptor
 * 3) NEXT_PUBLIC_API_BASE + /imageDescriptor
 * 4) http://localhost:8080/imageDescriptor (local development)
 */

function resolveImageDescriptorUrl() {
  if (process.env.NEXT_PUBLIC_IMAGE_DESCRIPTOR_API_URL) {
    return process.env.NEXT_PUBLIC_IMAGE_DESCRIPTOR_API_URL;
  }

  const backendBase = process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    'http://localhost:8080';

  return `${backendBase}/imageDescriptor`;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const targetUrl = resolveImageDescriptorUrl();

    console.log(`[Image Descriptor] Proxying request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[Image Descriptor] Backend error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({
          error: 'Failed to process image',
          status: response.status,
          details: errorText,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('[Image Descriptor] Proxy error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to connect to backend',
        details: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
