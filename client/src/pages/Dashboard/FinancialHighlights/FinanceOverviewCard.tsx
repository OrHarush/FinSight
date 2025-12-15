import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { SvgIconComponent } from '@mui/icons-material';
import FinanceOverviewCardSkeleton from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCardSkeleton';
import { ReactNode } from 'react';

interface FinanceOverviewCardProps {
  headerTitle: string;
  primaryValue: ReactNode;
  secondaryText?: string;
  icon: SvgIconComponent;
  color: string;
  isLoading: boolean;
  isPrimary?: boolean;
}

const FinanceOverviewCard = ({
  headerTitle,
  primaryValue,
  secondaryText,
  icon: Icon,
  isLoading,
  color = '#8b5cf6',
  isPrimary = false,
}: FinanceOverviewCardProps) => (
  <Grid size={{ xs: 12, md: 4 }}>
    <Card
      sx={{
        minHeight: 120,
        minWidth: '200px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: isPrimary ? `1px solid ${color}` : 'default',
        boxShadow: isPrimary ? `0 0 0 1px ${color}40` : 'default',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${color}22`,
        },
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          p: 2.5,
          pb: '20px !important',
        }}
      >
        {isLoading ? (
          <FinanceOverviewCardSkeleton />
        ) : (
          <Column height="100%" spacing={1.5}>
            <Row spacing={2} alignItems={'center'}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: `${color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                }}
              >
                <Icon sx={{ fontSize: 24, color }} />
              </Box>
              <Column>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    letterSpacing: '0.5px',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  {headerTitle}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: color,
                    lineHeight: 1.2,
                    letterSpacing: '-0.5px',
                  }}
                >
                  {primaryValue}
                </Typography>
              </Column>
            </Row>
            {secondaryText && (
              <Typography
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '2.6em',
                }}
              >
                {secondaryText}
              </Typography>
            )}
          </Column>
        )}
      </CardContent>
    </Card>
  </Grid>
);

export default FinanceOverviewCard;
