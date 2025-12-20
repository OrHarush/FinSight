import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export const mcpClient = new Client({
  name: 'finsight-ai-agent',
  version: '0.1.0',
});

export async function connectMcp() {
  const transport = new StreamableHTTPClientTransport(new URL('http://localhost:5000/mcp'));
  await mcpClient.connect(transport);
}
