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
        }
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
        variableMetadata: []
      }
    ]
  }
}

export const createFileDataTablePayload = (): any => {
  return {
    varQuantity: 21,
    caseQuantity: 122,
    UNF: 'UNF:6:awd/lz8bNdoXn8f1sjAAAQ==',
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
        }
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
        variableMetadata: []
      }
    ]
  }
}
