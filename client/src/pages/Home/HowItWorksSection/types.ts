import { ReactNode } from 'react';

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  mockup: ReactNode;
}
