import { Box, Typography, useTheme } from '@mui/material';
import { type ReactNode } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { type AnnotationColor } from '@/pages/Home/DashboardClaritySection/constants';
import {
  getAnnotationAccent,
  getAnnotationCardStyle,
} from '@/pages/Home/DashboardClaritySection/styles';

interface AnnotationCardProps {
  title: string;
  body?: string;
  color?: AnnotationColor;
  children?: ReactNode;
}

const AnnotationCard = ({ title, body, color, children }: AnnotationCardProps) => {
  const theme = useTheme();
  const accent = color ? getAnnotationAccent(theme, color) : undefined;

  return (
    <Column spacing={1} sx={getAnnotationCardStyle(theme, color)}>
      <Row spacing={1} alignItems="center">
        {accent && (
          <Box
            sx={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              backgroundColor: accent,
              flexShrink: 0,
            }}
          />
        )}
        <Typography
          sx={{ fontSize: '0.92rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.4 }}
        >
          {title}
        </Typography>
      </Row>
      {children ?? (
        <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.65, color: 'text.secondary' }}>
          {body}
        </Typography>
      )}
    </Column>
  );
};

export default AnnotationCard;
