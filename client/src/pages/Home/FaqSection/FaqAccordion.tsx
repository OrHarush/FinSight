import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Link, Typography } from '@mui/material';
import { useState } from 'react';

import { getFaqAccordionStyle } from '@/pages/Home/FaqSection/styles';

interface FaqReadMore {
  prefix: string;
  linkText: string;
  suffix: string;
  href: string;
}

interface FaqAccordionProps {
  question: string;
  answer: string;
  readMore?: FaqReadMore;
}

const FaqAccordion = ({ question, answer, readMore }: FaqAccordionProps) => {
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
        <Typography component="h3" sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>{question}</Typography>
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
        {readMore && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: '0.95rem',
              fontWeight: 400,
              color: 'text.secondary',
              lineHeight: 1.7,
            }}
          >
            {readMore.prefix}
            <Link href={readMore.href} sx={{ color: 'primary.main', fontWeight: 600 }}>
              {readMore.linkText}
            </Link>
            {readMore.suffix}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default FaqAccordion;
