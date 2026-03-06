Clean Code & SOLID:
- Every function must do ONE thing only. If a function does more than one thing, split it.
- Side effects must be isolated. Pure logic (calculations, transformations) must never mix
  with I/O, DB calls, or state mutations in the same function.
- Error handling belongs in its own function or layer. Never mix happy-path logic
  with try/catch blocks in the same function body.
- Single Responsibility: if you need to describe a function with "and", it's wrong.
- Never suggest inline error handling inside business logic functions.
- Dependency Inversion: depend on abstractions (interfaces/types), not concrete implementations.
- Don't create wrapper containers if not needed (for example for Typography), try to add style to component directly,
- For loading states use skeletons and create separate components for them, don't mix loading state with actual component logic.
- Use Row and Column components for layout instead of divs, boxes or stacks. They are MUI Stack component with corresponding flex direction.
- Don't use vh or vw units for font sizes, they are not responsive and can cause accessibility issues. Use % or rem instead.
- Don't use one line if return. Add curly braces and new lines for better readability, even for simple returns.
- Before ifs and returns statements add a new line. 

React Component Patterns:
- For orchestration components that handle multiple UI states (loading, error, empty, success):
  Use early returns with separate components for each state.
  Keep orchestration components focused solely on state coordination, not rendering logic.
  Each state should render a dedicated component, not inline JSX.

- **ENTITY PAGES MUST FOLLOW THE STANDARD TEMPLATE** (see ENTITY_PAGE_TEMPLATE.md for full details):
  
  Mandatory structure:
  1. **index.tsx** - Orchestration only (state + handlers + layout, NO data fetching)
  2. **EntityPageContent.tsx** - State coordinator (loading/error/empty/success with early returns)
  3. **EntityList.tsx** - Pure rendering (map data to components)
  4. **EntityDialogManager.tsx** - Dialog manager (conditionally render create/edit dialogs)
  5. **components/dialogs/** - `CreateEntityDialog.tsx` and `EditEntityDialog.tsx`
  
  Required naming:
  - State: `isCreateDialogOpen`, `selectedEntity`
  - Functions describe what they do — never prefix with `handle` or `on` for internal functions:
    - `openCreateDialog`, `closeCreateDialog`, `closeEditDialog`, `selectEntity`
  - Props: `isCreateOpen`, `closeCreateDialog`, `closeEditDialog`

Function Naming:
- Name functions after what they do, not who calls them.
- Never prefix internal functions with `handle` or `on`.
- Correct: `openCreateDialog`, `closeCreateDialog`, `selectEntity`, `submitCreate`
- Wrong: `handleClose`, `onCloseCreate`, `handleSelectEntity`, `onSave`

Entity Form & Dialog Conventions:
- Always use `TextInput` (from `@/components/shared/inputs/TextInput`) instead of raw MUI `TextField`. It integrates with `useFormContext` automatically.
- Dialogs must extend `BaseDialogProps` from `@/components/dialogs/FinSightDialog`.
- Every entity must have a dedicated `EntityForm` component (pure fields, no submit logic).
- Create and Edit dialogs are separate files: `CreateEntityDialog.tsx` and `EditEntityDialog.tsx`.
- Both dialogs use `FormProvider` + `useForm` wrapping `FormDialog`, which handles submit/reset/cancel.
- `EditEntityDialog` receives the entity as a prop and pre-fills `defaultValues`.
- Place dialogs in `pages/EntityName/components/dialogs/`.
- Mutation logic lives in the dialog, not in the dialog manager.
- `EntityDialogManager` is purely conditional rendering — no logic, no hooks.

