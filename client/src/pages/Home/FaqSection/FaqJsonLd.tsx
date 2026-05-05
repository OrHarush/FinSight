import { useTranslation } from 'react-i18next';

import JsonLd from '@/components/seo/JsonLd';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqJsonLdProps {
  items: FaqItem[];
}

const FaqJsonLd = ({ items }: FaqJsonLdProps) => {
  const { i18n } = useTranslation();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: i18n.language,
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  return <JsonLd id="faq-jsonld" schema={schema} />;
};

export default FaqJsonLd;
