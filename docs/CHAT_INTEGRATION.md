# Chat Integration with Gemini API

## Quick Summary

**What:** FinSight chat system that processes natural language questions about finances using Google Gemini API with function calling.

**How it works:** User message → Client sends to `/api/chat` → Server passes to Gemini → Gemini calls tools as needed → Tools fetch data → Gemini generates response → Client renders as markdown, pills, or cards

**Key concept:** Gemini intelligently decides which tools to call, executes them, uses results to answer naturally, and returns structured JSON for rich client rendering.

---

## System Flow

1. User types a message in the chat UI
2. Client POSTs to `/api/chat` with message + conversation history + current date context
3. Server initializes Gemini with available tools (with automatic model fallback on quota)
4. Gemini analyzes the message and decides what to do:
   - If no tool needed: returns text answer directly
   - If tool needed: calls `executeTool()` with tool name + args
5. Server executes the tool (calls appropriate service layer)
6. Tool result sent back to Gemini
7. Gemini returns **structured JSON response** (see Response Format below)
8. Client parses JSON and renders:
   - Text → Markdown in message bubble
   - Categories → Responsive grid of icon pills (MUI Grid: xs: 6, sm: 4, md: 3)
   - Accounts → Responsive grid of cards (MUI Grid: xs: 12, sm: 6)

---

## Available Tools

**All Users (6 tools):**

| Tool | Returns | Primary Use |
|------|---------|-------------|
| `getTransactions` | Array of transaction objects with pre-formatted markdown table | Filter/search transactions by date, category, type, account |
| `getTransactionSummary` | {totalIncome, totalExpense, byCategory} | Monthly expense/income breakdown |
| `getAccounts` | Array of bank accounts with balances | View all accounts and balances |
| `getCategories` | Array of spending categories (fetches ALL if type not specified) | List income/expense categories |
| `getPaymentMethods` | Array of payment methods | View credit cards, transfers, PayPal, etc. |
| `getBudgets` | Array of monthly budgets (assumes current month/year if not specified) | Check spending budgets for categories |

**Admin Users Only (+ 2 additional):**

| Tool | Returns | Use |
|------|---------|-----|
| `getAvailableModels` | List of available AI models and supported methods | Check supported models and methods |
| `checkApiQuota` | Current API usage and quota status | Monitor Gemini API quota |

---

## Request / Response Contract

**Client → Server:**
```
POST /api/chat
{
  message: string,                      // User's question/request
  conversationHistory?: [{              // Full chat history (for context)
    role: 'user' | 'assistant',
    content: string
  }],
  currentDate?: string,                 // ISO date (e.g., "2026-03-10")
  currentYear?: number,                 // e.g., 2026
  currentMonth?: number                 // 0=Jan, 11=Dec
}
```

**Server → Client (success):**
```
{
  success: true,
  data: {
    message: string,        // The text portion of the response
    model: string,          // Which model was used (e.g., "gemini-2.5-flash-lite")
    parsed: {               // Structured response for rich rendering
      type: "text" | "categories" | "accounts",
      text: string,         // Always present: markdown text or summary
      categories?: Array,   // Present if type === "categories"
      accounts?: Array      // Present if type === "accounts"
    }
  }
}
```

**Response Examples:**

*Text response:*
```json
{
  "type": "text",
  "text": "## Your March Spending\n\nYou spent **$1,250** this month..."
}
```

*Categories response:*
```json
{
  "type": "categories",
  "text": "Here are all your categories:",
  "categories": [
    {
      "_id": "123",
      "name": "Groceries",
      "type": "Expense",
      "color": "#ff9800",
      "icon": "LocalGroceryStore"
    }
    // ... more categories
  ]
}
```

*Accounts response:*
```json
{
  "type": "accounts",
  "text": "Here are your accounts:",
  "accounts": [
    {
      "_id": "456",
      "name": "Checking Account",
      "balance": 5000,
      "institution": "Bank Name",
      "isPrimary": true,
      "icon": "AccountBalance"
    }
    // ... more accounts
  ]
}
```

