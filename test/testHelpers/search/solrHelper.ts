import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import { TestConstants } from '../TestConstants'

const TEST_SOLR_COLLECTION_URL = 'http://localhost:8983/solr/collection1'
const TEST_SOLR_CORE_ADMIN_URL = 'http://localhost:8983/solr/admin/cores'
const TEST_SOLR_SCHEMA_PATHS = [
  path.resolve(
    __dirname,
    '../../environment/docker-dev-volumes/solr/data/data/collection1/conf/schema.xml'
  ),
  path.resolve(__dirname, '../../environment/docker-dev-volumes/solr/conf/conf/schema.xml')
]

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

export const solrSchemaFieldExistsViaApi = async (fieldName: string): Promise<boolean> => {
  try {
    await axios.get(`${TEST_SOLR_COLLECTION_URL}/schema/fields/${fieldName}`)
    return true
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false
    }

    const message = axios.isAxiosError(error)
      ? `[${error.response?.status}] ${error.response?.data?.error?.msg ?? error.message}`
      : `${error}`
    throw new Error(`Error while checking Solr schema field ${fieldName}. Reason was: ${message}`)
  }
}

export const replaceSolrSchemaWithDataverseGeneratedSchemaViaApi = async (): Promise<void> => {
  const generatedSchemaFragment = await getDataverseGeneratedSolrSchemaFragment()
  writeSolrSchemaFiles(generatedSchemaFragment)
  await reloadSolrCoreViaApi()
}

const getDataverseGeneratedSolrSchemaFragment = async (): Promise<string> => {
  try {
    const response = await axios.get(
      `${TestConstants.TEST_API_URL}/admin/index/solr/schema`,
      DATAVERSE_API_REQUEST_HEADERS
    )

    if (typeof response.data !== 'string') {
      throw new Error('Generated schema response was not text.')
    }

    return response.data
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? `[${error.response?.status}] ${error.response?.data?.message ?? error.message}`
      : `${error}`
    throw new Error(`Error while getting Dataverse-generated Solr schema. Reason was: ${message}`)
  }
}

const writeSolrSchemaFiles = (generatedSchemaFragment: string): void => {
  const schemaPathsWritten = TEST_SOLR_SCHEMA_PATHS.filter((schemaPath) =>
    fs.existsSync(schemaPath)
  )

  if (schemaPathsWritten.length === 0) {
    throw new Error('Could not find a mounted Solr schema.xml file to update.')
  }

  schemaPathsWritten.forEach((schemaPath) => {
    fs.writeFileSync(
      schemaPath,
      mergeGeneratedSchemaFragment(fs.readFileSync(schemaPath, 'utf8'), generatedSchemaFragment)
    )
  })
}

const mergeGeneratedSchemaFragment = (
  currentSchema: string,
  generatedSchemaFragment: string
): string => {
  const generatedSchemaLines = generatedSchemaFragment.split('\n')
  const fieldLines = generatedSchemaLines.filter((line) => line.includes('<field '))
  const copyFieldLines = generatedSchemaLines.filter((line) => line.includes('<copyField '))

  return replaceSchemaSection(
    replaceSchemaSection(
      currentSchema,
      '<!-- SCHEMA-FIELDS::BEGIN -->',
      '<!-- SCHEMA-FIELDS::END -->',
      fieldLines
    ),
    '<!-- SCHEMA-COPY-FIELDS::BEGIN -->',
    '<!-- SCHEMA-COPY-FIELDS::END -->',
    copyFieldLines
  )
}

const replaceSchemaSection = (
  schema: string,
  beginMarker: string,
  endMarker: string,
  replacementLines: string[]
): string => {
  const beginIndex = schema.indexOf(beginMarker)
  const endIndex = schema.indexOf(endMarker)

  if (beginIndex === -1 || endIndex === -1 || beginIndex > endIndex) {
    throw new Error(`Could not find Solr schema section ${beginMarker}.`)
  }

  return [
    schema.slice(0, beginIndex + beginMarker.length),
    '',
    replacementLines.join('\n'),
    schema.slice(endIndex)
  ].join('\n')
}

const reloadSolrCoreViaApi = async (): Promise<void> => {
  try {
    await axios.get(TEST_SOLR_CORE_ADMIN_URL, {
      params: { action: 'RELOAD', core: 'collection1', wt: 'json' }
    })
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? `[${error.response?.status}] ${error.response?.data?.error?.msg ?? error.message}`
      : `${error}`
    throw new Error(`Error while reloading Solr core. Reason was: ${message}`)
  }
}
