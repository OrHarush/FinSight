import { Card, CardContent, Typography, Box, Grid, useTheme } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { SvgIconComponent } from '@mui/icons-material';
import FinanceOverviewCardSkeleton from '@/components/unusedComponents/FinancialHighlights/FinanceOverviewCardSkeleton';
import { ReactNode } from 'react';

interface FinanceOverviewCardProps {
  headerTitle: string;
  primaryValue: ReactNode;
  secondaryText?: string;
  icon: SvgIconComponent;
  isLoading: boolean;
  isCritical?: boolean;
  criticalColor?: string;
}

const FinanceOverviewCard = ({
  headerTitle,
  primaryValue,
  secondaryText,
  icon: Icon,
  isLoading,
  isCritical = false,
  criticalColor = '#ef4444',
}: FinanceOverviewCardProps) => {
  const theme = useTheme();

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card
        sx={{
          minHeight: 145,
          minWidth: '200px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${theme.palette.primary.dark}22`,
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
                    backgroundColor: `${theme.palette.primary.dark}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 24,
                      color: isCritical ? criticalColor : 'text.secondary',
                    }}
                  />{' '}
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
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '-0.5px',
                      color: isCritical ? criticalColor : 'text.primary',
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
};

export default FinanceOverviewCard;
