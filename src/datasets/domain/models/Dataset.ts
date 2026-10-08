import { DvObjectOwnerNode } from '../../../core/domain/models/DvObjectOwnerNode'
import { License } from '../../../licenses'

export interface Dataset {
  id: number
  persistentId: string
  versionId: number
  versionInfo: DatasetVersionInfo
  internalVersionNumber: number
  license?: DatasetLicense
  termsOfUse: TermsOfUse
  alternativePersistentId?: string
  publicationDate?: string
  citationDate?: string
  guestbookId?: number
  templateId?: number
  metadataBlocks: DatasetMetadataBlocks
  isPartOf: DvObjectOwnerNode
  datasetType?: string
}

export interface DatasetVersionInfo {
  majorNumber: number
  minorNumber: number
  state: DatasetVersionState
  createTime: Date
  /**
   * The timestamp of the last update to this dataset version.
   * Format: ISO 8601 string (e.g., "2023-06-01T12:34:56Z").
   * Used for optimistic concurrency control to detect concurrent updates.
   */
  lastUpdateTime: string
  releaseTime?: Date
  deaccessionNote?: string
}

export enum DatasetVersionState {
  DRAFT = 'DRAFT',
  RELEASED = 'RELEASED',
  ARCHIVED = 'ARCHIVED',
  DEACCESSIONED = 'DEACCESSIONED'
}

export type DatasetLicense = Pick<License, 'name' | 'uri' | 'iconUri'>

export interface CustomTerms {
  termsOfUse: string
  confidentialityDeclaration?: string
  specialPermissions?: string
  restrictions?: string
  citationRequirements?: string
  depositorRequirements?: string
  conditions?: string
  disclaimer?: string
}

export interface TermsOfAccess {
  fileAccessRequest: boolean
  termsOfAccessForRestrictedFiles?: string
  dataAccessPlace?: string
  originalArchive?: string
  availabilityStatus?: string
  contactForAccess?: string
  sizeOfCollection?: string
  studyCompletion?: string
  termsOfUse?: string
  confidentialityDeclaration?: string
  specialPermissions?: string
  restrictions?: string
  citationRequirements?: string
  depositorRequirements?: string
  conditions?: string
  disclaimer?: string
}

export interface TermsOfUse {
  termsOfAccess: TermsOfAccess
  customTerms?: CustomTerms
}
export type DatasetMetadataBlocks = [CitationMetadataBlock, ...DatasetMetadataBlock[]]

export interface DatasetMetadataBlock {
  name: string
  fields: DatasetMetadataFields
}
export const ANONYMIZED_FIELD_VALUE = 'withheld'
type AnonymizedField = typeof ANONYMIZED_FIELD_VALUE

export type DatasetMetadataFields = Record<string, DatasetMetadataFieldValue>

export type DatasetMetadataFieldValue =
  | string
  | string[]
  | DatasetMetadataSubField
  | DatasetMetadataSubField[]
  | AnonymizedField

export type DatasetMetadataSubField = Record<string, string | undefined>

export interface CitationMetadataBlock extends DatasetMetadataBlock {
  name: 'citation'
  fields: {
    title: string
    author: Author[] | AnonymizedField
    datasetContact: DatasetContact[] | AnonymizedField
    dsDescription: DatasetDescription[] | AnonymizedField
    subject: string[] | AnonymizedField
    subtitle?: string
    alternativeTitle?: string
    alternativeURL?: string
    otherId?: OtherId[] | AnonymizedField
    keyword?: Keyword[] | AnonymizedField
    topicClassification?: TopicClassification[] | AnonymizedField
    publication?: Publication[] | AnonymizedField
    notesText?: string
    language?: string[] | AnonymizedField
    producer?: Producer[] | AnonymizedField
    productionDate?: string
    productionPlace?: string[] | AnonymizedField
    contributor?: Contributor[] | AnonymizedField
    grantNumber?: GrantNumber[] | AnonymizedField
    distributor?: Distributor[] | AnonymizedField
    distributionDate?: string
    depositor?: string
    dateOfDeposit?: string
    timePeriodCovered?: TimePeriodCovered[] | AnonymizedField
    dateOfCollection?: DateOfCollection[] | AnonymizedField
    kindOfData?: string[] | AnonymizedField
    series?: Series[] | AnonymizedField
    software?: Software[] | AnonymizedField
    relatedMaterial?: string[] | AnonymizedField
    relatedDatasets?: string[] | AnonymizedField
    otherReferences?: string[] | AnonymizedField
    dataSources?: string[] | AnonymizedField
    originOfSources?: string
    characteristicOfSources?: string
    accessToSources?: string
  }
}

interface OtherId extends DatasetMetadataSubField {
  otherIdAgency?: string
  otherIdValue?: string
}

export interface Author extends DatasetMetadataSubField {
  authorName: string
  authorAffiliation: string
  authorIdentifierScheme?: string
  authorIdentifier?: string
}

export interface DatasetContact extends DatasetMetadataSubField {
  datasetContactName: string
  datasetContactEmail: string
  datasetContactAffiliation?: string
}

export interface DatasetDescription extends DatasetMetadataSubField {
  dsDescriptionValue: string
  dsDescriptionDate?: string
}

interface Keyword extends DatasetMetadataSubField {
  keywordValue?: string
  keywordVocabulary?: string
  keywordVocabularyURI?: string
}

interface TopicClassification extends DatasetMetadataSubField {
  topicClassValue?: string
  topicClassVocab?: string
  topicClassVocabURI?: string
}

export interface Publication extends DatasetMetadataSubField {
  publicationCitation?: string
  publicationIDType?: string
  publicationIDNumber?: string
  publicationURL?: string
}

interface Producer extends DatasetMetadataSubField {
  producerName?: string
  producerAffiliation?: string
  producerAbbreviation?: string
  producerURL?: string
  producerLogoURL?: string
}

interface Contributor extends DatasetMetadataSubField {
  contributorType?: string
  contributorName?: string
}

interface GrantNumber extends DatasetMetadataSubField {
  grantNumberAgency?: string
  grantNumberValue?: string
}

interface Distributor extends DatasetMetadataSubField {
  distributorName?: string
  distributorAffiliation?: string
  distributorAbbreviation?: string
  distributorURL?: string
  distributorLogoURL?: string
}

interface TimePeriodCovered extends DatasetMetadataSubField {
  timePeriodCoveredStart?: string
  timePeriodCoveredEnd?: string
}

interface DateOfCollection extends DatasetMetadataSubField {
  dateOfCollectionStart?: string
  dateOfCollectionEnd?: string
}

interface Series extends DatasetMetadataSubField {
  seriesName?: string
  seriesInformation?: string
}

interface Software extends DatasetMetadataSubField {
  softwareName?: string
  softwareVersion?: string
}

export enum VersionUpdateType {
  MAJOR = 'major',
  MINOR = 'minor',
  UPDATE_CURRENT = 'updatecurrent'
}
