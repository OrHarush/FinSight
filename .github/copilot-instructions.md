Clean Code & SOLID:
- Every function must do ONE thing only. If a function does more than one thing, split it.
- Side effects must be isolated. Pure logic (calculations, transformations) must never mix
  with I/O, DB calls, or state mutations in the same function.
- Error handling belongs in its own function or layer. Never mix happy-path logic
  with try/catch blocks in the same function body.
- Single Responsibility: if you need to describe a function with "and", it's wrong.
- Never suggest inline error handling inside business logic functions.
- Dependency Inversion: depend on abstractions (interfaces/types), not concrete implementations.