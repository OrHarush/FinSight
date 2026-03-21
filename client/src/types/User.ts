import { UserRole } from '@finsight/shared';

export interface UserDto {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  acceptedTermsAt?: string;
  consentVersion?: string;
  displayCurrency?: string;
}
