import { SxProps, Theme } from '@mui/material';

export const getFaqAccordionStyle = (): SxProps<Theme> => ({
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '16px !important',
  backdropFilter: 'blur(20px)',
  boxShadow: 'none',
  transition: 'box-shadow 0.2s ease',
  '&::before': { display: 'none' },
  '&.Mui-expanded': {
    boxShadow: (theme: Theme) =>
      theme.palette.mode === 'dark'
        ? '0 4px 16px rgba(0, 0, 0, 0.2)'
        : '0 4px 16px rgba(15, 23, 42, 0.08)',
  },
  '& .MuiAccordionSummary-root': {
    minHeight: 64,
    px: 3,
    py: 0.5,
  },
  '& .MuiAccordionSummary-root.Mui-expanded': {
    minHeight: 64,
  },
  '& .MuiAccordionSummary-content': {
    my: 1.5,
  },
  '& .MuiAccordionSummary-content.Mui-expanded': {
    my: 1.5,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'text.secondary',
  },
  '& .MuiAccordionDetails-root': {
    px: 3,
    pb: 3,
    pt: 0,
  },
});
