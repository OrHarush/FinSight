# Page Template Guide

This guide covers two page patterns used in FinSight:
1. **General Page Template** - For non-CRUD pages (Chat, Reports, etc.)
2. **Entity Page Template** - For CRUD pages (Categories, Accounts, etc.)

---

# General Page Template

For pages that don't follow a CRUD pattern (Chat, Reports, Planner, etc.).

## Folder Structure

```
pages/PageName/
├── ChatMessageList.tsx                      # Pure orchestration (state + layout)
├── PageNameContent.tsx            # State coordinator (loading/error/empty/success)
└── components/
    ├── FeatureComponent.tsx
    ├── AnotherComponent.tsx
    └── [other components]
```

## Components

### 1. ChatMessageList.tsx — Orchestration only

State management and layout only. No data fetching, no rendering logic.

```tsx
const PageName = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [state1, setState1] = useState<Type>();
  const [isLoading, setIsLoading] = useState(false);

  const handler1 = (value: Type) => setState1(value);
  const handler2 = () => setIsLoading(true);

  const pageContent = (
    <PageLayout>
      <PageHeader />
      <PageNameContent state={state1} isLoading={isLoading} />
      <PageFooter onAction={handler1} />
    </PageLayout>
  );
};
```

### 2. PageNameContent.tsx — State Coordinator

Early returns for each state. Coordinates what to render based on state.

```tsx
const PageNameContent = ({ state, isLoading }: PageNameContentProps) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!state) {
    return <EmptyState />;
  }

  return <ContentDisplay state={state} />;
};
```

### 3. Feature Components

Pure rendering components with no logic.

```tsx
const ContentDisplay = ({ state }: ContentDisplayProps) => (
  <Column spacing={2}>
    {/* Pure rendering based on props */}
  </Column>
);
```

## Example: Chat Page

Real example of a general page following this pattern.

```
pages/Chat/
├── ChatMessageList.tsx                      # State: messages, isLoading
├── ChatPageContent.tsx            # Early returns: empty → content
└── components/
    ├── ChatHeader.tsx
    ├── ChatInput.tsx              # Handles message sending
    ├── index.tsx
    ├── ChatMessageLayout.tsx
    ├── ChatCategoryPills.tsx
    ├── ChatAccountCards.tsx
    ├── ChatEmpty.tsx
    └── ChatLoadingSkeleton.tsx
```

**Key Points**:
- `ChatMessageList.tsx`: Manages messages array, isLoading, responsive layout
- `ChatPageContent`: Renders ChatEmpty if no messages, else ChatMessageList
- `ChatInput`: Contains message sending logic (sendMessage())
- `ChatMessageBubble`: Renders single message based on parsed type
- Feature components: Pure rendering, no logic

---

# Entity Page Template

For CRUD pages (Categories, Accounts, Budgets, etc.).

## Folder Structure

```
pages/EntityName/
├── ChatMessageList.tsx
├── EntityNamePageContent.tsx
├── EntityNameList.tsx
├── EntityNameDialogManager.tsx
└── components/
    ├── EntityNameForm.tsx
    └── dialogs/
        ├── CreateEntityNameDialog.tsx
        └── EditEntityNameDialog.tsx
```

---

## Components

### 1. ChatMessageList.tsx — Orchestration only

No data fetching. No rendering logic. State + handlers + layout only.

```tsx
const EntityPage = () => {
  const { t } = useTranslation('entity');
  const isMobile = useIsMobile();
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedEntity, setSelectedEntity] = useState<EntityDto>();

  const selectEntity = (entity: EntityDto) => setSelectedEntity(entity);
  const closeEditDialog = () => setSelectedEntity(undefined);

  return (
    <PageLayout>
      <PageHeader entityName="entity">
        {!isMobile && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
            {t('actions.create')}
          </Button>
        )}
      </PageHeader>
      <EntityPageContent selectEntity={selectEntity} />
      <ActionFab onClick={openCreateDialog} />
      <EntityDialogManager
        isCreateOpen={isCreateDialogOpen}
        selectedEntity={selectedEntity}
        closeCreateDialog={closeCreateDialog}
        closeEditDialog={closeEditDialog}
      />
    </PageLayout>
  );
};
```

