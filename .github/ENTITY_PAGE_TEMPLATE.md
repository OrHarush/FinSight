# Entity Page Template

## Folder Structure

```
pages/EntityName/
├── index.tsx
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

## 1. index.tsx — Orchestration only

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

---

## 2. EntityPageContent.tsx — State coordinator

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

---

## 3. EntityList.tsx — Pure rendering

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

---

## 4. EntityDialogManager.tsx — Conditional rendering only

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

---

## 5. EntityForm.tsx — Pure fields

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

---

## 6. CreateEntityDialog.tsx

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

---

## 7. EditEntityDialog.tsx

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

## 📁 Folder Structure

```
pages/EntityName/
├── components/                    # Small, reusable UI pieces
│   ├── EntityDialog.tsx           # Dialog form (create/edit combined or separate)
│   ├── EntityRow.tsx              # Individual row/card component
│   ├── EntitySkeleton.tsx         # Loading skeleton
│   └── [entity-specific components]
├── EntityDialogManager.tsx        # Manages dialog rendering logic
├── EntityPageContent.tsx          # State coordinator (loading/error/empty/success)
└── index.tsx                      # Main orchestrator (STANDARD for all entities)
```

---

## 📋 File Responsibilities

### 1. **index.tsx** - Main Orchestrator
**Purpose**: Pure orchestration - state management and layout only

**Responsibilities**:
- Manage dialog open/close state
- Manage selected entity state
- Define event handlers
- Compose layout structure
- NO data fetching, NO business logic, NO rendering logic

**Standard Structure**:
```
const EntityPage = () => {
  const { t } = useTranslation('entities');
  const isMobile = useIsMobile();
  const [isCreateDialogOpen, openCreateDialog, closeCreateDialog] = useOpen();
  const [selectedEntity, setSelectedEntity] = useState<EntityDto>();

  const handleSelectEntity = (entity: EntityDto) => {
    setSelectedEntity(entity);
  };

  const handleCloseEdit = () => {
    setSelectedEntity(undefined);
  };

  return (
    <PageLayout>
      <PageHeader entityName={'entities'}>
        {!isMobile && (
          <Button variant={'contained'} onClick={openCreateDialog} startIcon={<AddIcon />}>
            {t('actions.create')}
          </Button>
        )}
      </PageHeader>
      <EntityPageContent selectEntity={handleSelectEntity} />
      <ActionFab onClick={openCreateDialog} />
      <EntityDialogManager
        isCreateOpen={isCreateDialogOpen}
        selectedEntity={selectedEntity}
        onCloseCreate={closeCreateDialog}
        onCloseEdit={handleCloseEdit}
      />
    </PageLayout>
  );
};
```

---

### 2. **EntityPageContent.tsx** - State Coordinator
**Purpose**: Handle all UI states (loading, error, empty, success)

**Responsibilities**:
- Fetch data using custom hook
- Render appropriate component based on state
- Use early returns for each state
- Delegate actual rendering to list/grid components

**Standard Structure**:
```
const EntityPageContent = ({ selectEntity }: EntityPageContentProps) => {
  const { data: entities, isLoading, error, refetch } = useEntities();

  if (error) {
    return <EntityError entityName="entities" refetch={refetch} />;
  }

  if (isLoading) {
    return <EntitySkeleton />;
  }

  if (!entities?.length) {
    return <EntityEmpty entityName="entities" icon={EntityIcon} />;
  }

  return <EntityList entities={entities} selectEntity={selectEntity} />;
};
```

---

### 3. **EntityDialogManager.tsx** - Dialog Manager
**Purpose**: Manage dialog rendering logic

**Responsibilities**:
- Conditionally render create and edit dialogs
- Pass props to dialog components
- NO mutation logic (handled inside dialog components)

**Standard Structure**:
```
interface EntityDialogManagerProps {
  isCreateOpen: boolean;
  selectedEntity?: EntityDto;
  onCloseCreate: () => void;
  onCloseEdit: () => void;
}

const EntityDialogManager = ({
  isCreateOpen,
  selectedEntity,
  onCloseCreate,
  onCloseEdit,
}: EntityDialogManagerProps) => (
  <>
    {isCreateOpen && <CreateEntityDialog isOpen={isCreateOpen} closeDialog={onCloseCreate} />}
    {selectedEntity && (
      <EditEntityDialog
        isOpen={!!selectedEntity}
        closeDialog={onCloseEdit}
        entity={selectedEntity}
      />
    )}
  </>
);
```

---

### 4. **EntityList.tsx** - Rendering Logic
**Purpose**: Pure rendering component

**Responsibilities**:
- Map over entities and render rows/cards
- Pass event handlers to child components
- NO data fetching, NO state management

**Standard Structure**:
```
const EntityList = ({ entities, selectEntity }: EntityListProps) => (
  <Column spacing={2}>
    {entities.map(entity => (
      <EntityRow key={entity.id} entity={entity} onSelect={() => selectEntity(entity)} />
    ))}
  </Column>
);
```

---

## ✅ Naming Conventions

### Variables
- `isCreateDialogOpen` - Dialog open state
- `selectedEntity` - Currently selected entity for editing
- `handleSelectEntity` - Handler to select entity
- `handleCloseEdit` - Handler to close edit dialog

### Functions
- `openCreateDialog` - Opens create dialog
- `closeCreateDialog` - Closes create dialog
- `selectEntity` - Prop function to select entity

### Props
- `isCreateOpen` - Boolean for create dialog
- `selectedEntity` - Selected entity or undefined
- `onCloseCreate` - Close create dialog callback
- `onCloseEdit` - Close edit dialog callback

---

## 🔄 Applying the Template

To create a new entity page or refactor an existing one:

1. **Replace placeholders**:
   - `Entity` → `Category`, `Account`, `Transaction`, etc.
   - `entities` → `categories`, `accounts`, `transactions`, etc.
   - `EntityDto` → `CategoryDto`, `AccountDto`, etc.
   - `useEntities` → `useCategories`, `useAccounts`, etc.

2. **Keep structure identical** - Don't deviate from template unless entity has special requirements

3. **Follow naming conventions** - Use exact variable/function names

---

## 🚫 Anti-Patterns to Avoid

❌ **DON'T** inline dialog components in index.tsx:
```
// BAD
{isCreateDialogOpen && <CreateDialog ... />}
{selectedEntity && <EditDialog ... />}
```

✅ **DO** use DialogManager:
```
// GOOD
<EntityDialogManager
  isCreateOpen={isCreateDialogOpen}
  selectedEntity={selectedEntity}
  onCloseCreate={closeCreateDialog}
  onCloseEdit={handleCloseEdit}
/>
```

---

❌ **DON'T** mix state handling in index.tsx:
```
// BAD - rendering logic in orchestrator
{isLoading ? <Skeleton /> : <List />}
```

✅ **DO** delegate to PageContent:
```
// GOOD - delegate to state coordinator
<EntityPageContent selectEntity={handleSelectEntity} />
```

---

❌ **DON'T** fetch data in index.tsx:
```
// BAD
const { data } = useEntities();
```

✅ **DO** fetch in PageContent:
```
// GOOD - data fetching in state coordinator
// index.tsx has NO data fetching
```

---

