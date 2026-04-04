export const getBudgetProgressColor = (percent: number, theme: Theme) => {
  if (percent >= 90) return theme.palette.error.main;
  if (percent >= 75) return theme.palette.warning.main;
  return theme.palette.grey[600];
};