---

## Model Fallback Strategy (Quota Management)

**Problem:** Gemini free tier has strict quotas (e.g., 20 requests/day for some models).

**Solution:** Automatic model fallback chain based on availability/quota.

**Model Fallback Order:**
1. `gemini-2.5-flash-lite` — Cheapest, fastest (tried first)
2. `gemini-2.0-flash` — Balanced
3. `gemini-2.5-flash` — Standard
4. `gemini-2.5-pro` — Most capable (fallback for critical requests)

**How it works in `chatService.ts`:**
- Each message attempt tries the first model in the chain
- If model returns 429 (quota exceeded), automatically try the next model
- If all models are exhausted, return quota-exceeded error to client
- Client sees: "Sorry, I encountered an error: All AI models quota exceeded"

**Detection logic:**
```typescript
const isQuotaError = (message: string) =>
  message.includes('429') ||
  message.includes('quota') ||
  message.includes('RESOURCE_EXHAUSTED');
```

**See:** `services/chatService.ts` → `generateWithFallback()` function

---

## System Prompt Improvements

Gemini receives explicit instructions about:

**Date Handling (CRITICAL):**
- "this month" → use current month (no asking user)
- "last month" → previous month automatically
- "budgets" without date → assume current month/year
- "transactions" without date → assume current month/year

