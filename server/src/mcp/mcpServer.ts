import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import * as transactionService from '../services/transactionService';
import * as accountService from '../services/accountService';
import * as categoryService from '../services/categoryService';
import * as paymentMethodService from '../services/paymentMethodService';
import * as budgetService from '../services/budgetService';
import { TransactionQueryOptions } from '../types/Transaction';
import {
  TransactionQuerySchema,
  TransactionSummaryQuerySchema,
  AccountQuerySchema,
  CategoryQuerySchema,
  PaymentMethodQuerySchema,
  BudgetQuerySchema,
} from './mcpSchemas';
import { extractUserIdFromBearerToken, isValidBearerToken } from '../utils/auth';

const authErrorResponse = {
  content: [{ type: 'text' as const, text: 'Unauthorized: missing or invalid token' }],
  isError: true,
};

const extractUserIdFromContext = (context: any): string | null => {
  const headers = context.requestInfo?.headers ?? {};
  const authHeader =
    (headers['authorization'] as string | undefined) ??
    (headers['Authorization'] as string | undefined);

  if (!isValidBearerToken(authHeader)) {
    return null;
  }

  return extractUserIdFromBearerToken(authHeader);
};

export const mcpServer = new McpServer({
  name: 'finsight-mcp',
  version: '1.0.0',
});

mcpServer.registerTool(
  'getTransactions',
  {
    title: 'Get Transactions',
    description:
      "Fetch the user's transactions with rich filtering. " +
      'Supports pagination, date ranges, type (Income/Expense/Transfer), ' +
      'recurrence (None/Monthly/Yearly), category, payment method, and account filters. ' +
      'Recurring transactions are automatically expanded into individual occurrences. ' +
      'Use targetYear + targetMonth to get transactions effective in a specific month (recommended over raw date ranges for monthly views). ' +
      'Use this tool to list, search, or analyze individual transactions.',
    inputSchema: TransactionQuerySchema,
  },
  async (args, context) => {
    const userId = extractUserIdFromContext(context);

    if (!userId) {
      return authErrorResponse;
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
    const allData = JSON.parse(JSON.stringify(result));

    const data = {
      ...allData,
      data: allData.data
        .filter((tx: any) => (args.type ? tx.type === args.type : true))
        .filter((tx: any) => (args.recurrence ? tx.recurrence === args.recurrence : true))
        .filter((tx: any) =>
          args.fromAccountId ? tx.fromAccount?._id === args.fromAccountId : true
        )
        .filter((tx: any) => (args.toAccountId ? tx.toAccount?._id === args.toAccountId : true)),
    };

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  }
);

mcpServer.registerTool(
  'getTransactionSummary',
  {
    title: 'Get Transaction Summary',
    description:
      'Returns aggregated financial summary data — total income, total expenses, net balance, ' +
      'and per-category breakdown. Provide just a year for a full 12-month yearly overview, ' +
      'or year + month (0=Jan) for a single month summary. Optionally scope to a specific account. ' +
      'Use this tool instead of getTransactions when you need totals, net balance, ' +
      'or category spending breakdowns rather than individual transaction details.',
    inputSchema: TransactionSummaryQuerySchema,
  },
  async (args, context) => {
    const userId = extractUserIdFromContext(context);

    if (!userId) {
      return authErrorResponse;
    }

    const summary = await transactionService.getTransactionSummary(
      userId,
      args.year,
      args.month,
      args.accountId
    );

    const data = JSON.parse(JSON.stringify(summary));
    const structured = Array.isArray(data) ? { totalMonths: data.length, months: data } : data;

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(structured, null, 2) }],
      structuredContent: structured,
    };
  }
);

