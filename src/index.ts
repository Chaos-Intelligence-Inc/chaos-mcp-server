#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ChaosApiClient } from './client.js';
import { registerAllTools } from './tools.js';

const apiKey = process.env.CHAOS_API_KEY;

if (!apiKey) {
  console.error('Error: CHAOS_API_KEY environment variable is required.');
  console.error('Get your API key at https://chaosintelligence.com/settings/api');
  process.exit(1);
}

if (!/^chaos_[a-zA-Z0-9]{32}$/.test(apiKey)) {
  console.error(
    'Error: CHAOS_API_KEY has invalid format. Expected: chaos_ followed by 32 alphanumeric characters.',
  );
  process.exit(1);
}

const client = new ChaosApiClient(apiKey);

const server = new McpServer({
  name: 'chaos-intelligence',
  version: '1.0.0',
});

registerAllTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);

console.error('Chaos Intelligence MCP server running on stdio');
