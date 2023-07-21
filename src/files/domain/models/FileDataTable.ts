export interface FileDataTable {
  varQuantity?: number;
  caseQuantity?: number;
  recordsPerCase?: number;
  UNF: string;
  dataVariables: FileDataVariable[];
}

export interface FileDataVariable {
  id: number;
  name: string;
  label?: string;
  weighted: boolean;
  variableIntervalType?: FileDataVariableIntervalType;
  variableFormatType?: FileDataVariableFormatType;
  formatCategory?: string;
  format?: string;
  isOrderedCategorical: boolean;
  fileOrder: number;
  UNF: string;
  fileStartPosition?: number;
  fileEndPosition?: number;
  recordSegmentNumber?: number;
  numberOfDecimalPoints?: number;
  variableMetadata?: FileDataVariableMetadata[];
  invalidRanges?: FileDataVariableInvalidRanges[];
  summaryStatistics?: FileDataVariableSummaryStatistics;
  variableCategories?: FileDataVariableCategory[];
}

// TODO
export interface FileDataVariableMetadata {}

// TODO
export interface FileDataVariableInvalidRanges {}

// TODO
export interface FileDataVariableSummaryStatistics {}

// TODO
export interface FileDataVariableCategory {}

export enum FileDataVariableIntervalType {
  DISCRETE = 'discrete',
  CONTIN = 'contin',
  NOMINAL = 'nominal',
  DICHOTOMOUS = 'dichotomous',
}

export enum FileDataVariableFormatType {
  NUMERIC = 'NUMERIC',
  CHARACTER = 'CHARACTER',
}
