import { Collection, CollectionFacet } from '../../../src/collections'
import { DvObjectType } from '../../../src'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'
import { TestConstants } from '../TestConstants'
import axios from 'axios'
import { CollectionDTO } from '../../../src/collections/domain/dtos/CollectionDTO'
import { NewCollectionRequestPayload } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { CollectionFacetPayload } from '../../../src/collections/infra/repositories/transformers/CollectionFacetPayload'
import { CollectionType } from '../../../src/collections/domain/models/CollectionType'

export const ROOT_COLLECTION_ALIAS = 'root'

const COLLECTION_ID = 11111
const COLLECTION_IS_RELEASED = true
const COLLECTION_ALIAS_STR = 'secondCollection'
const COLLECTION_NAME_STR = 'Laboratory Research'
const COLLECTION_AFFILIATION_STR = 'Laboratory Research Corporation'

const COLLECTION_DESCRIPTION = 'This is an <b>example</b> collection used for testing.'

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'Content-Type': 'application/json', 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

export const createCollectionModel = (): Collection => {
  const collectionModel: Collection = {
    id: COLLECTION_ID,
    alias: COLLECTION_ALIAS_STR,
    name: COLLECTION_NAME_STR,
    isReleased: COLLECTION_IS_RELEASED,
    affiliation: COLLECTION_AFFILIATION_STR,
    description: COLLECTION_DESCRIPTION,
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' },
    inputLevels: [
      {
        datasetFieldName: 'test',
        required: true,
        include: true
      }
    ],
    type: CollectionType.UNCATEGORIZED,
    contacts: [
      {
        email: 'dataverse@test.com',
        displayOrder: 0
      }
    ],
    isMetadataBlockRoot: true,
    isFacetRoot: true,
    childCount: 0
  }
  return collectionModel
}

export const createCollectionPayload = (): CollectionPayload => {
  const collectionPayload: CollectionPayload = {
    id: COLLECTION_ID,
    alias: COLLECTION_ALIAS_STR,
    name: COLLECTION_NAME_STR,
    isReleased: COLLECTION_IS_RELEASED,
    affiliation: COLLECTION_AFFILIATION_STR,
    description: COLLECTION_DESCRIPTION,
    isPartOf: { type: DvObjectType.DATAVERSE, identifier: 'root', displayName: 'Root' },
    inputLevels: [
      {
        datasetFieldTypeName: 'test',
        required: true,
        include: true
      }
    ],
    dataverseType: CollectionType.UNCATEGORIZED,
    dataverseContacts: [
      {
        contactEmail: 'dataverse@test.com',
        displayOrder: 0
      }
    ],
    isMetadataBlockRoot: true,
    isFacetRoot: true,
    childCount: 0
  }
  return collectionPayload
}

export async function createCollectionViaApi(
  collectionAlias: string,
  parentCollectionAlias: string | undefined = undefined
): Promise<CollectionPayload> {
  try {
    if (parentCollectionAlias == undefined) {
      parentCollectionAlias = ':root'
    }
    return await axios
      .post(
        `${TestConstants.TEST_API_URL}/dataverses/${parentCollectionAlias}`,
        JSON.stringify({
          alias: collectionAlias,
          name: 'Scientific Research',
          dataverseContacts: [
            {
              contactEmail: 'pi@example.edu'
            },
            {
              contactEmail: 'student@example.edu'
            }
          ],
          affiliation: 'Scientific Research University',
          description: 'We do all the science.',
          dataverseType: 'LABORATORY'
        }),
        DATAVERSE_API_REQUEST_HEADERS
      )
      .then((response) => response.data.data)
  } catch (error) {
    throw new Error(`Error while creating test collection ${collectionAlias}`)
  }
}

