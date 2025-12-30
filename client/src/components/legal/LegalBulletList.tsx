import { Typography } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';

interface LegalBulletListProps {
  items: string[];
}

const LegalBulletList = ({ items }: LegalBulletListProps) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Column spacing={1} sx={{ paddingLeft: 2 }}>
      {items.map((item, index) => (
        <Row key={index} spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Typography variant="body1" sx={{ color: 'primary.main', minWidth: '8px' }}>
            •
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            {item}
          </Typography>
        </Row>
      ))}
    </Column>
  );
};

export default LegalBulletList;