mcpServer.registerTool(
  'getAccounts',
  {
    title: 'Get Accounts',
    description:
      'Fetch all user bank/financial accounts with their current balances, institution names, account numbers,' +
      'and icons. Each account has a balance field reflecting the current synced balance. ' +
      'The primary account is the main account used for overview calculations. ' +
      'Use this tool to list accounts or get account IDs needed for filtering other tools.',
    inputSchema: AccountQuerySchema,
  },
  async (args, context) => {
    const userId = extractUserIdFromContext(context);

    if (!userId) {
      return authErrorResponse;
    }

    let accounts = await accountService.findAll(userId);

    if (args.isPrimary !== undefined) {
      accounts = accounts.filter((a: any) => a.isPrimary === args.isPrimary);
    }

    if (args.search) {
      const term = args.search.toLowerCase();
      accounts = accounts.filter((a: any) => a.name.toLowerCase().includes(term));
    }

    const data = JSON.parse(JSON.stringify(accounts));
    const structured = {
      total: data.length,
      items: data,
    };

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: structured,
    };
  }
);

mcpServer.registerTool(
  'getCategories',
  {
    title: 'Get Categories',
    description:
      'Fetch all user-defined spending and income categories. Each category has a name, ' +
      'type (Income or Expense), color, and icon. Category IDs are required when filtering transactions by category. ' +
      'Use this tool first to discover category IDs before calling getTransactions or getBudgets with a categoryId filter.',
    inputSchema: CategoryQuerySchema,
  },
  async (args, context) => {
    const userId = extractUserIdFromContext(context);

    if (!userId) {
      return authErrorResponse;
    }

    let categories = await categoryService.findAll(userId);

    if (args.type) {
      categories = categories.filter((c: any) => c.type === args.type);
    }

    if (args.search) {
      const term = args.search.toLowerCase();
      categories = categories.filter((c: any) => c.name.toLowerCase().includes(term));
    }

    const data = JSON.parse(JSON.stringify(categories));
    const structured = {
      total: data.length,
      items: data,
    };

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: structured,
    };
  }
);

mcpServer.registerTool(
  'getPaymentMethods',
  {
    title: 'Get Payment Methods',
    description:
      'Fetch all user payment methods (credit cards, debit cards, bank transfers, PayPal, etc.). ' +
      'Each method has a name, type, optional last 4 digits, and a billing day (for credit cards). ' +
      'Payment method IDs are needed when filtering transactions by payment method. ' +
      'Use this tool to discover which payment methods the user has and their IDs.',
    inputSchema: PaymentMethodQuerySchema,
  },
  async (args, context) => {
    const userId = extractUserIdFromContext(context);

    if (!userId) {
      return authErrorResponse;
    }

    let methods = await paymentMethodService.findAll(userId);

    if (args.type) {
      methods = methods.filter((m: any) => m.type === args.type);
    }

    if (args.isPrimary !== undefined) {
      methods = methods.filter((m: any) => m.isPrimary === args.isPrimary);
    }

    if (args.search) {
      const term = args.search.toLowerCase();
      methods = methods.filter((m: any) => m.name.toLowerCase().includes(term));
    }

    const data = JSON.parse(JSON.stringify(methods));
    const structured = {
      total: data.length,
      items: data,
    };

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: structured,
    };
  }
);

mcpServer.registerTool(
  'getBudgets',
  {
    title: 'Get Budgets',
    description:
      "Fetch the user's monthly spending budgets. Each budget is tied to a specific category, year, and month, and has a spending limit. Use year + month filters to get budgets for a specific period. To compare actual spending vs budget limits, combine this tool with getTransactionSummary for the same period.",
    inputSchema: BudgetQuerySchema,
  },
  async (args, context) => {
    const userId = extractUserIdFromContext(context);

    if (!userId) {
      return authErrorResponse;
    }

    const options: any = {};

    if (args.year !== undefined) {
      options.year = args.year;
    }

    if (args.month !== undefined) {
      options.month = args.month - 1;
    }

    if (args.categoryId !== undefined) {
      options.categoryId = args.categoryId;
    }

    const budgets = await budgetService.findAll(userId, options);
    const data = JSON.parse(JSON.stringify(budgets));
    const structured = {
      total: data.length,
      items: data,
    };

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
      structuredContent: structured,
    };
  }
);

export const mcpMiddleware = async (req: any, res: any) => {
  req.headers['accept'] = 'application/json, text/event-stream';

  const transport = new StreamableHTTPServerTransport();

  res.on('close', () => transport.close());

  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
};
