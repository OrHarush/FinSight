import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import AnnotationCard from '@/pages/Home/DashboardClaritySection/AnnotationCard';
import { CLARITY_CARDS } from '@/pages/Home/DashboardClaritySection/constants';
import FormulaAnswer from '@/pages/Home/DashboardClaritySection/FormulaAnswer';

const ClarityCards = () => {
  const { t } = useTranslation('home');

  return (
    <Column spacing={1.75} sx={{ width: '100%' }}>
      {CLARITY_CARDS.map(card => {
        const isFormulaCard = card.key === 'why';

        return (
          <AnnotationCard
            key={card.key}
            title={t(`landing.clarity.cards.${card.key}.title`)}
            color={card.color}
            body={isFormulaCard ? undefined : t(`landing.clarity.cards.${card.key}.body`)}
          >
            {isFormulaCard ? <FormulaAnswer /> : undefined}
          </AnnotationCard>
        );
      })}
    </Column>
  );
};

export default ClarityCards;
