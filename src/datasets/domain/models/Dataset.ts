export interface Dataset {
  id: number;
  persistentId: string;
  versionId: number;
  versionInfo: DatasetVersionInfo;
  license?: DatasetLicense;
  metadataBlocks: MetadataBlocks;
}

export interface DatasetVersionInfo {
  majorNumber: number;
  minorNumber: number;
  state: DatasetVersionState;
  createTime: Date;
  lastUpdateTime: Date;
  releaseTime?: Date;
}

export enum DatasetVersionState {
  DRAFT = 'DRAFT',
  RELEASED = 'RELEASED',
  ARCHIVED = 'ARCHIVED',
  DEACCESSIONED = 'DEACCESSIONED',
}

export interface DatasetLicense {
  name: string;
  uri: string;
  iconUri?: string;
}

export type MetadataBlocks = [CitationMetadataBlock, ...DatasetMetadataBlock[]];

export interface DatasetMetadataBlock {
  name: string;
  fields: DatasetMetadataFields;
}

export type DatasetMetadataFields = Record<string, DatasetMetadataFieldValue>;

export type DatasetMetadataFieldValue = string | string[] | DatasetMetadataSubField | DatasetMetadataSubField[];

export type DatasetMetadataSubField = Record<string, string>;

export interface CitationMetadataBlock extends DatasetMetadataBlock {
  name: 'citation';
  fields: {
    title: string;
    author: Author[];
    datasetContact: DatasetContact[];
    dsDescription: DatasetDescription[];
    subject: string[];
    subtitle?: string;
    alternativeTitle?: string;
    alternativeURL?: string;
    otherId?: OtherId[];
    keyword?: Keyword[];
    topicClassification?: TopicClassification[];
    publication?: Publication[];
    notesText?: string;
    language?: string[];
    producer?: Producer[];
    productionDate?: string;
    productionPlace?: string[];
    contributor?: Contributor[];
    grantNumber?: GrantNumber[];
    distributor?: Distributor[];
    distributionDate?: string;
    depositor?: string;
    dateOfDeposit?: string;
    timePeriodCovered?: TimePeriodCovered[];
    dateOfCollection?: DateOfCollection[];
    kindOfData?: string[];
    series?: Series[];
    software?: Software[];
    relatedMaterial?: string[];
    relatedDatasets?: string[];
    otherReferences?: string[];
    dataSources?: string[];
    originOfSources?: string;
    characteristicOfSources?: string;
    accessToSources?: string;
  };
}

interface OtherId extends DatasetMetadataSubField {
  otherIdAgency?: string;
  otherIdValue?: string;
}

export interface Author extends DatasetMetadataSubField {
  authorName: string;
  authorAffiliation: string;
  authorIdentifierScheme?: string;
  authorIdentifier?: string;
}

export interface DatasetContact extends DatasetMetadataSubField {
  datasetContactName: string;
  datasetContactEmail: string;
  datasetContactAffiliation?: string;
}

export interface DatasetDescription extends DatasetMetadataSubField {
  dsDescriptionValue: string;
  dsDescriptionDate?: string;
}

interface Keyword extends DatasetMetadataSubField {
  keywordValue?: string;
  keywordVocabulary?: string;
  keywordVocabularyURI?: string;
}

interface TopicClassification extends DatasetMetadataSubField {
  topicClassValue?: string;
  topicClassVocab?: string;
  topicClassVocabURI?: string;
}

interface Publication extends DatasetMetadataSubField {
  publicationCitation?: string;
  publicationIDType?: string;
  publicationIDNumber?: string;
  publicationURL?: string;
}

interface Producer extends DatasetMetadataSubField {
  producerName?: string;
  producerAffiliation?: string;
  producerAbbreviation?: string;
  producerURL?: string;
  producerLogoURL?: string;
}

interface Contributor extends DatasetMetadataSubField {
  contributorType?: string;
  contributorName?: string;
}

interface GrantNumber extends DatasetMetadataSubField {
  grantNumberAgency?: string;
  grantNumberValue?: string;
}

interface Distributor extends DatasetMetadataSubField {
  distributorName?: string;
  distributorAffiliation?: string;
  distributorAbbreviation?: string;
  distributorURL?: string;
  distributorLogoURL?: string;
}

interface TimePeriodCovered extends DatasetMetadataSubField {
  timePeriodCoveredStart?: string;
  timePeriodCoveredEnd?: string;
}

interface DateOfCollection extends DatasetMetadataSubField {
  dateOfCollectionStart?: string;
  dateOfCollectionEnd?: string;
}

interface Series extends DatasetMetadataSubField {
  seriesName?: string;
  seriesInformation?: string;
}

interface Software extends DatasetMetadataSubField {
  softwareName?: string;
  softwareVersion?: string;
}
