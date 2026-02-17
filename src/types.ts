// Types for the JSON-RPC contract with the deployed Chaos MCP edge function

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export type { CallToolResult };

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: CallToolResult;
  error?: { code: number; message: string; data?: unknown };
}
