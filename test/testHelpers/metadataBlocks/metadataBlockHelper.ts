import {
  MetadataBlock,
  MetadataFieldType,
  MetadataFieldWatermark,
  MetadataFieldTypeClass,
  MetadataFieldInfo
} from '../../../src/metadataBlocks/domain/models/MetadataBlock'
import { MetadataBlockPayload } from '../../../src/metadataBlocks/infra/repositories/transformers/MetadataBlockPayload'
import { MetadataFieldInfoPayload } from '../../../src/metadataBlocks/infra/repositories/transformers/MetadataFieldInfoPayload'

export const createMetadataBlockModel = (): MetadataBlock => {
  return {
    id: 1,
    name: 'testName',
    displayName: 'testDisplayName',
    displayOnCreate: true,
    metadataFields: {
      testField1: {
        name: 'testName1',
        displayName: 'testDisplayName1',
        title: 'testTitle1',
        type: MetadataFieldType.Text,
        watermark: MetadataFieldWatermark.Empty,
        description: 'testDescription1',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#VALUE',
        isRequired: true,
        displayOrder: 0,
        typeClass: MetadataFieldTypeClass.Primitive,
        displayOnCreate: true
      },
      testField2: {
        name: 'testName2',
        displayName: 'testDisplayName2',
        title: 'testTitle2',
        type: MetadataFieldType.Text,
        watermark: MetadataFieldWatermark.Empty,
        description: 'testDescription2',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 0,
        typeClass: MetadataFieldTypeClass.Compound,
        displayOnCreate: true,
        childMetadataFields: {
          testField3: {
            name: 'testName3',
            displayName: 'testDisplayName3',
            title: 'testTitle3',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description: 'testDescription3',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 0,
            typeClass: MetadataFieldTypeClass.Primitive,
            displayOnCreate: true
          },
          testField4: {
            name: 'testName4',
            displayName: 'testDisplayName4',
            title: 'testTitle4',
            type: MetadataFieldType.Text,
            watermark: MetadataFieldWatermark.Empty,
            description: 'testDescription4',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 0,
            typeClass: MetadataFieldTypeClass.Primitive,
            displayOnCreate: true
          }
        }
      }
    }
  }
}

export const createMetadataBlockPayload = (): MetadataBlockPayload => {
  return {
    id: 1,
    name: 'testName',
    displayName: 'testDisplayName',
    displayOnCreate: true,
    fields: {
      testField1: {
        name: 'testName1',
        displayName: 'testDisplayName1',
        title: 'testTitle1',
        type: 'TEXT',
        watermark: '',
        description: 'testDescription1',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '#VALUE',
        isRequired: true,
        displayOrder: 0,
        typeClass: 'primitive',
        displayOnCreate: true
      },
      testField2: {
        name: 'testName2',
        displayName: 'testDisplayName2',
        title: 'testTitle2',
        type: 'TEXT',
        watermark: '',
        description: 'testDescription2',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 0,
        typeClass: 'compound',
        displayOnCreate: true,
        childFields: {
          testField3: {
            name: 'testName3',
            displayName: 'testDisplayName3',
            title: 'testTitle3',
            type: 'TEXT',
            watermark: '',
            description: 'testDescription3',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 0,
            typeClass: 'primitive',
            displayOnCreate: true
          },
          testField4: {
            name: 'testName4',
            displayName: 'testDisplayName4',
            title: 'testTitle4',
            type: 'TEXT',
            watermark: '',
            description: 'testDescription4',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 0,
            typeClass: 'primitive',
            displayOnCreate: true
          }
        }
      }
    }
  }
}

export const createMetadataFieldInfoModel = (): MetadataFieldInfo => {
  return {
    name: 'testName1',
    displayName: 'testDisplayName1',
    title: 'testTitle1',
    type: MetadataFieldType.Text,
    watermark: MetadataFieldWatermark.Empty,
    description: 'testDescription1',
    multiple: false,
    isControlledVocabulary: false,
    displayFormat: '#VALUE',
    isRequired: true,
    displayOrder: 0,
    typeClass: MetadataFieldTypeClass.Primitive,
    displayOnCreate: true
  }
}

export const createMetadataFieldInfoPayload = (): MetadataFieldInfoPayload => {
  return {
    name: 'testName1',
    displayName: 'testDisplayName1',
    title: 'testTitle1',
    type: 'TEXT',
    watermark: '',
    description: 'testDescription1',
    multiple: false,
    isControlledVocabulary: false,
    displayFormat: '#VALUE',
    isRequired: true,
    displayOrder: 0,
    typeClass: 'primitive',
    displayOnCreate: true
  }
}
