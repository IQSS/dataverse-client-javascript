import { RoleAssignment } from '../../domain/models/Notification'

export interface NotificationPayload {
  id: number
  type: string
  subjectText?: string
  messageText?: string
  sentTimestamp: string
  displayAsRead: boolean
  installationBrandName?: string
  userGuidesBaseUrl?: string
  userGuidesVersion?: string
  userGuidesSectionPath?: string
  roleAssignments?: RoleAssignment[]
  dataverseAlias?: string
  dataverseDisplayName?: string
  datasetPersistentIdentifier?: string
  datasetDisplayName?: string
  ownerPersistentIdentifier?: string
  ownerAlias?: string
  ownerDisplayName?: string
  requestorFirstName?: string
  requestorLastName?: string
  requestorEmail?: string
  dataFileId?: number
  dataFileDisplayName?: string
  currentCurationStatus?: string
  additionalInfo?: Record<string, unknown>
  objectDeleted?: boolean
}
