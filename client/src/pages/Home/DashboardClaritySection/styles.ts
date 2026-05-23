import { alpha, type Theme } from '@mui/material';

import { type AnnotationColor } from '@/pages/Home/DashboardClaritySection/constants';

export const getAnnotationAccent = (theme: Theme, color: AnnotationColor) => {
  if (color === 'purple') {
    return theme.palette.primary.main;
  }

  return theme.palette.secondary.main;
};

export const getAnnotationCardStyle = (theme: Theme, color?: AnnotationColor) => {
  const borderColor = color
    ? alpha(getAnnotationAccent(theme, color), 0.45)
    : 'rgba(148, 163, 184, 0.12)';

  return {
    backgroundColor: '#151b24',
    border: `1px solid ${borderColor}`,
    borderRadius: '16px',
    p: 2.25,
  };
};