**Tool Usage Rules:**
- `getCategories`: fetch ALL categories (don't filter by type unless user specifies income/expense)
- `getBudgets`: assume current month/year if not specified
- `getTransactions`: assume current month/year if not specified

**Response Format (JSON CRITICAL):**
- Gemini MUST return structured JSON with `{ type, text, [categories|accounts]? }`
- For categories/accounts: respond with ONLY JSON (no markdown wrapping)
- For text: JSON with type="text" and markdown in text field

See: `services/chatService.ts` → `systemInstruction` variable

---

## Client Rendering

**File Structure:** `pages/Chat/`
```
ChatInput.tsx
├── ChatHeader.tsx
├── ChatMessageList.tsx
│   └── BudgetCard.tsx
│       ├── ReactMarkdown (for type=text)
│       ├── ChatCategoryPills.tsx (for type=categories)
│       └── ChatAccountCards.tsx (for type=accounts)
├── ChatInput.tsx
└── types/Chat.ts
```

**Key Rendering Logic:**

`BudgetCard.tsx` checks `message.parsed.type`:
- **"text"** → Renders markdown content in message bubble
- **"categories"** → Renders `ChatCategoryPills` (MUI Grid: xs: 6, sm: 4, md: 3)
- **"accounts"** → Renders `ChatAccountCards` (MUI Grid: xs: 12, sm: 6)

**Grid Layout (why not Row+flexWrap):**
- MUI Grid handles responsive wrapping without gaps
- Pills: 2 per row on mobile, 3 on tablet, 4 on desktop
- Cards: Full width on mobile, 2 per row on tablet+
- See `.github/mui.md` for Grid best practices

**Markdown Features:**
- Tables (using `remark-gfm` plugin)
- **bold**, *italic*, `code`
- Lists, headers, emphasis
- Transaction tables render automatically from formatted field

---

## Architecture Overview

**Client:** `pages/Chat/`
- `ChatInput.tsx` — Orchestrates state, sends messages, captures `parsed` response
- `ChatMessageList.tsx` — Scrollable message container
- `BudgetCard.tsx` — Renders messages based on `parsed.type` (text/categories/accounts)
- `ChatInput.tsx` — Text input + send button
- `ChatCategoryPills.tsx` — Grid of category icon pills (xs: 6, sm: 4, md: 3)
- `ChatAccountCards.tsx` — Grid of account cards (xs: 12, sm: 6)
- `types/Chat.ts` — ChatMessage with `parsed?: ParsedChatResponse`

**Server:** Gemini integration
- `controllers/chatController.ts` — POST `/api/chat`, calls service, returns message + model + parsed
- `services/chatService.ts` — Manages conversation loop with automatic model fallback
  - `chat()` — Main function, handles model fallback chain
  - `generateWithFallback()` — Tries models in order, catches quota errors
  - `executeTool()` — Routes tool requests to data services, returns JSON

**Data Services:** (called via tools in `executeTool()`)
- `transactionService.ts` → `findAll()`, `getTransactionSummary()`
- `accountService.ts` → `findAll()` (returns account array)
- `categoryService.ts` → `findAll()` (returns category array, ALL types unless filtered)
- `paymentMethodService.ts` → `findAll()`
- `budgetService.ts` → `findAll()` (defaults to current month/year)

**Tool Result Processing:**
- Array results wrapped as `{ data: [...] }` (Gemini API requirement)
- Categories/Accounts collected and passed to client as parsed response
- Gemini returns JSON with type="categories"|"accounts" when applicable

---

## Key Behaviors & Edge Cases

**Tool Loop (max 10 iterations):**
- Prevents infinite loops if Gemini keeps calling tools
- Stops when Gemini returns text response (no more function calls)

**Conversation History:**
- Full chat history sent with each request
- Allows Gemini to maintain context
- For 50+ messages, consider summarization to reduce tokens

**Categories Tool:**
- **Important:** If user asks for "categories" without specifying type, fetch ALL (income + expense)
- Do NOT ask user which type; system prompt forces this behavior
- Client renders all as icon pills in one responsive grid

**Accounts Tool:**
- Returns array of accounts with balances
- Client renders as responsive card grid
- Primary account highlighted with border and "Primary" badge

**Markdown Rendering:**
- `react-markdown` with `remark-gfm` plugin handles tables, lists, emphasis
- Transaction tool pre-formats table in `{ formatted: "| Date | ... |" }` field
- Gemini instructed to use pre-formatted table, not create own

**Role-Based Access:**
- Regular users: 6 data tools
- Admins: 6 data tools + `getAvailableModels` + `checkApiQuota`
- Role determined from JWT token

---

## Configuration

**Environment Variables (Server):**
```bash
GEMINI_API_KEY=your_api_key_here
```

**Model Selection:**
- Primary: `gemini-2.5-flash-lite` (free tier, quota ~20 req/day)
- Fallback chain ensures at least one model is available
- All models support function calling and tool use

**System Context (sent to Gemini):**
- Current date, year, month
- List of available tools
- Instructions for date handling and response format
- Role-based tool access

---

## Error Handling

| Error Type | Handling | User Message |
|------------|----------|--------------|
| 429 Quota | Try next model in fallback chain | "All AI models quota exceeded, try later" |
| Rate limit | Return immediately | "Too many requests, wait a moment" |
| Tool execution | Return error in tool result | "Tool execution failed: [error details]" |
| JSON parsing | Default to plain text response | Generic error message |
| Generic | Catch and log | "Unable to process request, try again" |

See: `services/chatService.ts` → error handling in `catch` block

---

## When to Update This Doc

**DO update when:**
- New tools are added
- Response format/structure changes
- Model fallback strategy changes
- Major architectural changes

**DO NOT update when:**
- Internal implementation details change (function logic, refactors)
- Just update source files instead, doc stays high-level

---

## Quick Reference: File Changes for Feature Additions

**To add a new tool:**
1. Create tool schema in `chatService.ts` (define input/output)
2. Register tool with `mcpServer.registerTool()`
3. Add case in `executeTool()` switch statement
4. Map to data service call
5. Return JSON result
6. Update this doc: Add tool to Available Tools table

**To change response format:**
1. Update `ParsedChatResponse` type in `types/Chat.ts`
2. Update `chatService.ts` response parsing logic
3. Update `BudgetCard.tsx` rendering logic
4. Update this doc: Response Examples section

**To add a new breakpoint behavior:**
1. Update Grid `size` props in `ChatCategoryPills.tsx` or `ChatAccountCards.tsx`
2. Test on real devices at breakpoints (sm, md, lg)
3. Update `.github/mui.md` if it's a new pattern
