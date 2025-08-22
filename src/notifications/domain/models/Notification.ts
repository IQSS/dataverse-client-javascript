export enum NotificationType {
  ASSIGNROLE = 'ASSIGNROLE',
  REVOKEROLE = 'REVOKEROLE',
  CREATEDV = 'CREATEDV',
  CREATEDS = 'CREATEDS',
  CREATEACC = 'CREATEACC',
  SUBMITTEDDS = 'SUBMITTEDDS',
  RETURNEDDS = 'RETURNEDDS',
  PUBLISHEDDS = 'PUBLISHEDDS',
  REQUESTFILEACCESS = 'REQUESTFILEACCESS',
  GRANTFILEACCESS = 'GRANTFILEACCESS',
  REJECTFILEACCESS = 'REJECTFILEACCESS',
  FILESYSTEMIMPORT = 'FILESYSTEMIMPORT',
  CHECKSUMIMPORT = 'CHECKSUMIMPORT',
  CHECKSUMFAIL = 'CHECKSUMFAIL',
  CONFIRMEMAIL = 'CONFIRMEMAIL',
  APIGENERATED = 'APIGENERATED',
  INGESTCOMPLETED = 'INGESTCOMPLETED',
  INGESTCOMPLETEDWITHERRORS = 'INGESTCOMPLETEDWITHERRORS',
  PUBLISHFAILED_PIDREG = 'PUBLISHFAILED_PIDREG',
  WORKFLOW_SUCCESS = 'WORKFLOW_SUCCESS',
  WORKFLOW_FAILURE = 'WORKFLOW_FAILURE',
  STATUSUPDATED = 'STATUSUPDATED',
  DATASETCREATED = 'DATASETCREATED',
  DATASETMENTIONED = 'DATASETMENTIONED',
  GLOBUSUPLOADCOMPLETED = 'GLOBUSUPLOADCOMPLETED',
  GLOBUSUPLOADCOMPLETEDWITHERRORS = 'GLOBUSUPLOADCOMPLETEDWITHERRORS',
  GLOBUSDOWNLOADCOMPLETED = 'GLOBUSDOWNLOADCOMPLETED',
  GLOBUSDOWNLOADCOMPLETEDWITHERRORS = 'GLOBUSDOWNLOADCOMPLETEDWITHERRORS',
  REQUESTEDFILEACCESS = 'REQUESTEDFILEACCESS',
  GLOBUSUPLOADREMOTEFAILURE = 'GLOBUSUPLOADREMOTEFAILURE',
  GLOBUSUPLOADLOCALFAILURE = 'GLOBUSUPLOADLOCALFAILURE',
  PIDRECONCILED = 'PIDRECONCILED'
}

export interface RoleAssignment {
  id: number
  assignee: string
  definitionPointId: number
  roleId: number
  roleName: string
  _roleAlias: string
}

export interface Notification {
  id: number
  type: NotificationType
  subjectText?: string
  messageText?: string
  sentTimestamp: string
  displayAsRead: boolean
  installationBrandName?: string
  userGuidesBaseUrl?: string
  userGuidesVersion?: string
  userGuidesSectionPath?: string
  roleAssignments?: RoleAssignment[]
  collectionAlias?: string
  collectionDisplayName?: string
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
  additionalInfo?: string
  objectDeleted?: boolean
}