### 2. EntityPageContent.tsx — State coordinator

Early returns for each state. No inline JSX — each state renders a dedicated component.

```tsx
const EntityPageContent = ({ selectEntity }: EntityPageContentProps) => {
  const { entities, isLoading, error, refetch } = useEntities();

  if (error) {
    return <EntityError entityName="entity" refetch={refetch} />;
  }

  if (isLoading) {
    return <EntityListSkeleton />;
  }

  if (!entities.length) {
    return <EntityEmpty entityName="entity" icon={SomeIcon} />;
  }

  return <EntityList entities={entities} selectEntity={selectEntity} />;
};
```

### 3. EntityList.tsx — Pure rendering

No hooks, no logic. Maps data to components.

```tsx
const EntityList = ({ entities, selectEntity }: EntityListProps) => (
  <Column spacing={2}>
    {entities.map(entity => (
      <EntityCard key={entity._id} entity={entity} onSelect={selectEntity} />
    ))}
  </Column>
);
```

### 4. EntityDialogManager.tsx — Conditional rendering only

No hooks, no logic, no mutations. Pure conditional rendering.

```tsx
const EntityDialogManager = ({
  isCreateOpen,
  selectedEntity,
  closeCreateDialog,
  closeEditDialog,
}: EntityDialogManagerProps) => (
  <>
    {isCreateOpen && (
      <CreateEntityDialog isOpen={isCreateOpen} closeDialog={closeCreateDialog} />
    )}
    {selectedEntity && (
      <EditEntityDialog
        isOpen={!!selectedEntity}
        closeDialog={closeEditDialog}
        entity={selectedEntity}
      />
    )}
  </>
);
```

### 5. EntityForm.tsx — Pure fields

Only form fields. No submit logic. Always use `TextInput`, never raw MUI `TextField`.

```tsx
const EntityForm = () => {
  const { t } = useTranslation('entity');

  return (
    <Column spacing={2}>
      <TextInput name="name" label={t('fields.name')} required />
    </Column>
  );
};
```

### 6. CreateEntityDialog.tsx

Extends `BaseDialogProps`. Mutation logic lives here.

```tsx
const CreateEntityDialog = ({ isOpen, closeDialog }: BaseDialogProps) => {
  const { t } = useTranslation('entity');
  const { alertSuccess, alertError } = useSnackbar();
  const methods = useForm<EntityFormValues>({ mode: 'all' });

  const createEntity = useApiMutation({
    method: 'post',
    url: API_ROUTES.ENTITY,
    queryKeysToInvalidate: [queryKeys.entities()],
  });

  const submitCreate = async (data: EntityFormValues) => {
    try {
      await createEntity.mutateAsync(data);
      alertSuccess(t('messages.createSuccess'));
    } catch {
      alertError(t('messages.createError'));
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog isOpen={isOpen} closeDialog={closeDialog} title={t('actions.create')} onSubmit={submitCreate}>
        <EntityForm />
      </FormDialog>
    </FormProvider>
  );
};
```

### 7. EditEntityDialog.tsx

Extends `BaseDialogProps`. Receives entity and pre-fills `defaultValues`.

