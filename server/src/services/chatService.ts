import { GoogleGenerativeAI, SchemaType, Tool } from '@google/generative-ai';

import { ApiError } from '../errors/ApiError';
import { GetTransactionsOptions, GetTransactionSummaryQuery } from '../schemas/transactionSchemas';
import { ITransactionPopulated } from '../types/Transaction';
import * as accountService from './accountService';
import * as budgetService from './budgetService';
import * as categoryService from './categoryService';
import * as paymentMethodService from './paymentMethodService';
import * as transactionService from './transactions/transactionService';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

const formatTransactionsAsTable = (transactions: ITransactionPopulated[]): string => {
  if (!transactions || transactions.length === 0) {
    return 'No transactions found.';
  }

  const rows = transactions
    .slice(0, 20) // Limit to 20 rows for readability
    .map(tx => {
      const dateStr = tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A';
      return `| ${dateStr} | ${tx.category?.name || 'N/A'} | ${tx.type} | $${tx.amount.toFixed(2)} | ${tx.account?.name || 'N/A'} |`;
    })
    .join('\n');

  // Use only dashes for the separator row (no colons)
  return `| Date | Category | Type | Amount | Account |\n|---|---|---|---|---|\n${rows}`;
};

// Base tools available to all users
const baseTools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'getTransactions',
        description:
          "Fetch the user's transactions with rich filtering. Supports pagination, date ranges, type (Income/Expense/Transfer), category, payment method, and account filters.",
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
        const options: GetTransactionsOptions = {
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
        const transactions = await transactionService.findAll(userId, options);

        // Extract data from paginated response (if pagination exists, get data array, otherwise use full response)
        const txData = Array.isArray(transactions)
          ? transactions
          : (transactions as any).data || [];

        const formattedTable = formatTransactionsAsTable(txData as ITransactionPopulated[]);
        result = {
          formatted: formattedTable,
          raw: txData,
          count: txData.length,
        };
        break;
      }
      case 'getTransactionSummary': {
        const query: GetTransactionSummaryQuery = {
          year: args.year as number,
          month: args.month as number | undefined,
          accountId: args.accountId as string | undefined,
        };
        result = await transactionService.getTransactionSummary(userId, query);
        break;
      }
      case 'getAccounts': {
        const accounts = await accountService.findAll(userId);
        let filtered = accounts as any[];
        if (args.isPrimary) {
          filtered = filtered.filter(a => a.isPrimary === args.isPrimary);
        }
        if (args.search) {
          const term = (args.search as string).toLowerCase();
          filtered = filtered.filter(a => a.name.toLowerCase().includes(term));
        }
        result = { accounts: filtered };
        break;
      }
      case 'getCategories': {
        const categories = await categoryService.findAll(userId);
        let filtered = categories as any[];
        if (args.type) {
          filtered = filtered.filter(c => c.type === args.type);
        }
        if (args.search) {
          const term = (args.search as string).toLowerCase();
          filtered = filtered.filter(c => c.name.toLowerCase().includes(term));
        }
        result = { categories: filtered };
        break;
      }
      case 'getPaymentMethods': {
        result = await paymentMethodService.findAll(userId);
        if (args.type) {
          result = (result as any[]).filter(m => m.type === args.type);
        }
        if (args.isPrimary) {
          result = (result as any[]).filter(m => m.isPrimary === args.isPrimary);
        }
        if (args.search) {
          const term = (args.search as string).toLowerCase();
          result = (result as any[]).filter(m => m.name.toLowerCase().includes(term));
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

const MODEL_FALLBACK_CHAIN = [
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
];

const isQuotaError = (message: string) =>
  message.includes('429') ||
  message.includes('quota') ||
  message.includes('Quota exceeded') ||
  message.includes('RESOURCE_EXHAUSTED');

const generateWithFallback = async (
  buildModel: (modelName: string) => ReturnType<typeof genAI.getGenerativeModel>,
  generate: (model: ReturnType<typeof genAI.getGenerativeModel>) => Promise<any>
): Promise<{ response: any; modelUsed: string }> => {
  let lastError: Error | null = null;

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    try {
      const model = buildModel(modelName);
      const response = await generate(model);
      return { response, modelUsed: modelName };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (isQuotaError(message)) {
        console.warn(`Model ${modelName} quota exceeded, trying next model...`);
        lastError = error instanceof Error ? error : new Error(message);
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error('All models quota exceeded');
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
    const userTools = getToolsForUser(isAdmin);
    const usedTools: Set<string> = new Set();

    const dateContext = currentDate
      ? `The current date is ${currentDate} (${new Date(currentDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}). Current year: ${currentYear}, Current month: ${currentMonth === 0 ? 'January' : currentMonth === 1 ? 'February' : currentMonth === 2 ? 'March' : currentMonth === 3 ? 'April' : currentMonth === 4 ? 'May' : currentMonth === 5 ? 'June' : currentMonth === 6 ? 'July' : currentMonth === 7 ? 'August' : currentMonth === 8 ? 'September' : currentMonth === 9 ? 'October' : currentMonth === 10 ? 'November' : 'December'} (month index: ${currentMonth}).`
      : '';

    const toolDisclosureInstruction = isAdmin
      ? '\n\n## ADMIN MODE — Tool Transparency:\nYou may mention which tools you used to gather the information (e.g., "I used getTransactionSummary to fetch this data").'
      : '\n\n## Tool Disclosure (IMPORTANT):\nNEVER mention which tools you used to retrieve information. Users should only see the results, not the underlying tool calls. Focus entirely on presenting the analysis and insights.';

    const systemInstruction = `You are a helpful financial assistant for FinSight. Help users understand and analyze their finances using the available tools.

${dateContext}

## Date defaults (IMPORTANT — always apply unless user specifies otherwise):
- "this month" = targetMonth: ${currentMonth ?? 'unknown'}, targetYear: ${currentYear ?? 'unknown'}
- "last month" = targetMonth: ${currentMonth !== undefined ? (currentMonth ? currentMonth - 1 : 11) : 'unknown'}, targetYear: ${currentYear ?? 'unknown'}
- "next month" = targetMonth: ${currentMonth !== undefined ? (currentMonth !== 11 ? currentMonth + 1 : 0) : 'unknown'}
- "this year" = targetYear: ${currentYear ?? 'unknown'}
- "last year" = targetYear: ${currentYear !== undefined ? currentYear - 1 : 'unknown'}
- If the user asks about budgets, transactions, or summaries WITHOUT specifying a date, ALWAYS default to current month (${currentMonth ?? 'unknown'}) and current year (${currentYear ?? 'unknown'}). NEVER ask the user for a date — just use the defaults.

## CRITICAL — Tool Execution Rules:
- When you determine you need data to answer a question, IMMEDIATELY CALL the required tools.
- Do NOT generate text describing what you will do. Execute tools first.
- Do NOT say "I will fetch...", "Let me get...", or "I need to check...". Just call the tools.
- After you receive tool results, THEN generate your analysis and response.
- Example: User asks "compare my Feb and Mar expenses" → You IMMEDIATELY call getTransactionSummary for Feb AND Mar → You THEN analyze and respond.
- If multiple tools are needed (e.g., getTransactionSummary for Feb and Mar), call them ALL in the same response.

## Tool usage rules:
- getCategories: if user does NOT specify "income" or "expense", fetch ALL categories (do not filter by type, do not ask).
- getBudgets: if no month/year specified, use current month (${currentMonth ?? 'unknown'}) and current year (${currentYear ?? 'unknown'}).
- getTransactions: if no date range specified, use current month and year.

## IMPORTANT — Structured response format:
When the user asks to SEE or LIST categories, respond with ONLY this JSON (no markdown, no extra text):
{"type":"categories","text":"<your short summary sentence>","categories":<categories array from tool>}

When the user asks to SEE or LIST accounts, respond with ONLY this JSON (no markdown, no extra text):
{"type":"accounts","text":"<your short summary sentence>","accounts":<accounts array from tool>}

For all other responses, respond with ONLY this JSON:
{"type":"text","text":"<your full markdown response>"}

Do NOT wrap the JSON in markdown code blocks. Return raw JSON only.

## Text formatting (inside the "text" field):
When displaying transactions:
- ALWAYS use the pre-formatted markdown table provided in the tool result under the "formatted" field
- DO NOT create your own table format
- You can add analysis or insights before/after the table
- Use **bold** for important numbers and key insights
- Use lists and bullet points to organize information
- Format currency amounts consistently
- Use headers (##) to structure longer responses${toolDisclosureInstruction}`;

    const messageList: any[] = [
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    return generateWithFallback(
      modelName =>
        genAI.getGenerativeModel({
          model: modelName,
          tools: userTools,
          systemInstruction,
        }),
      async model => {
        let response = await model.generateContent({ contents: messageList });

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

          // Track which tools were used
          toolCalls.forEach((toolCall: any) => {
            usedTools.add(toolCall.functionCall.name);
          });

          messageList.push({
            role: 'model',
            parts: response.response.candidates[0].content.parts,
          });

          const toolResults = await Promise.all(
            toolCalls.map(async (toolCall: any) => {
              const resultString = await executeTool(
                toolCall.functionCall.name,
                toolCall.functionCall.args || {},
                userId,
                isAdmin
              );

              let resultObject;
              try {
                resultObject = JSON.parse(resultString);
              } catch {
                resultObject = { error: 'Failed to parse tool result' };
              }

              const wrappedResult = Array.isArray(resultObject)
                ? { data: resultObject }
                : resultObject;

              return {
                functionResponse: {
                  name: toolCall.functionCall.name,
                  response: wrappedResult,
                },
              };
            })
          );

          messageList.push({ role: 'user', parts: toolResults });

          response = await model.generateContent({ contents: messageList });
        }

        const textParts =
          response.response.candidates?.[0]?.content.parts.filter((p: any) => p.text) || [];
        const rawText = textParts
          .map((p: any) => p.text)
          .join('')
          .trim();

        // Try to parse structured JSON response from Gemini
        try {
          // Strip markdown code fences if Gemini wrapped it anyway
          const jsonStr = rawText
            .replace(/^```(?:json)?\n?/, '')
            .replace(/\n?```$/, '')
            .trim();
          const parsed = JSON.parse(jsonStr);

          if (
            parsed.type === 'categories' ||
            parsed.type === 'accounts' ||
            parsed.type === 'text'
          ) {
            // Add tools used for admin users
            if (isAdmin && usedTools.size > 0) {
              parsed.toolsUsed = Array.from(usedTools);
            }
            return parsed;
          }
        } catch {
          // Not JSON — fall through to plain text
        }

        const responseData: any = {
          type: 'text',
          text: rawText || 'I could not process your request.',
        };

        // Add tools used for admin users
        if (isAdmin && usedTools.size > 0) {
          responseData.toolsUsed = Array.from(usedTools);
        }

        return responseData;
      }
    ).then(({ response, modelUsed }) => ({
      message: response.text,
      model: modelUsed,
      parsed: response,
    }));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Chat service error:', errorMessage);

    if (isQuotaError(errorMessage)) {
      throw ApiError.tooManyRequests(
        'AI service quota exceeded on all available models. Please try again tomorrow.'
      );
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('Too Many Requests')) {
      throw ApiError.tooManyRequests('Too many requests. Please wait a moment and try again.');
    }

    throw ApiError.internal('Unable to process your request. Please try again.');
  }
};
