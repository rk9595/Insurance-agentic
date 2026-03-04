/**
 * Next.js API Route: Run Agent Proxy
 *
 * This route proxies agent execution requests to the backend's /runAgent endpoint.
 * It triggers the LangGraph agent workflow and returns the claim document.
 *
 * Environment variable priority:
 * 1) NEXT_PUBLIC_RUN_AGENT_API_URL (explicit endpoint URL)
 * 2) INTERNAL_API_URL + /runAgent
 * 3) NEXT_PUBLIC_API_BASE + /runAgent
 * 4) http://localhost:8080/runAgent (local development)
 */

function resolveRunAgentUrl() {
  if (process.env.NEXT_PUBLIC_RUN_AGENT_API_URL) {
    return process.env.NEXT_PUBLIC_RUN_AGENT_API_URL;
  }

  const backendBase = process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE ||
    'http://localhost:8080';

  return `${backendBase}/runAgent`;
}

export async function POST() {
  try {
    const targetUrl = resolveRunAgentUrl();
    console.log(`[Run Agent] Proxying request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'Agent processing failed',
      }));
      console.error(`[Run Agent] Backend error: ${response.status}`, errorData);
      return Response.json(errorData, { status: response.status });
    }

    const data = await response.json();
    console.log('[Run Agent] Successfully retrieved claim document');
    return Response.json(data);
  } catch (error) {
    console.error('[Run Agent] Proxy error:', error);
    return Response.json(
      {
        error: 'Failed to connect to backend',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
