import {
  FileDataTable,
  FileDataVariableIntervalType,
  FileDataVariableFormatType
} from '../../../src/files/domain/models/FileDataTable'

export const createFileDataTableModel = (): FileDataTable => {
  return {
    varQuantity: 21,
    caseQuantity: 122,
    UNF: 'UNF:6:awd/lz8bNdoXn8f1sjAAAQ==',
    recordsPerCase: 1,
    dataVariables: [
      {
        id: 3,
        name: 'test1',
        label: 'test1',
        weighted: false,
        variableIntervalType: FileDataVariableIntervalType.DISCRETE,
        variableFormatType: FileDataVariableFormatType.CHARACTER,
        isOrderedCategorical: false,
        fileOrder: 0,
        UNF: 'UNF:6:j194WNS7SAe+mFrz/3oCwQ==',
        variableMetadata: [],
        summaryStatistics: {
          medn: '28.27591',
          mode: '.',
          min: '27.6741'
        },
        formatCategory: 'Character',
        format: 'A',
        fileStartPosition: 1,
        fileEndPosition: 1,
        recordSegmentNumber: 1,
        numberOfDecimalPoints: 1,
        invalidRanges: [
          {
            beginValue: '1',
            endValue: '2',
            hasBeginValueType: false,
            isBeginValueTypeMax: false,
            hasEndValueType: false,
            isBeginValueTypePoint: false,
            isBeginValueTypeMin: false,
            isBeginValueTypeMinExcl: false,
            isBeginValueTypeMaxExcl: false,
            endValueTypeMax: false,
            endValueTypeMaxExcl: false
          }
        ],
        variableCategories: [
          {
            label: 'test1',
            value: 'test1',
            frequency: 10,
            isMissing: false
          }
        ]
      },
      {
        id: 15,
        name: 'test2',
        label: 'test2',
        weighted: false,
        variableIntervalType: FileDataVariableIntervalType.DISCRETE,
        variableFormatType: FileDataVariableFormatType.CHARACTER,
        isOrderedCategorical: false,
        fileOrder: 1,
        UNF: 'UNF:6:KPoFCWSEsLpy11Lh11CXWQ==',
        variableMetadata: [
          {
            id: 1,
            label: 'test1',
            metadataId: 1,
            isWeighted: false,
            isWeightVar: false,
            weightVariableId: 1,
            literalQuestion: 'test1',
            interviewInstruction: 'test1',
            postQuestion: 'test1',
            universe: 'test1',
            notes: 'test1',
            categoryMetadatas: [
              {
                categoryValue: 'test1',
                wFreq: 1
              }
            ]
          }
        ]
      }
    ]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createFileDataTablePayload = (): any => {
  return {
    varQuantity: 21,
    caseQuantity: 122,
    UNF: 'UNF:6:awd/lz8bNdoXn8f1sjAAAQ==',
    recordsPerCase: 1,
    dataVariables: [
      {
        id: 3,
        name: 'test1',
        label: 'test1',
        weighted: false,
        variableIntervalType: 'discrete',
        variableFormatType: 'CHARACTER',
        isOrderedCategorical: false,
        fileOrder: 0,
        UNF: 'UNF:6:j194WNS7SAe+mFrz/3oCwQ==',
        variableMetadata: [],
        summaryStatistics: {
          medn: '28.27591',
          mode: '.',
          min: '27.6741'
        },
        formatCategory: 'Character',
        format: 'A',
        fileStartPosition: 1,
        fileEndPosition: 1,
        recordSegmentNumber: 1,
        numberOfDecimalPoints: 1,
        invalidRanges: [
          {
            beginValue: '1',
            endValue: '2',
            hasBeginValueType: false,
            isBeginValueTypeMax: false,
            hasEndValueType: false,
            isBeginValueTypePoint: false,
            isBeginValueTypeMin: false,
            isBeginValueTypeMinExcl: false,
            isBeginValueTypeMaxExcl: false,
            endValueTypeMax: false,
            endValueTypeMaxExcl: false
          }
        ],
        variableCategories: [
          {
            label: 'test1',
            value: 'test1',
            frequency: 10,
            isMissing: false
          }
        ]
      },
      {
        id: 15,
        name: 'test2',
        label: 'test2',
        weighted: false,
        variableIntervalType: 'discrete',
        variableFormatType: 'CHARACTER',
        isOrderedCategorical: false,
        fileOrder: 1,
        UNF: 'UNF:6:KPoFCWSEsLpy11Lh11CXWQ==',
        variableMetadata: [
          {
            id: 1,
            label: 'test1',
            metadataId: 1,
            isWeighted: false,
            isWeightVar: false,
            weightVariableId: 1,
            literalQuestion: 'test1',
            interviewInstruction: 'test1',
            postQuestion: 'test1',
            universe: 'test1',
            notes: 'test1',
            categoryMetadatas: [
              {
                categoryValue: 'test1',
                wFreq: 1
              }
            ]
          }
        ]
      }
    ]
  }
}
