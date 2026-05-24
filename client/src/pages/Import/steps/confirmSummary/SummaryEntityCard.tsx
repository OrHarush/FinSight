import { SvgIconComponent } from '@mui/icons-material';
import { Paper, Typography } from '@mui/material';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

import { getEntityCardStyle, getEntityIconTileStyle } from './styles';

interface SummaryEntityCardProps {
  icon: SvgIconComponent;
  label: string;
  value: string;
}

const SummaryEntityCard = ({ icon: Icon, label, value }: SummaryEntityCardProps) => (
  <Paper variant="outlined" sx={getEntityCardStyle}>
    <Row spacing={1.5} alignItems="center">
      <Column alignItems="center" justifyContent="center" sx={getEntityIconTileStyle}>
        <Icon sx={{ fontSize: 20, color: 'primary.main' }} />
      </Column>
      <Column spacing={0.25} sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography fontWeight={600} noWrap>
          {value}
        </Typography>
      </Column>
    </Row>
  </Paper>
);

export default SummaryEntityCard;
