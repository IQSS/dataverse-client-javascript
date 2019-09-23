import {
  MetadataBlockField,
  MetadataBlockFieldAuthor, MetadataBlockFieldContact,
  MetadataBlockFieldDescription
} from '../@types/metadataBlockField'
import { FieldTypeClass } from '../@types/FieldTypeClass'
import { BasicDatasetAuthor, BasicDatasetContact, BasicDatasetDescription } from '../@types/basicDataset'
import { DatasetSubjects } from '../@types/datasetSubjects'

export const METADATA_BLOCK_FIELD_TITLE = 'title'
export const METADATA_BLOCK_FIELD_SUBTITLE = 'subtitle'
export const METADATA_BLOCK_FIELD_AUTHOR = 'author'
export const METADATA_BLOCK_FIELD_DS_DESCRIPTION = 'dsDescription'
export const METADATA_BLOCK_FIELD_SUBJECT = 'subject'
export const METADATA_BLOCK_FIELD_CONTACT = 'datasetContact'
export const METADATA_BLOCK_FIELD_AUTHOR_FULLNAME = 'authorName'
export const METADATA_BLOCK_FIELD_AUTHOR_AFFILIATION = 'authorAffiliation'
export const METADATA_BLOCK_FIELD_CONTACT_EMAIL = 'datasetContactEmail'
export const METADATA_BLOCK_FIELD_CONTACT_NAME = 'datasetContactName'

export class MetadataBlocksUtil {

  public static createTitleField(title: string): MetadataBlockField {
    return this.createField(METADATA_BLOCK_FIELD_TITLE, FieldTypeClass.PRIMITIVE.toString(), false, title)
  }

  public static createSubtitleField(subtitle: string): MetadataBlockField {
    return this.createField(METADATA_BLOCK_FIELD_SUBTITLE, FieldTypeClass.PRIMITIVE.toString(), false, subtitle)
  }

  public static createAuthorField(basicDatasetAuthors: BasicDatasetAuthor[]): MetadataBlockField {
    const authors: MetadataBlockFieldAuthor[] = []

    basicDatasetAuthors.forEach((basicAuthor: BasicDatasetAuthor) => {
      const author: MetadataBlockFieldAuthor = {
        authorName: {
          value: basicAuthor.fullname,
          typeClass: FieldTypeClass.PRIMITIVE,
          typeName: METADATA_BLOCK_FIELD_AUTHOR_FULLNAME,
          multiple: false
        }
      }

      if (basicAuthor.affiliation) {
        author.authorAffiliation = {
          value: basicAuthor.affiliation,
          typeClass: FieldTypeClass.PRIMITIVE,
          typeName: METADATA_BLOCK_FIELD_AUTHOR_AFFILIATION,
          multiple: false
        }
      }

      authors.push(author)
    })

    return this.createField(METADATA_BLOCK_FIELD_AUTHOR, FieldTypeClass.COMPOUND.toString(), true, authors)
  }

  public static createDescriptionField(basicDescriptions: BasicDatasetDescription[]): MetadataBlockField {
    const descriptions: MetadataBlockFieldDescription[] = []

    basicDescriptions.forEach((description: BasicDatasetDescription) => {
      descriptions.push({
        dsDescriptionValue: {
          typeName: 'dsDescriptionValue',
          typeClass: FieldTypeClass.PRIMITIVE.toString(),
          multiple: false,
          value: description.text
        },
        dsDescriptionDate: {
          typeName: 'dsDescriptionDate',
          typeClass: FieldTypeClass.PRIMITIVE.toString(),
          multiple: false,
          value: description.date
        }
      })
    })

    return this.createField(METADATA_BLOCK_FIELD_DS_DESCRIPTION, FieldTypeClass.COMPOUND.toString(), true, descriptions)
  }

  public static createSubjectField(basicSubjects: DatasetSubjects[]): MetadataBlockField {
    const subjects: string[] = []

    basicSubjects.forEach(subject => {
      subjects.push(subject.toString())
    })

    return this.createField(METADATA_BLOCK_FIELD_SUBJECT, FieldTypeClass.CONTROLLED_VOCABULARY.toString(), true, subjects)
  }

  public static createContactField(basicContacts: BasicDatasetContact[]): MetadataBlockField {
    const contacts: MetadataBlockFieldContact[] = []

    basicContacts.forEach(contact => {
      const input: MetadataBlockFieldContact = {}

      if (contact.email) {
        input.datasetContactEmail = {
          typeClass: FieldTypeClass.PRIMITIVE,
          multiple: false,
          typeName: METADATA_BLOCK_FIELD_CONTACT_EMAIL,
          value: contact.email
        }
      }

      if (contact.fullname) {
        input.datasetContactName = {
          typeClass: FieldTypeClass.PRIMITIVE,
          multiple: false,
          typeName: METADATA_BLOCK_FIELD_CONTACT_NAME,
          value: contact.fullname
        }
      }

      contacts.push(input)
    })

    return this.createField(METADATA_BLOCK_FIELD_CONTACT, FieldTypeClass.COMPOUND.toString(), true, contacts)
  }

  private static createField(typeName: string, typeClass: string, multiple: boolean, value: any): MetadataBlockField {
    return {
      typeName: typeName,
      typeClass: typeClass,
      multiple: multiple,
      value: value
    }
  }
}