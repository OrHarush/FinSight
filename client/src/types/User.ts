import { UserRole } from '@lyra/shared';

export interface UserDto {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  acceptedTermsAt?: string;
  consentVersion?: string;
  displayCurrency?: string;
  hasCompletedOnboarding?: boolean;
  analyticsConsent?: 'pending' | 'accepted' | 'rejected';
  analyticsConsentUpdatedAt?: string | null;
  marketingEmailsEnabled?: boolean;
}
