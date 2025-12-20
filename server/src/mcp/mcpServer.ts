import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import * as transactionService from '../services/transactionService';
import { TransactionQueryOptions } from '../types/Transaction';
import { z } from 'zod';
import { getUserIdFromAuthHeader } from '../utils/auth';

const TransactionQueryOptionsSchema = z.object({
  page: z.number().int().positive().optional().describe('Page number (1-based)'),
  limit: z.number().int().positive().optional().describe('Max items per page'),
  from: z.string().datetime().optional().describe('Start date (ISO 8601)'),
  to: z.string().datetime().optional().describe('End date (ISO 8601)'),
  targetYear: z.number().int().optional().describe('Effective year filter'),
  targetMonth: z
    .number()
    .int()
    .min(0)
    .max(11)
    .optional()
    .describe('Effective month filter (0-11, matches your service)'),
  sort: z.enum(['asc', 'desc']).optional().describe('Sort order by date'),
  categoryId: z.string().optional().describe('Filter by category ID'),
  paymentMethodId: z.string().optional().describe('Filter by payment method ID'),
  accountId: z.string().optional().describe('Filter by account ID'),
  search: z.string().optional().describe('Search substring in transaction name'),
});

export const mcpServer = new McpServer({
  name: 'transactions-mcp',
  version: '1.0.0',
});

mcpServer.registerTool(
  'getTransactions',
  {
    title: 'Get Transactions',
    description: 'Fetch transactions with all available filters.',
    inputSchema: TransactionQueryOptionsSchema,
  },
  async (args, context) => {
    const headers = context.requestInfo?.headers ?? {};
    const authHeader =
      (headers['authorization'] as string | undefined) ??
      (headers['Authorization'] as string | undefined);

    const userId = getUserIdFromAuthHeader(authHeader);

    if (!userId) {
      return {
        content: [{ type: 'text', text: 'Unauthorized: missing or invalid token' }],
        isError: true,
      };
    }

    const options: TransactionQueryOptions = {
      page: args.page,
      limit: args.limit,
      sort: args.sort,
      categoryId: args.categoryId,
      paymentMethodId: args.paymentMethodId,
      accountId: args.accountId,
      search: args.search,
      targetYear: args.targetYear,
      targetMonth: args.targetMonth,
      from: args.from ? new Date(args.from) : undefined,
      to: args.to ? new Date(args.to) : undefined,
    };

    const result = await transactionService.findAll(userId, options);

    return {
      content: [{ type: 'text', text: `Found ${result.data.length} transactions.` }],
      structuredContent: result,
    };
  }
);

export const mcpMiddleware = async (req: any, res: any) => {
  const transport = new StreamableHTTPServerTransport();

  res.on('close', () => transport.close());

  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
};
