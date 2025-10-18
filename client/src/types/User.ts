export interface UserDto {
  _id: string;
  email: string;
  name: string;
  picture?: string;
  acceptedTermsAt?: string;
  consentVersion?: string;
}
