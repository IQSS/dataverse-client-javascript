export interface AuthenticatedUser {
  id: number;
  persistentUserId: string;
  identifier: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  superuser: boolean;
  deactivated: boolean;
  createdTime: string;
  authenticationProviderId: string;
  lastLoginTime?: string;
  lastApiUseTime?: string;
  deactivatedTime?: string;
  affiliation?: string;
  position?: string;
  emailLastConfirmed?: string;
}
