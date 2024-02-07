import { AxiosResponse } from 'axios'
import {
  FileDataTable,
  FileDataVariable,
  FileDataVariableIntervalType,
  FileDataVariableFormatType,
  FileDataVariableMetadata,
  FileDataVariableInvalidRanges,
  FileDataVariableCategory,
  FileDataVariableCategoryMetadata
} from '../../../domain/models/FileDataTable'

export const transformDataTablesResponseToDataTables = (
  response: AxiosResponse
): FileDataTable[] => {
  const files: FileDataTable[] = []
  const fileDataTablesPayload = response.data.data
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  fileDataTablesPayload.forEach(function (fileDataTablePayload: any) {
    files.push(transformPayloadToFileDataTable(fileDataTablePayload))
  })
  return files
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToFileDataTable = (fileDataTablePayload: any): FileDataTable => {
  return {
    ...(fileDataTablePayload.varQuantity && { varQuantity: fileDataTablePayload.varQuantity }),
    ...(fileDataTablePayload.caseQuantity && { caseQuantity: fileDataTablePayload.caseQuantity }),
    ...(fileDataTablePayload.recordsPerCase && {
      recordsPerCase: fileDataTablePayload.recordsPerCase
    }),
    UNF: fileDataTablePayload.UNF,
    dataVariables: transformPayloadToDataVariables(fileDataTablePayload.dataVariables)
  }
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToDataVariables = (fileDataVariablesPayload: any): FileDataVariable[] => {
  const fileDataVariables: FileDataVariable[] = []
  fileDataVariablesPayload.forEach(function (fileDataVariablePayload: any) {
    fileDataVariables.push({
      id: fileDataVariablePayload.id,
      name: fileDataVariablePayload.name,
      ...(fileDataVariablePayload.label && { label: fileDataVariablePayload.label }),
      weighted: fileDataVariablePayload.weighted,
      ...(fileDataVariablePayload.variableIntervalType && {
        variableIntervalType:
          fileDataVariablePayload.variableIntervalType as FileDataVariableIntervalType
      }),
      ...(fileDataVariablePayload.variableFormatType && {
        variableFormatType: fileDataVariablePayload.variableFormatType as FileDataVariableFormatType
      }),
      ...(fileDataVariablePayload.formatCategory && {
        formatCategory: fileDataVariablePayload.formatCategory
      }),
      ...(fileDataVariablePayload.format && { format: fileDataVariablePayload.format }),
      isOrderedCategorical: fileDataVariablePayload.isOrderedCategorical,
      fileOrder: fileDataVariablePayload.fileOrder,
      UNF: fileDataVariablePayload.UNF,
      ...(fileDataVariablePayload.fileStartPosition && {
        fileStartPosition: fileDataVariablePayload.fileStartPosition
      }),
      ...(fileDataVariablePayload.fileEndPosition && {
        fileEndPosition: fileDataVariablePayload.fileEndPosition
      }),
      ...(fileDataVariablePayload.recordSegmentNumber && {
        recordSegmentNumber: fileDataVariablePayload.recordSegmentNumber
      }),
      ...(fileDataVariablePayload.numberOfDecimalPoints && {
        numberOfDecimalPoints: fileDataVariablePayload.numberOfDecimalPoints
      }),
      ...(fileDataVariablePayload.variableMetadata && {
        variableMetadata: transformPayloadToFileVariableMetadata(
          fileDataVariablePayload.variableMetadata
        )
      }),
      ...(fileDataVariablePayload.invalidRanges && {
        invalidRanges: transformPayloadToDataVariableInvalidRanges(
          fileDataVariablePayload.invalidRanges
        )
      }),
      ...(fileDataVariablePayload.summaryStatistics && {
        summaryStatistics: fileDataVariablePayload.summaryStatistics
      }),
      ...(fileDataVariablePayload.variableCategories && {
        variableCategories: transformPayloadToFileDataVariableCategories(
          fileDataVariablePayload.variableCategories
        )
      })
    })
  })
  return fileDataVariables
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToFileVariableMetadata = (
  fileVariableMetadataPayload: any
): FileDataVariableMetadata[] => {
  const fileDataVariableMetadata: FileDataVariableMetadata[] = []
  fileVariableMetadataPayload.forEach(function (fileVariableMetadataElementPayload: any) {
    fileDataVariableMetadata.push({
      id: fileVariableMetadataElementPayload.id,
      metadataId: fileVariableMetadataElementPayload.metadataId,
      ...(fileVariableMetadataElementPayload.label && {
        label: fileVariableMetadataElementPayload.label
      }),
      isWeightVar: fileVariableMetadataElementPayload.isWeightVar,
      isWeighted: fileVariableMetadataElementPayload.isWeighted,
      ...(fileVariableMetadataElementPayload.weightVariableId && {
        weightVariableId: fileVariableMetadataElementPayload.weightVariableId
      }),
      ...(fileVariableMetadataElementPayload.literalQuestion && {
        literalQuestion: fileVariableMetadataElementPayload.literalQuestion
      }),
      ...(fileVariableMetadataElementPayload.interviewInstruction && {
        interviewInstruction: fileVariableMetadataElementPayload.interviewInstruction
      }),
      ...(fileVariableMetadataElementPayload.postQuestion && {
        postQuestion: fileVariableMetadataElementPayload.postQuestion
      }),
      ...(fileVariableMetadataElementPayload.universe && {
        universe: fileVariableMetadataElementPayload.universe
      }),
      ...(fileVariableMetadataElementPayload.notes && {
        notes: fileVariableMetadataElementPayload.notes
      }),
      categoryMetadatas: transformPayloadToFileDataVariableCategoryMetadatas(
        fileVariableMetadataElementPayload.categoryMetadatas
      )
    })
  })
  return fileDataVariableMetadata
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToFileDataVariableCategoryMetadatas = (
  categoryMetadatasPayload: any
): FileDataVariableCategoryMetadata[] => {
  const fileDataVariableCategoryMetadatas: FileDataVariableCategoryMetadata[] = []
  categoryMetadatasPayload.forEach(function (categoryMetadataPayload: any) {
    fileDataVariableCategoryMetadatas.push({
      ...(categoryMetadataPayload.wFreq && { wFreq: categoryMetadataPayload.wFreq }),
      ...(categoryMetadataPayload.categoryValue && {
        categoryValue: categoryMetadataPayload.categoryValue
      })
    })
  })
  return fileDataVariableCategoryMetadatas
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToDataVariableInvalidRanges = (
  dataVariableInvalidRangesPayload: any
): FileDataVariableInvalidRanges[] => {
  const dataVariableInvalidRanges: FileDataVariableInvalidRanges[] = []
  dataVariableInvalidRangesPayload.forEach(function (dataVariableInvalidRangePayload: any) {
    dataVariableInvalidRanges.push({
      ...(dataVariableInvalidRangePayload.beginValue && {
        beginValue: dataVariableInvalidRangePayload.beginValue
      }),
      hasBeginValueType: dataVariableInvalidRangePayload.hasBeginValueType,
      isBeginValueTypePoint: dataVariableInvalidRangePayload.isBeginValueTypePoint,
      isBeginValueTypeMin: dataVariableInvalidRangePayload.isBeginValueTypeMin,
      isBeginValueTypeMinExcl: dataVariableInvalidRangePayload.isBeginValueTypeMinExcl,
      isBeginValueTypeMax: dataVariableInvalidRangePayload.isBeginValueTypeMax,
      isBeginValueTypeMaxExcl: dataVariableInvalidRangePayload.isBeginValueTypeMaxExcl,
      ...(dataVariableInvalidRangePayload.endValue && {
        endValue: dataVariableInvalidRangePayload.endValue
      }),
      hasEndValueType: dataVariableInvalidRangePayload.hasEndValueType,
      endValueTypeMax: dataVariableInvalidRangePayload.endValueTypeMax,
      endValueTypeMaxExcl: dataVariableInvalidRangePayload.endValueTypeMaxExcl
    })
  })
  return dataVariableInvalidRanges
}

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const transformPayloadToFileDataVariableCategories = (
  fileDataVariableCategoriesPayload: any
): FileDataVariableCategory[] => {
  const fileDataVariableCategories: FileDataVariableCategory[] = []
  fileDataVariableCategoriesPayload.forEach(function (fileDataVariableCategoryPayload: any) {
    fileDataVariableCategories.push({
      ...(fileDataVariableCategoryPayload.label && {
        label: fileDataVariableCategoryPayload.label
      }),
      ...(fileDataVariableCategoryPayload.value && {
        value: fileDataVariableCategoryPayload.value
      }),
      isMissing: fileDataVariableCategoryPayload.isMissing,
      ...(fileDataVariableCategoryPayload.frequency && {
        frequency: fileDataVariableCategoryPayload.frequency
      })
    })
  })
  return fileDataVariableCategories
}
