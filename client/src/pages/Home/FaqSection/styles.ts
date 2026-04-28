import { SxProps, Theme } from '@mui/material';

export const getFaqAccordionStyle = (): SxProps<Theme> => ({
  bgcolor: 'rgba(21, 27, 36, 0.7)',
  border: '1px solid rgba(148, 163, 184, 0.08)',
  borderRadius: '16px !important',
  backdropFilter: 'blur(20px)',
  boxShadow: 'none',
  transition: 'box-shadow 0.2s ease',
  '&::before': { display: 'none' },
  '&.Mui-expanded': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
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
