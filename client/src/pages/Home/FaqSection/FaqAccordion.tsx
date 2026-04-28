import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useState } from 'react';

import { getFaqAccordionStyle } from '@/pages/Home/FaqSection/styles';

interface FaqAccordionProps {
  question: string;
  answer: string;
}

const FaqAccordion = ({ question, answer }: FaqAccordionProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (_: React.SyntheticEvent, value: boolean) => {
    setExpanded(value);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={toggleExpanded}
      disableGutters
      elevation={0}
      sx={getFaqAccordionStyle()}
      slotProps={{ transition: { timeout: 300 } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>{question}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          sx={{
            fontSize: '0.95rem',
            fontWeight: 400,
            color: 'text.secondary',
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
          }}
        >
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default FaqAccordion;
