import { MetadataBlockField } from '../../src/@types/metadataBlockField'
import { random } from 'faker'
import { FieldTypeClass } from '../../src/@types/FieldTypeClass'

export const createMetadataBlockField = (): MetadataBlockField => {
  return {
    typeName: random.word(),
    typeClass: FieldTypeClass.PRIMITIVE,
    multiple: false,
    value: random.words()
  }
}