```tsx
interface EditEntityDialogProps extends BaseDialogProps {
  entity: EntityDto;
}

const EditEntityDialog = ({ isOpen, closeDialog, entity }: EditEntityDialogProps) => {
  const { t } = useTranslation('entity');
  const { alertSuccess, alertError } = useSnackbar();

  const methods = useForm<EntityFormValues>({
    defaultValues: { name: entity.name },
    mode: 'all',
  });

  const updateEntity = useApiMutation({
    method: 'put',
    url: `${API_ROUTES.ENTITY}/${entity._id}`,
    queryKeysToInvalidate: [queryKeys.entities()],
  });

  const submitUpdate = async (data: EntityFormValues) => {
    try {
      await updateEntity.mutateAsync(data);
      alertSuccess(t('messages.updateSuccess'));
    } catch {
      alertError(t('messages.updateError'));
    }
  };

  return (
    <FormProvider {...methods}>
      <FormDialog isOpen={isOpen} closeDialog={closeDialog} title={t('actions.edit')} onSubmit={submitUpdate} isUpdateForm>
        <EntityForm />
      </FormDialog>
    </FormProvider>
  );
};
```

---

## Naming Conventions

Function names describe **what they do**, not who calls them. Never use `handle` or `on` prefixes for internal functions.

| Concept | Correct | Wrong |
|---------|---------|-------|
| Open create dialog | `openCreateDialog` | `handleCreate`, `onOpenCreate` |
| Close create dialog | `closeCreateDialog` | `handleCloseCreate`, `onCloseCreate` |
| Close edit dialog | `closeEditDialog` | `handleCloseEdit`, `onCloseEdit` |
| Select entity | `selectEntity` | `handleSelectEntity`, `onSetEntity` |
| Submit create form | `submitCreate` | `handleSubmit`, `onSave` |
| Submit update form | `submitUpdate` | `handleSubmit`, `onSave` |

### Props naming
Dialog manager props use the same descriptive names:
- `closeCreateDialog` — not `onCloseCreate`
- `closeEditDialog` — not `onCloseEdit`
- `selectEntity` — not `onSelectEntity`

---

## 🔄 Applying the Templates

### For a General Page (Chat, Reports, etc.):
1. Create `ChatMessageList.tsx` with state management
2. Create `PageNameContent.tsx` with early returns
3. Create feature components in `components/` folder
4. Keep all data logic in feature components
5. Follow separation of concerns

### For an Entity Page (Categories, Accounts, etc.):
1. Replace placeholders in template:
   - `Entity` → `Category`, `Account`, etc.
   - `entities` → `categories`, `accounts`, etc.
   - `EntityDto` → `CategoryDto`, `AccountDto`, etc.
   - `useEntities` → `useCategories`, `useAccounts`, etc.
2. Keep structure identical
3. Follow naming conventions exactly

---

## 🚫 Anti-Patterns to Avoid

❌ **DON'T** inline dialog components in ChatMessageList.tsx:
```tsx
// BAD
{isCreateDialogOpen && <CreateDialog ... />}
{selectedEntity && <EditDialog ... />}
```

✅ **DO** use DialogManager:
```tsx
// GOOD
<EntityDialogManager
  isCreateOpen={isCreateDialogOpen}
  selectedEntity={selectedEntity}
  closeCreateDialog={closeCreateDialog}
  closeEditDialog={closeEditDialog}
/>
```

---

❌ **DON'T** mix state handling in ChatMessageList.tsx:
```tsx
// BAD - rendering logic in orchestrator
{isLoading ? <Skeleton /> : <List />}
```

✅ **DO** delegate to PageContent:
```tsx
// GOOD - delegate to state coordinator
<EntityPageContent selectEntity={selectEntity} />
```

---

❌ **DON'T** fetch data in ChatMessageList.tsx:
```tsx
// BAD
const { data } = useEntities();
```

✅ **DO** fetch in PageContent:
```tsx
// GOOD - data fetching in state coordinator
// ChatMessageList.tsx has NO data fetching
```

---

❌ **DON'T** mix HTML structure components with layout logic:
```tsx
// BAD - layout logic in render
if (isDesktop) return <PageLayout>...</PageLayout>;
else return <Column>...</Column>;
```

✅ **DO** extract layout logic early or use responsive components:
```tsx
// GOOD - clean separation
<PageLayout shouldUseLayout={isDesktop}>
  {/* content */}
</PageLayout>
```

