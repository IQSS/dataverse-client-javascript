import { BasicDatasetInformation } from '../../src/@types/basicDataset'
import { assert, SinonSandbox, SinonStub, createSandbox } from 'sinon'
import { MetadataBlocksUtil } from '../../src/utils/metadataBlocksUtil'
import { MetadataBlockField } from '../../src/@types/metadataBlockField'
import { createMetadataBlockField } from '../testHelpers/metadataBlockHelper'
import { createBasicDatasetInformation } from '../testHelpers/basicDatasetHelper'
import { DatasetUtil } from '../../src/utils/datasetUtil'
import { expect } from 'chai'

describe('DatasetUtil', () => {
  const sandbox: SinonSandbox = createSandbox()

  let basicDatasetInformation: BasicDatasetInformation

  let mockTitleMetadataBlockField: MetadataBlockField
  let mockSubtitleMetadataBlockField: MetadataBlockField
  let mockAuthorMetadataBlockField: MetadataBlockField
  let mockDescriptionMetadataBlockField: MetadataBlockField
  let mockSubjectMetadataBlockField: MetadataBlockField
  let mockContactMetadataBlockField: MetadataBlockField

  let createTitleFieldStub: SinonStub
  let createSubtitleFieldStub: SinonStub
  let createAuthorFieldStub: SinonStub
  let createDescriptionFieldStub: SinonStub
  let createSubjectFieldStub: SinonStub
  let createContactFieldStub: SinonStub

  beforeEach(() => {
    basicDatasetInformation = createBasicDatasetInformation()

    mockTitleMetadataBlockField = createMetadataBlockField()
    mockSubtitleMetadataBlockField = createMetadataBlockField()
    mockAuthorMetadataBlockField = createMetadataBlockField()
    mockDescriptionMetadataBlockField = createMetadataBlockField()
    mockSubjectMetadataBlockField = createMetadataBlockField()
    mockContactMetadataBlockField = createMetadataBlockField()

    createTitleFieldStub = sandbox.stub(MetadataBlocksUtil, 'createTitleField').returns(mockTitleMetadataBlockField)
    createSubtitleFieldStub = sandbox.stub(MetadataBlocksUtil, 'createSubtitleField').returns(mockSubtitleMetadataBlockField)
    createAuthorFieldStub = sandbox.stub(MetadataBlocksUtil, 'createAuthorField').returns(mockAuthorMetadataBlockField)
    createDescriptionFieldStub = sandbox.stub(MetadataBlocksUtil, 'createDescriptionField').returns(mockDescriptionMetadataBlockField)
    createSubjectFieldStub = sandbox.stub(MetadataBlocksUtil, 'createSubjectField').returns(mockSubjectMetadataBlockField)
    createContactFieldStub = sandbox.stub(MetadataBlocksUtil, 'createContactField').returns(mockContactMetadataBlockField)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('mapBasicDatasetInformation', () => {
    it('should return expected dataset metadata block fields', async () => {
      const expectedResult = {
        datasetVersion: {
          metadataBlocks: {
            citation: {
              displayName: 'Citation Metadata',
              fields: [{
                multiple: mockTitleMetadataBlockField.multiple,
                typeClass: mockTitleMetadataBlockField.typeClass,
                typeName: mockTitleMetadataBlockField.typeName,
                value: mockTitleMetadataBlockField.value
              }, {
                multiple: mockSubtitleMetadataBlockField.multiple,
                typeClass: mockSubtitleMetadataBlockField.typeClass,
                typeName: mockSubtitleMetadataBlockField.typeName,
                value: mockSubtitleMetadataBlockField.value
              }, {
                multiple: mockAuthorMetadataBlockField.multiple,
                typeClass: mockAuthorMetadataBlockField.typeClass,
                typeName: mockAuthorMetadataBlockField.typeName,
                value: mockAuthorMetadataBlockField.value
              }, {
                multiple: mockDescriptionMetadataBlockField.multiple,
                typeClass: mockDescriptionMetadataBlockField.typeClass,
                typeName: mockDescriptionMetadataBlockField.typeName,
                value: mockDescriptionMetadataBlockField.value
              }, {
                multiple: mockSubjectMetadataBlockField.multiple,
                typeClass: mockSubjectMetadataBlockField.typeClass,
                typeName: mockSubjectMetadataBlockField.typeName,
                value: mockSubjectMetadataBlockField.value
              },
              {
                multiple: mockContactMetadataBlockField.multiple,
                typeClass: mockContactMetadataBlockField.typeClass,
                typeName: mockContactMetadataBlockField.typeName,
                value: mockContactMetadataBlockField.value
              }]
            }
          }
        }
      }

      const result = DatasetUtil.mapBasicDatasetInformation(basicDatasetInformation)

      expect(result).to.be.deep.equal(expectedResult)
    })

    describe('null or undefined title', () => {
      [null, undefined].forEach(title => {
        it('should not call createTitleField', async () => {
          basicDatasetInformation.title = title

          DatasetUtil.mapBasicDatasetInformation(basicDatasetInformation)

          assert.notCalled(createTitleFieldStub)
        })
      })
    })

    describe('null or undefined subtitle', () => {
      [null, undefined].forEach(subtitle => {
        it('should not call createSubtitleField', async () => {
          basicDatasetInformation.subtitle = subtitle

          DatasetUtil.mapBasicDatasetInformation(basicDatasetInformation)

          assert.notCalled(createSubtitleFieldStub)
        })
      })
    })

    describe('null or undefined authors', () => {
      [null, undefined].forEach(authors => {
        it('should not call createAuthorField', async () => {
          basicDatasetInformation.authors = authors

          DatasetUtil.mapBasicDatasetInformation(basicDatasetInformation)

          assert.notCalled(createAuthorFieldStub)
        })
      })
    })

    describe('null or undefined descriptions', () => {
      [null, undefined].forEach(descriptions => {
        it('should not call createDescriptionField', async () => {
          basicDatasetInformation.descriptions = descriptions

          DatasetUtil.mapBasicDatasetInformation(basicDatasetInformation)

          assert.notCalled(createDescriptionFieldStub)
        })
      })
    })

    describe('null or undefined subject', () => {
      [null, undefined].forEach(subject => {
        it('should not call createSubjectField', async () => {
          basicDatasetInformation.subject = subject

          DatasetUtil.mapBasicDatasetInformation(basicDatasetInformation)

          assert.notCalled(createSubjectFieldStub)
        })
      })
    })

    describe('null or undefined contact', () => {
      [null, undefined].forEach(contact => {
        it('should not call createSubjectField', async () => {
          basicDatasetInformation.contact = contact

          DatasetUtil.mapBasicDatasetInformation(basicDatasetInformation)

          assert.notCalled(createContactFieldStub)
        })
      })
    })
  })
})