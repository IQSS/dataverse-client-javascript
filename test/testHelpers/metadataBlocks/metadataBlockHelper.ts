import { MetadataBlock } from '../../../src/metadataBlocks/domain/models/MetadataBlock'

export const createMetadataBlockModel = (): MetadataBlock => {
  return {
    id: 1,
    name: 'testName',
    displayName: 'testDisplayName',
    metadataFields: {
      testField1: {
        name: 'testName1',
        displayName: 'testDisplayName1',
        title: 'testTitle1',
        type: 'testType1',
        watermark: 'testWatermark1',
        description: 'testDescription1',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#VALUE'
      },
      testField2: {
        name: 'testName2',
        displayName: 'testDisplayName2',
        title: 'testTitle2',
        type: 'testType2',
        watermark: 'testWatermark2',
        description: 'testDescription2',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        childMetadataFields: {
          testField3: {
            name: 'testName3',
            displayName: 'testDisplayName3',
            title: 'testTitle3',
            type: 'testType3',
            watermark: 'testWatermark3',
            description: 'testDescription3',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE'
          },
          testField4: {
            name: 'testName4',
            displayName: 'testDisplayName4',
            title: 'testTitle4',
            type: 'testType4',
            watermark: 'testWatermark4',
            description: 'testDescription4',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE'
          }
        }
      }
    }
  }
}

export const createMetadataBlockPayload = (): any => {
  return {
    id: 1,
    name: 'testName',
    displayName: 'testDisplayName',
    fields: {
      testField1: {
        name: 'testName1',
        displayName: 'testDisplayName1',
        title: 'testTitle1',
        type: 'testType1',
        watermark: 'testWatermark1',
        description: 'testDescription1',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#VALUE'
      },
      testField2: {
        name: 'testName2',
        displayName: 'testDisplayName2',
        title: 'testTitle2',
        type: 'testType2',
        watermark: 'testWatermark2',
        description: 'testDescription2',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        childFields: {
          testField3: {
            name: 'testName3',
            displayName: 'testDisplayName3',
            title: 'testTitle3',
            type: 'testType3',
            watermark: 'testWatermark3',
            description: 'testDescription3',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE'
          },
          testField4: {
            name: 'testName4',
            displayName: 'testDisplayName4',
            title: 'testTitle4',
            type: 'testType4',
            watermark: 'testWatermark4',
            description: 'testDescription4',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE'
          }
        }
      }
    }
  }
}
