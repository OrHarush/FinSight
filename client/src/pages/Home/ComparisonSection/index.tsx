import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import ComparisonTable from '@/pages/Home/ComparisonSection/ComparisonTable';
import Header from '@/pages/Home/ComparisonSection/Header';

const ComparisonSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' });

  return (
    <Column
      component="section"
      ref={sectionRef}
      spacing={0}
      sx={{ px: { xs: 2, md: 8 }, py: { xs: 8, md: 12 }, position: 'relative' }}
    >
      <Header isInView={isInView} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <ComparisonTable />
      </motion.div>
    </Column>
  );
};

export default ComparisonSection;
