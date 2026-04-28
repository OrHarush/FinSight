import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqJsonLdProps {
  items: FaqItem[];
}

const SCRIPT_ID = 'faq-jsonld';

const FaqJsonLd = ({ items }: FaqJsonLdProps) => {
  const { i18n } = useTranslation();

  useEffect(() => {
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

    const existing = document.getElementById(SCRIPT_ID);

    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = SCRIPT_ID;
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const node = document.getElementById(SCRIPT_ID);

      if (node) {
        node.remove();
      }
    };
  }, [items, i18n.language]);

  return null;
};

export default FaqJsonLd;