export async function deleteCollectionViaApi(collectionAlias: string): Promise<void> {
  try {
    return await axios.delete(
      `${TestConstants.TEST_API_URL}/dataverses/${collectionAlias}`,
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    console.log(error)
    throw new Error(`Error while deleting test collection ${collectionAlias}`)
  }
}

export async function setStorageDriverViaApi(
  collectionAlias: string,
  driverLabel: string
): Promise<void> {
  try {
    return await axios.put(
      `${TestConstants.TEST_API_URL}/admin/dataverse/${collectionAlias}/storageDriver`,
      driverLabel,
      {
        headers: { 'Content-Type': 'text/plain', 'X-Dataverse-Key': process.env.TEST_API_KEY }
      }
    )
  } catch (error) {
    console.log(error)
    throw new Error(`Error while setting storage driver for collection ${collectionAlias}`)
  }
}

export async function publishCollectionViaApi(collectionAlias: string): Promise<void> {
  try {
    return await axios.post(
      `${TestConstants.TEST_API_URL}/dataverses/${collectionAlias}/actions/:publish`,
      {},
      DATAVERSE_API_REQUEST_HEADERS
    )
  } catch (error) {
    throw new Error(`Error while publishing test collection ${collectionAlias}`)
  }
}

export const createCollectionDTO = (alias = 'test-collection'): CollectionDTO => {
  return {
    alias: alias,
    name: 'Test Collection',
    contacts: ['dataverse@test.com'],
    type: CollectionType.DEPARTMENT,
    metadataBlockNames: ['citation', 'geospatial'],
    facetIds: ['authorName', 'authorAffiliation'],
    description: 'test description',
    affiliation: 'test affiliation',
    inputLevels: [
      {
        datasetFieldName: 'geographicCoverage',
        required: true,
        include: true
      }
    ],
    inheritFacetsFromParent: false,
    inheritMetadataBlocksFromParent: false
  }
}

export const createNewCollectionRequestPayload = (): NewCollectionRequestPayload => {
  return {
    alias: 'test-collection',
    name: 'Test Collection',
    dataverseContacts: [
      {
        contactEmail: 'dataverse@test.com'
      }
    ],
    dataverseType: 'DEPARTMENT',
    description: 'test description',
    affiliation: 'test affiliation',
    metadataBlocks: {
      metadataBlockNames: ['citation', 'geospatial'],
      inputLevels: [
        {
          datasetFieldTypeName: 'geographicCoverage',
          include: true,
          required: true
        }
      ],
      facetIds: ['authorName', 'authorAffiliation'],
      inheritMetadataBlocksFromParent: false,
      inheritFacetsFromParent: false
    }
  }
}

export const createCollectionFacetModel = (): CollectionFacet => {
  return {
    id: 1,
    name: 'testName',
    displayName: 'testDisplayName'
  }
}

export const createCollectionFacetRequestPayload = (): CollectionFacetPayload => {
  return {
    id: '1',
    name: 'testName',
    displayName: 'testDisplayName'
  }
}

export const CONTENT_FIELD_WITH_ALL_TAGS =
  '<h1 class="rte-heading">A title</h1><p class="rte-paragraph">Esto es una oracion que contiene texto en <strong class="rte-bold">negrita</strong>, <em class="rte-italic">italica</em>, <u class="rte-underline">subrayada</u>, <s class="rte-strike">tachado</s>, <code class="rte-code">de tipo code</code>, este es <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://youtube.com">un link que apunta a youtube</a>.</p><p class="rte-paragraph">Una lista desordenada:</p><ul class="rte-bullet-list"><li><p class="rte-paragraph">Item</p></li><li><p class="rte-paragraph">Item</p></li></ul><p class="rte-paragraph">Una lista ordenada:</p><ol class="rte-ordered-list"><li><p class="rte-paragraph">Item 1</p></li><li><p class="rte-paragraph">Item 2</p></li></ol><blockquote class="rte-blockquote"><p class="rte-paragraph">Este es un blockquote.</p></blockquote><p class="rte-paragraph">Esto que viene es un bloque de codigo.</p><pre class="rte-code-block"><code>      &lt;Controller name={`featuredItems.${itemIndex}.content`} control={control} rules={rules} render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) =&gt; { console.log({ value }) return ( &lt;Col&gt; &lt;RichTextEditor initialValue={value as string} editorContentAriaLabelledBy={`featuredItems.${itemIndex}.content`} onChange={onChange} invalid={invalid} ariaRequired ref={ref} /&gt; {invalid &amp;&amp; &lt;div className={styles["error-msg"]}&gt;{error?.message}&lt;/div&gt;} &lt;/Col&gt; ) }} /&gt;</code></pre>'

export const EXPECTED_CONTENT_FIELD_WITH_ALL_TAGS =
  '<h1 class="rte-heading">A title</h1>\n' +
  '<p class="rte-paragraph">Esto es una oracion que contiene texto en <strong class="rte-bold">negrita</strong>, <em class="rte-italic">italica</em>, <u class="rte-underline">subrayada</u>, <s class="rte-strike">tachado</s>, <code class="rte-code">de tipo code</code>, este es <a target="_blank" rel="noopener noreferrer nofollow" class="rte-link" href="https://youtube.com">un link que apunta a youtube</a>.</p>\n' +
  '<p class="rte-paragraph">Una lista desordenada:</p>\n' +
  '<ul class="rte-bullet-list">\n' +
  ' <li><p class="rte-paragraph">Item</p></li>\n' +
  ' <li><p class="rte-paragraph">Item</p></li>\n' +
  '</ul>\n' +
  '<p class="rte-paragraph">Una lista ordenada:</p>\n' +
  '<ol class="rte-ordered-list">\n' +
  ' <li><p class="rte-paragraph">Item 1</p></li>\n' +
  ' <li><p class="rte-paragraph">Item 2</p></li>\n' +
  '</ol>\n' +
  '<blockquote class="rte-blockquote">\n' +
  ' <p class="rte-paragraph">Este es un blockquote.</p>\n' +
  '</blockquote>\n' +
  '<p class="rte-paragraph">Esto que viene es un bloque de codigo.</p>\n' +
  '<pre class="rte-code-block"><code>      &lt;Controller name={`featuredItems.${itemIndex}.content`} control={control} rules={rules} render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) =&gt; { console.log({ value }) return ( &lt;Col&gt; &lt;RichTextEditor initialValue={value as string} editorContentAriaLabelledBy={`featuredItems.${itemIndex}.content`} onChange={onChange} invalid={invalid} ariaRequired ref={ref} /&gt; {invalid &amp;&amp; &lt;div className={styles["error-msg"]}&gt;{error?.message}&lt;/div&gt;} &lt;/Col&gt; ) }} /&gt;</code></pre>'
