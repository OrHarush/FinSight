import { useEffect } from 'react';

interface JsonLdProps {
  id: string;
  schema: Record<string, unknown>;
}

const JsonLd = ({ id, schema }: JsonLdProps) => {
  const serialized = JSON.stringify(schema);

  useEffect(() => {
    const existing = document.getElementById(id);

    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = serialized;
    document.head.appendChild(script);

    return () => {
      const node = document.getElementById(id);

      if (node) {
        node.remove();
      }
    };
  }, [id, serialized]);

  return null;
};

export default JsonLd;
