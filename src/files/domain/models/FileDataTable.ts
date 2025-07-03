export interface FileDataTable {
  varQuantity?: number
  caseQuantity?: number
  recordsPerCase?: number
  UNF: string
  dataVariables: FileDataVariable[]
}

export interface FileDataVariable {
  id: number
  name: string
  label?: string
  weighted: boolean
  variableIntervalType?: FileDataVariableIntervalType
  variableFormatType?: FileDataVariableFormatType
  formatCategory?: string
  format?: string
  isOrderedCategorical: boolean
  fileOrder: number
  UNF: string
  fileStartPosition?: number
  fileEndPosition?: number
  recordSegmentNumber?: number
  numberOfDecimalPoints?: number
  variableMetadata?: FileDataVariableMetadata[]
  invalidRanges?: FileDataVariableInvalidRanges[]
  summaryStatistics?: object
  variableCategories?: FileDataVariableCategory[]
}

export interface FileDataVariableMetadata {
  id: number
  metadataId: number
  label?: string
  isWeightVar: boolean
  isWeighted: boolean
  weightVariableId?: number
  literalQuestion?: string
  interviewInstruction?: string
  postQuestion?: string
  universe?: string
  notes?: string
  categoryMetadatas: FileDataVariableCategoryMetadata[]
}

export interface FileDataVariableCategoryMetadata {
  wFreq?: number
  categoryValue?: string
}

export interface FileDataVariableInvalidRanges {
  beginValue?: string
  hasBeginValueType: boolean
  isBeginValueTypePoint: boolean
  isBeginValueTypeMin: boolean
  isBeginValueTypeMinExcl: boolean
  isBeginValueTypeMax: boolean
  isBeginValueTypeMaxExcl: boolean
  endValue?: string
  hasEndValueType: boolean
  endValueTypeMax: boolean
  endValueTypeMaxExcl: boolean
}

export interface FileDataVariableCategory {
  label?: string
  value?: string
  isMissing: boolean
  frequency?: number
}

export enum FileDataVariableIntervalType {
  DISCRETE = 'discrete',
  CONTIN = 'contin',
  NOMINAL = 'nominal',
  DICHOTOMOUS = 'dichotomous'
}

export enum FileDataVariableFormatType {
  NUMERIC = 'NUMERIC',
  CHARACTER = 'CHARACTER'
}
