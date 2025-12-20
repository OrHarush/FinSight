import { z } from 'zod';
import { mcpClient, connectMcp } from './mcpClient';

const CallToolResultSchema = z.any(); // or a real schema

async function demo() {
  await connectMcp();

  // list tools
  const tools = await mcpClient.request(
    {
      method: 'tools/list',
      params: {},
    },
    CallToolResultSchema
  );
  console.log('Tools:', tools);

  // call getTransactions
  const result = await mcpClient.request(
    {
      method: 'tools/call',
      params: {
        name: 'getTransactions',
        arguments: { page: 1, limit: 5, sort: 'desc' },
      },
    },
    CallToolResultSchema
  );

  console.dir(result, { depth: null });
}

demo();
