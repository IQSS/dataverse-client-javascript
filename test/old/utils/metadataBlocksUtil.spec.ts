import {
  METADATA_BLOCK_FIELD_AUTHOR,
  METADATA_BLOCK_FIELD_AUTHOR_AFFILIATION,
  METADATA_BLOCK_FIELD_AUTHOR_FULLNAME,
  MetadataBlocksUtil
} from '../../src/utils/metadataBlocksUtil'
import { BasicDatasetAuthor } from '../../src/@types/basicDataset'
import { name, random, internet } from 'faker'
import { expect } from 'chai'
import { FieldTypeClass } from '../../src/@types/FieldTypeClass'
import { MetadataBlockField } from '../../src/@types/metadataBlockField'
import { DatasetSubjects } from '../../src/@types/datasetSubjects'

describe('MetadataBlocksUtil', () => {
  describe('createTitleField', () => {
    it('should return expected metadata block field', async () => {
      const title = random.words()

      const expectedResult: MetadataBlockField = {
        typeName: 'title',
        multiple: false,
        typeClass: 'primitive',
        value: title
      }

      const result = MetadataBlocksUtil.createTitleField(title)

      expect(result).to.be.deep.equal(expectedResult)
    })
  })

  describe('createSubtitleField', () => {
    it('should return expected metadata block field', async () => {
      const subtitle = random.words()

      const expectedResult: MetadataBlockField = {
        typeName: 'subtitle',
        multiple: false,
        typeClass: 'primitive',
        value: subtitle
      }

      const result = MetadataBlocksUtil.createSubtitleField(subtitle)

      expect(result).to.be.deep.equal(expectedResult)
    })
  })

  describe('createDescriptionField', () => {
    it('should return expected metadata block field', async () => {
      const description1 = random.words()
      const date1 = '2019-01-01'
      const description2 = random.words()
      const date2 = '2018-09-12'

      const expectedResult = {
        typeName: 'dsDescription',
        multiple: true,
        typeClass: 'compound',
        value: [
          {
            dsDescriptionValue: {
              typeName: 'dsDescriptionValue',
              typeClass: 'primitive',
              multiple: false,
              value: description1
            },
            dsDescriptionDate: {
              typeName: 'dsDescriptionDate',
              typeClass: 'primitive',
              multiple: false,
              value: date1
            }
          },
          {
            dsDescriptionValue: {
              typeName: 'dsDescriptionValue',
              typeClass: 'primitive',
              multiple: false,
              value: description2
            },
            dsDescriptionDate: {
              typeName: 'dsDescriptionDate',
              typeClass: 'primitive',
              multiple: false,
              value: date2
            }
          }
        ]
      }

      const result = MetadataBlocksUtil.createDescriptionField([
        {
          text: description1,
          date: date1
        }, {
          text: description2,
          date: date2
        }
      ])

      expect(result).to.be.deep.equal(expectedResult)
    })
  })

  describe('createAuthorField', () => {
    it('should return expected metadata block field', async () => {
      const fullname = `${name.firstName()} ${name.lastName()}`
      const affiliation = random.words()

      const expectedResult = {
        typeName: METADATA_BLOCK_FIELD_AUTHOR,
        typeClass: FieldTypeClass.COMPOUND,
        multiple: true,
        value: [
          {
            'authorName': {
              value: fullname,
              typeName: METADATA_BLOCK_FIELD_AUTHOR_FULLNAME,
              multiple: false,
              typeClass: FieldTypeClass.PRIMITIVE
            },
            'authorAffiliation': {
              value: affiliation,
              typeName: METADATA_BLOCK_FIELD_AUTHOR_AFFILIATION,
              multiple: false,
              typeClass: FieldTypeClass.PRIMITIVE
            },
          }
        ]
      }

      const input: BasicDatasetAuthor[] = [
        {
          fullname: fullname,
          affiliation: affiliation
        }
      ]

      const result = MetadataBlocksUtil.createAuthorField(input)

      expect(result).to.be.deep.equal(expectedResult)
    })
  })

  describe('createSubjectField', () => {
    it('should return expected subject metadata block field', async () => {
      const expectedResult = {
        typeName: 'subject',
        typeClass: 'controlledVocabulary',
        multiple: true,
        value: [
          'Agricultural Sciences',
          'Other'
        ]
      }

      const result = MetadataBlocksUtil.createSubjectField([
        DatasetSubjects.AGRICULTURAL_SCIENCE,
        DatasetSubjects.OTHER
      ])

      expect(result).to.be.deep.equal(expectedResult)
    })
  })

  describe('createContactField', () => {
    it('should return expected contact metadata block field', async () => {
      const contactEmail = internet.email()
      const contactName = `${name.firstName()} ${name.lastName()}`
      const expectedResult = {
        typeName: 'datasetContact',
        typeClass: 'compound',
        multiple: true,
        value: [
          {
            datasetContactEmail: {
              typeClass: FieldTypeClass.PRIMITIVE,
              typeName: 'datasetContactEmail',
              multiple: false,
              value: contactEmail
            },
            datasetContactName: {
              typeClass: FieldTypeClass.PRIMITIVE,
              typeName: 'datasetContactName',
              multiple: false,
              value: contactName
            }
          }
        ]
      }

      const result = MetadataBlocksUtil.createContactField([{ email: contactEmail, fullname: contactName }])

      expect(result).to.be.deep.equal(expectedResult)
    })

    describe('missing full name', () => {
      it('should return expected contact metadata block field', async () => {
        const contactEmail = internet.email()
        const expectedResult = {
          typeName: 'datasetContact',
          typeClass: 'compound',
          multiple: true,
          value: [
            {
              datasetContactEmail: {
                typeClass: FieldTypeClass.PRIMITIVE,
                typeName: 'datasetContactEmail',
                multiple: false,
                value: contactEmail
              }
            }
          ]
        }

        const result = MetadataBlocksUtil.createContactField([{ email: contactEmail }])

        expect(result).to.be.deep.equal(expectedResult)
      })
    })
  })
})