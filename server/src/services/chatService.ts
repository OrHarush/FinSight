import { GoogleGenerativeAI } from '@google/generative-ai';
import { Tool, SchemaType } from '@google/generative-ai';
import * as transactionService from './transactionService';
import * as accountService from './accountService';
import * as categoryService from './categoryService';
import * as paymentMethodService from './paymentMethodService';
import * as budgetService from './budgetService';
import { TransactionQueryOptions } from '../types/Transaction';
import { ApiError } from '../errors/ApiError';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Base tools available to all users
const baseTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'getTransactions',
        description:
          "Fetch the user's transactions with rich filtering. Supports pagination, date ranges, type (Income/Expense/Transfer), recurrence (None/Monthly/Yearly), category, payment method, and account filters.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            page: { type: SchemaType.INTEGER, description: 'Page number (1-based)' },
            limit: { type: SchemaType.INTEGER, description: 'Max transactions per page' },
            from: { type: SchemaType.STRING, description: 'Start date (ISO 8601)' },
            to: { type: SchemaType.STRING, description: 'End date (ISO 8601)' },
            targetYear: { type: SchemaType.INTEGER, description: 'Filter by year' },
            targetMonth: { type: SchemaType.INTEGER, description: 'Filter by month (0-11)' },
            type: {
              type: SchemaType.STRING,
              enum: ['Income', 'Expense', 'Transfer'],
              description: 'Transaction type',
            },
            recurrence: {
              type: SchemaType.STRING,
              enum: ['None', 'Monthly', 'Yearly'],
              description: 'Recurrence pattern',
            },
            categoryId: { type: SchemaType.STRING, description: 'Filter by category ID' },
            paymentMethodId: {
              type: SchemaType.STRING,
              description: 'Filter by payment method ID',
            },
            accountId: { type: SchemaType.STRING, description: 'Filter by account ID' },
            search: { type: SchemaType.STRING, description: 'Search by transaction name' },
          },
        } as any,
      },
      {
        name: 'getTransactionSummary',
        description:
          'Returns aggregated financial summary data — total income, total expenses, and per-category breakdown.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            year: { type: SchemaType.INTEGER, description: 'Year to summarize (required)' },
            month: { type: SchemaType.INTEGER, description: 'Month to summarize (0=Jan, 11=Dec)' },
            accountId: { type: SchemaType.STRING, description: 'Scope to specific account' },
          },
          required: ['year'],
        } as any,
      },
      {
        name: 'getAccounts',
        description:
          'Fetch all user bank/financial accounts with current balances, institution names, and account numbers.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            isPrimary: {
              type: SchemaType.BOOLEAN,
              description: 'Return only primary account',
            },
            search: {
              type: SchemaType.STRING,
              description: 'Search by account name or institution',
            },
          },
        } as any,
      },
      {
        name: 'getCategories',
        description:
          'Fetch all user-defined spending and income categories with name, type, color, and icon.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            type: {
              type: SchemaType.STRING,
              enum: ['Income', 'Expense'],
              description: 'Filter by type',
            },
            search: { type: SchemaType.STRING, description: 'Search by category name' },
          },
        } as any,
      },
      {
        name: 'getPaymentMethods',
        description:
          'Fetch all user payment methods (credit cards, debit cards, bank transfers, PayPal, etc.).',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            type: {
              type: SchemaType.STRING,
              enum: ['Credit', 'Debit', 'BankTransfer', 'PayPal', 'Other'],
              description: 'Filter by payment method type',
            },
            isPrimary: {
              type: SchemaType.BOOLEAN,
              description: 'Return only primary payment method',
            },
            search: {
              type: SchemaType.STRING,
              description: 'Search by payment method name',
            },
          },
        } as any,
      },
      {
        name: 'getBudgets',
        description:
          "Fetch the user's monthly spending budgets tied to specific categories, years, and months.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            year: { type: SchemaType.INTEGER, description: 'Filter by year' },
            month: { type: SchemaType.INTEGER, description: 'Filter by month (1-12)' },
            categoryId: { type: SchemaType.STRING, description: 'Filter by category ID' },
          },
        } as any,
      },
    ],
  },
];

