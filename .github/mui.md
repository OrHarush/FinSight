## Use the mui-mcp server to answer any MUI questions

- 1. call the "useMuiDocs" tool to fetch the docs of the package relevant in the question
- 2. call the "fetchDocs" tool to fetch any additional docs if needed using ONLY the URLs present in the returned content.
- 3. repeat steps 1-2 until you have fetched all relevant docs for the given question
- 4. use the fetched content to answer the question

---

# MUI Grid Usage Guide

This document explains how to use MUI Grid correctly in this project for responsive layouts.

## Modern MUI Grid API (v5+)

We use the modern MUI Grid API with the `size` prop for responsive layouts. This is the current standard.

### Basic Structure

```tsx
import { Grid } from '@mui/material';

<Grid container spacing={2}>
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    {/* Content takes full width on mobile (12), half on tablet (6), 1/3 on desktop (4) */}
  </Grid>
</Grid>
```

### Grid Props Breakdown

| Prop | Type | Purpose |
|------|------|---------|
| `container` | boolean | Marks this Grid as a container (parent) |
| `spacing` | number | Gap between grid items (in theme spacing units) |
| `size` | object | Responsive sizes: `{ xs, sm, md, lg, xl }` (out of 12 columns) |
| `sx` | object | MUI sx prop for custom styling |

### Responsive Breakpoints

MUI Grid uses a 12-column system. Specify how many columns to occupy at each breakpoint:

```tsx
size={{ 
  xs: 12,  // Mobile: full width (all 12 columns)
  sm: 6,   // Tablet: half width (6 out of 12 columns)
  md: 4,   // Desktop: 1/3 width (4 out of 12 columns)
  lg: 3,   // Large: 1/4 width (3 out of 12 columns)
}}
```

## Real-World Examples from FinSight

### Example 1: Category Pills (Chat Component)

**File**: `src/pages/Chat/components/ChatCategoryPills.tsx`

```tsx
<Grid container spacing={1} sx={{ mt: 0.5 }}>
  {categories.map(category => (
    <Grid key={category._id} size={{ xs: 6, sm: 4, md: 3 }}>
      <Chip
        icon={<IconComponent sx={{ color: category.color }} />}
        label={category.name}
        variant="outlined"
        size="small"
        sx={{
          borderColor: 'divider',
          width: '100%',
          height: 'auto',
        }}
      />
    </Grid>
  ))}
</Grid>
```

**Responsive Behavior**:
- **Mobile (xs: 6)**: 2 pills per row (2 × 6 cols = 12 cols)
- **Tablet (sm: 4)**: 3 pills per row (3 × 4 cols = 12 cols)
- **Desktop (md: 3)**: 4 pills per row (4 × 3 cols = 12 cols)
- **No gaps on wrapping** thanks to Grid's proper spacing system

### Example 2: Account Cards (Chat Component)

**File**: `src/pages/Chat/components/ChatAccountCards.tsx`

```tsx
<Grid container spacing={1} sx={{ mt: 0.5 }}>
  {accounts.map(account => (
    <Grid key={account._id} size={{ xs: 12, sm: 6 }}>
      <Card>{/* Account card content */}</Card>
    </Grid>
  ))}
</Grid>
```

**Responsive Behavior**:
- **Mobile (xs: 12)**: Cards stack vertically (full width)
- **Tablet+ (sm: 6)**: Two cards per row (half width each)

### Example 3: Categories Layout (Categories Page)

**File**: `src/pages/Categories/CategoryList.tsx`

```tsx
<Grid container spacing={4}>
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="h6">{t('incomeCategories')}</Typography>
    <Grid container spacing={2}>
      {incomeCategories.map(category => (
        <CategoryCard key={category._id} category={category} {...props} />
      ))}
    </Grid>
  </Grid>
  
  <Grid size={{ xs: 12, md: 6 }}>
    <Typography variant="h6">{t('expenseCategories')}</Typography>
    <Grid container spacing={2}>
      {expenseCategories.map(category => (
        <CategoryCard key={category._id} category={category} {...props} />
      ))}
    </Grid>
  </Grid>
</Grid>
```

**Responsive Behavior**:
- **Mobile (xs: 12)**: Single column layout (stacked)
- **Desktop (md: 6)**: Two columns side-by-side
- Nested Grid containers allow complex hierarchical layouts

## Common Grid Patterns

### Pattern 1: Simple Card Grid

Use when you have multiple cards of equal size that should wrap:

```tsx
<Grid container spacing={2}>
  {items.map(item => (
    <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
      <Card>{item.content}</Card>
    </Grid>
  ))}
</Grid>
```

### Pattern 2: Layout with Sidebar

Use for layouts with a main content area and sidebar:

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 8 }}>
    {/* Main content */}
  </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
    {/* Sidebar */}
  </Grid>
</Grid>
```

### Pattern 3: Nested Grids

Use for complex nested layouts with different spacing:

```tsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 6 }}>
    <Grid container spacing={2}>
      {/* Nested items with tighter spacing */}
    </Grid>
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    {/* Other content */}
  </Grid>
</Grid>
```

### Pattern 4: Multi-column with Responsive Wrapping

Use for elements that should wrap naturally based on space:

```tsx
<Grid container spacing={1}>
  {items.map(item => (
    <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
      {/* Item that takes 1/2 width on mobile, 1/3 on tablet, etc. */}
    </Grid>
  ))}
</Grid>
```

## Why NOT to Use Row/Column with flexWrap

❌ **Bad** — Causes gaps and alignment issues on wrapping:

```tsx
<Row flexWrap="wrap" spacing={2}>
  {items.map(item => (
    <Box sx={{ width: '50%' }}>{item}</Box>
  ))}
</Row>
```

**Problems**:
- Spacing doesn't adjust for wrapping
- Manual width calculation is fragile
- Responsive changes require Box-level sx updates
- Gaps appear awkwardly between rows

✅ **Good** — Proper spacing with Grid:

```tsx
<Grid container spacing={2}>
  {items.map(item => (
    <Grid key={item.id} size={{ xs: 12, sm: 6 }}>
      {item}
    </Grid>
  ))}
</Grid>
```

**Benefits**:
- Automatic spacing that works on wrapping
- Responsive sizes defined once
- Clean, semantic layout structure
- No gap issues

## Spacing Values Reference

Common spacing values (in theme units, typically 8px base):

| Value | Pixels | Use Case |
|-------|--------|----------|
| 0.5 | 4px | Tight spacing between small elements (badges, chips) |
| 1 | 8px | Default small gap between items |
| 2 | 16px | Standard gap between sections |
| 3 | 24px | Large gap between major sections |
| 4 | 32px | Extra large gap, rarely used |

**In ChatCategoryPills**: `spacing={1}` = 8px gap between pills
**In ChatAccountCards**: `spacing={1}` = 8px gap between cards
**In CategoryList**: `spacing={4}` = 32px gap between income/expense columns

## Tips & Best Practices

1. **Always use `size` prop** for responsive behavior — never hardcode pixel widths in Grid items
2. **Set `width: '100%'` on children** (Cards, Chips, etc.) to fill the Grid column space
3. **Use `height: '100%'`** on nested cards to align them vertically
4. **Match spacing across components** — typically use 1-3 for consistency
5. **Test at all breakpoints** — sm (600px), md (960px), lg (1280px), xl (1920px)
6. **Avoid nesting too deeply** — keep layouts flat when possible for better readability
7. **Use `spacing={1}` for dense layouts** (chips, pills, small cards)
8. **Use `spacing={2-4}` for spacious layouts** (large cards, main sections)

## Breakpoint Reference

MUI default breakpoints:

| Key | Min Width | Description |
|-----|-----------|-------------|
| `xs` | 0px | Mobile (default, always applies) |
| `sm` | 600px | Tablet portrait |
| `md` | 960px | Tablet landscape / small desktop |
| `lg` | 1280px | Desktop |
| `xl` | 1920px | Large desktop |

When you specify `size={{ xs: 12, sm: 6 }}`:
- Below 600px: use `xs: 12` (full width)
- 600px and above: use `sm: 6` (half width)

## Migration Guide: Old API → New API

If you find old Grid code using the deprecated `item` and `xs` props directly:

```tsx
// ❌ OLD (deprecated)
<Grid item xs={12} sm={6} md={4}>
  Content
</Grid>

// ✅ NEW (current standard)
<Grid size={{ xs: 12, sm: 6, md: 4 }}>
  Content
</Grid>
```

Update all Grid items to use the `size` prop.

## References

- [MUI Grid Documentation](https://mui.com/material-ui/react-grid/)
- [MUI Breakpoints](https://mui.com/material-ui/customization/breakpoints/)
- [MUI Spacing System](https://mui.com/material-ui/customization/spacing/)

