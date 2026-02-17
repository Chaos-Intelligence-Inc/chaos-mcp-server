// HTTP client that forwards tool calls to the deployed Chaos MCP edge function

import type { JsonRpcResponse, CallToolResult } from './types.js';

const API_ENDPOINT =
  'https://api.chaosintelligenceinc.com/functions/v1/chaos-mcp-server';
const TIMEOUT_MS = 30_000;

function errorResult(message: string): CallToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}

export class ChaosApiClient {
  private apiKey: string;
  private requestId = 0;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async callTool(
    toolName: string,
    args: Record<string, unknown>,
  ): Promise<CallToolResult> {
    const id = ++this.requestId;
    const payload = {
      jsonrpc: '2.0',
      id,
      method: 'tools/call',
      params: { name: toolName, arguments: args },
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          return errorResult(
            'Authentication failed. Check your CHAOS_API_KEY.',
          );
        }
        return errorResult(
          `API request failed with status ${response.status}`,
        );
      }

      const rpcResponse: JsonRpcResponse = await response.json();

      if (rpcResponse.error) {
        return errorResult(rpcResponse.error.message);
      }

      return rpcResponse.result ?? errorResult('Empty response from API');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return errorResult('Request timed out after 30 seconds.');
      }
      return errorResult(
        `Network error: ${err instanceof Error ? err.message : 'Check your internet connection.'}`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}