// Admin-only tools
const adminTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'getAvailableModels',
        description: 'Check which AI models are available and their supported methods. Admin only.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {},
        } as any,
      },
      {
        name: 'checkApiQuota',
        description: 'Check the current API quota limits and usage. Admin only.',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {},
        } as any,
      },
    ],
  },
];

// Helper function to get tools based on user role
const getToolsForUser = (isAdmin: boolean): Tool[] =>
  isAdmin ? [...baseTools, ...adminTools] : baseTools;

const executeTool = async (
  toolName: string,
  args: Record<string, unknown>,
  userId: string,
  isAdmin: boolean = false
): Promise<string> => {
  // Check admin tools first
  if (isAdmin) {
    if (toolName === 'getAvailableModels') {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        const data = (await res.json()) as any;
        const modelInfo = data.models.map((m: any) => ({
          name: m.name.split('/')[1],
          supportedMethods: m.supportedGenerationMethods,
        }));
        return JSON.stringify({ models: modelInfo });
      } catch (error) {
        return JSON.stringify({
          error: error instanceof Error ? error.message : 'Failed to fetch models',
        });
      }
    }

    if (toolName === 'checkApiQuota') {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/quotas?key=${apiKey}`
        );
        const data = (await res.json()) as any;
        return JSON.stringify(data);
      } catch (error) {
        return JSON.stringify({
          error: error instanceof Error ? error.message : 'Failed to fetch quota info',
          note: 'For detailed usage, visit: https://ai.google.dev/rate-limit',
        });
      }
    }
  }

  // Regular user tools
  try {
    let result: unknown;

    switch (toolName) {
      case 'getTransactions': {
        const options: TransactionQueryOptions = {
          page: args.page as number | undefined,
          limit: args.limit as number | undefined,
          from: args.from ? new Date(args.from as string) : undefined,
          to: args.to ? new Date(args.to as string) : undefined,
          targetYear: args.targetYear as number | undefined,
          targetMonth: args.targetMonth as number | undefined,
          sort: 'desc',
          categoryId: args.categoryId as string | undefined,
          paymentMethodId: args.paymentMethodId as string | undefined,
          accountId: args.accountId as string | undefined,
          search: args.search as string | undefined,
        };
        result = await transactionService.findAll(userId, options);
        break;
      }
      case 'getTransactionSummary': {
        result = await transactionService.getTransactionSummary(
          userId,
          args.year as number,
          args.month as number | undefined,
          args.accountId as string | undefined
        );
        break;
      }
      case 'getAccounts': {
        result = await accountService.findAll(userId);
        if (args.isPrimary) {
          result = (result as any[]).filter((a) => a.isPrimary === args.isPrimary);
        }
        if (args.search) {
          const term = (args.search as string).toLowerCase();
          result = (result as any[]).filter((a) => a.name.toLowerCase().includes(term));
        }
        break;
      }
      case 'getCategories': {
        result = await categoryService.findAll(userId);
        if (args.type) {
          result = (result as any[]).filter((c) => c.type === args.type);
        }
        if (args.search) {
          const term = (args.search as string).toLowerCase();
          result = (result as any[]).filter((c) => c.name.toLowerCase().includes(term));
        }
        break;
      }
      case 'getPaymentMethods': {
        result = await paymentMethodService.findAll(userId);
        if (args.type) {
          result = (result as any[]).filter((m) => m.type === args.type);
        }
        if (args.isPrimary) {
          result = (result as any[]).filter((m) => m.isPrimary === args.isPrimary);
        }
        if (args.search) {
          const term = (args.search as string).toLowerCase();
          result = (result as any[]).filter((m) => m.name.toLowerCase().includes(term));
        }
        break;
      }
      case 'getBudgets': {
        const options: any = {};
        if (args.year !== undefined) options.year = args.year;
        if (args.month !== undefined) options.month = (args.month as number) - 1;
        if (args.categoryId !== undefined) options.categoryId = args.categoryId;
        result = await budgetService.findAll(userId, options);
        break;
      }
      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }

    return JSON.stringify(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return JSON.stringify({ error: errorMessage });
  }
};

export const chat = async (
  userId: string,
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  currentDate?: string,
  currentYear?: number,
  currentMonth?: number,
  isAdmin: boolean = false
) => {
  if (!apiKey) {
    throw ApiError.internal('Gemini API key is not configured');
  }

  try {
    // Get appropriate tools based on user role
    const userTools = getToolsForUser(isAdmin);
    // Format current date info for the system instruction
    const dateContext = currentDate
      ? `The current date is ${currentDate} (${new Date(currentDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}). Current year: ${currentYear}, Current month: ${currentMonth === 0 ? 'January' : currentMonth === 1 ? 'February' : currentMonth === 2 ? 'March' : currentMonth === 3 ? 'April' : currentMonth === 4 ? 'May' : currentMonth === 5 ? 'June' : currentMonth === 6 ? 'July' : currentMonth === 7 ? 'August' : currentMonth === 8 ? 'September' : currentMonth === 9 ? 'October' : currentMonth === 10 ? 'November' : 'December'} (month index: ${currentMonth}).`
      : '';

    // Use the stable free-tier model with function calling support
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      tools: userTools,
      systemInstruction: `You are a helpful financial assistant for FinSight. Help users understand and analyze their finances using the available tools.

${dateContext}

When users mention relative dates like "this month", "last month", "this year", automatically determine the correct year and month values:
- "this month" = current month (${currentMonth ?? 'unknown'})
- "last month" = previous month (${currentMonth !== undefined ? (currentMonth ? currentMonth - 1 : 11) : 'unknown'})
- "next month" = next month (${currentMonth !== undefined ? (currentMonth !== 11 ? currentMonth + 1 : 0) : 'unknown'})
- "this year" = current year (${currentYear ?? 'unknown'})
- "last year" = previous year (${currentYear !== undefined ? currentYear - 1 : 'unknown'})

When responding:
- Use **bold** for important numbers and key insights
- Use lists and bullet points to organize information
- Format currency amounts consistently
- Break complex information into clear sections
- Use headers (##) to structure longer responses
- Highlight trends and patterns with emphasis`,
    });

    // Build initial message list with conversation history
    const messageList: any[] = [
      ...conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    let response = await model.generateContent({
      contents: messageList,
    });

    // Handle tool use loop
    let iterations = 0;
    const maxIterations = 10;

    while (
      iterations < maxIterations &&
      response.response.candidates?.[0]?.content.parts.some((p: any) => p.functionCall)
    ) {
      iterations++;

      const toolCalls = response.response.candidates[0].content.parts.filter(
        (p: any) => p.functionCall
      );

      if (!toolCalls.length) {
        break;
      }

      // Add model's response to message history
      messageList.push({
        role: 'model',
        parts: response.response.candidates[0].content.parts,
      });

      // Execute all tool calls
      const toolResults = await Promise.all(
        toolCalls.map(async (toolCall: any) => {
          const resultString = await executeTool(
            toolCall.functionCall.name,
            toolCall.functionCall.args || {},
            userId,
            isAdmin
          );

          // Parse the JSON string back to an object
          let resultObject;
          try {
            resultObject = JSON.parse(resultString);
          } catch {
            resultObject = { error: 'Failed to parse tool result' };
          }

          return {
            functionResponse: {
              name: toolCall.functionCall.name,
              response: resultObject,
            },
          };
        })
      );

      // Add tool results to message history
      messageList.push({
        role: 'user',
        parts: toolResults,
      });

      // Continue conversation with accumulated history
      response = await model.generateContent({
        contents: messageList,
      });
    }

    // Extract final text response
    const textParts =
      response.response.candidates?.[0]?.content.parts.filter((p: any) => p.text) || [];
    const responseText = textParts.map((p: any) => p.text).join('');

    return responseText || 'I could not process your request.';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Chat service error:', errorMessage);

    if (
      errorMessage.includes('429') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('Quota exceeded')
    ) {
      throw ApiError.tooManyRequests(
        'AI service quota exceeded. Please try again later or upgrade your plan.'
      );
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('Too Many Requests')) {
      throw ApiError.tooManyRequests('Too many requests. Please wait a moment and try again.');
    }

    throw ApiError.internal('Unable to process your request. Please try again.');
  }
};
