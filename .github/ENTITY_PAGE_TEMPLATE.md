# Entity Page Structure Template

This document defines the **standard structure** for all entity pages in FinSight.

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

## 📊 Benefits

1. **Consistency** - All entity pages look and work the same
2. **Maintainability** - Easy to update all pages by updating template
3. **Testability** - Small, focused components are easy to test
4. **Predictability** - Developers know exactly where to find logic
5. **Scalability** - Easy to add new entity pages

---

## 📝 Current Status

✅ **Categories** - Follows template
✅ **Accounts** - Follows template
✅ **PaymentMethods** - Follows template
✅ **Budgets** - Follows template (with special date filtering in header)
⏳ **Transactions** - Special case (complex filters, different dialog manager pattern)

