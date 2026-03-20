import { alpha, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
  isActive: boolean;
}

const ProcessStep = ({ icon, title, description, accentColor, isActive }: ProcessStepProps) => {
  const theme = useTheme();

  return (
    <Column spacing={2} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
      <Row spacing={2} alignItems={'center'}>
        <Column
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 48,
            height: 48,
            minHeight: 48,
            minWidth: 48,
            borderRadius: 2,
            backgroundColor: isActive
              ? alpha(accentColor, 0.16)
              : alpha(theme.palette.text.primary, 0.05),
            border: `1.5px solid ${isActive ? alpha(accentColor, 0.35) : alpha(theme.palette.divider, 0.2)}`,
            color: isActive ? accentColor : theme.palette.text.secondary,
            '& svg': { fontSize: 24 },
            transition: 'all 0.4s ease',
          }}
        >
          {icon}
        </Column>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {title}
        </Typography>
      </Row>
      <Column spacing={1}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', lineHeight: 1.8, maxWidth: 320 }}
        >
          {description}
        </Typography>
      </Column>
    </Column>
  );
};

export default ProcessStep;
