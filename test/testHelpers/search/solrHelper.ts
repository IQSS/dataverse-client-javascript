import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import axios from 'axios'
import { TestConstants } from '../TestConstants'

const execFileAsync = promisify(execFile)

const TEST_SOLR_CONTAINER_NAME = 'test_solr'
const TEST_SOLR_SCHEMA_PATH = '/var/solr/data/collection1/conf/schema.xml'
const TEST_SOLR_COLLECTION_URL = 'http://localhost:8983/solr/collection1'
const TEST_SOLR_CORE_ADMIN_URL = 'http://localhost:8983/solr/admin/cores'

const DATAVERSE_API_REQUEST_HEADERS = {
  headers: { 'X-Dataverse-Key': process.env.TEST_API_KEY }
}

type ExecFileError = Error & {
  stderr?: string
  stdout?: string
}

export const solrSchemaFieldExistsViaDocker = async (fieldName: string): Promise<boolean> => {
  const statusCode = await runDockerCommand([
    'exec',
    TEST_SOLR_CONTAINER_NAME,
    'curl',
    '-sS',
    '-o',
    '/tmp/solr-schema-field-response.json',
    '-w',
    '%{http_code}',
    `${TEST_SOLR_COLLECTION_URL}/schema/fields/${encodeURIComponent(fieldName)}`
  ])

  if (statusCode.trim() === '200') {
    return true
  }

  if (statusCode.trim() === '404') {
    return false
  }

  throw new Error(`Unexpected Solr schema field check status for ${fieldName}: ${statusCode}`)
}

export const replaceSolrSchemaWithDataverseGeneratedSchemaViaDocker = async (): Promise<void> => {
  const generatedSchemaFragment = await getDataverseGeneratedSolrSchemaFragment()
  const currentSchema = await runDockerCommand([
    'exec',
    TEST_SOLR_CONTAINER_NAME,
    'cat',
    TEST_SOLR_SCHEMA_PATH
  ])
  const mergedSchema = mergeGeneratedSchemaFragment(currentSchema, generatedSchemaFragment)
  await copySchemaToSolrContainer(mergedSchema)
  await reloadSolrCoreViaDocker()
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

const copySchemaToSolrContainer = async (schemaXml: string): Promise<void> => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dataverse-solr-schema-'))
  const tempSchemaPath = path.join(tempDir, 'schema.xml')

  try {
    fs.writeFileSync(tempSchemaPath, schemaXml)
    await runDockerCommand([
      'cp',
      tempSchemaPath,
      `${TEST_SOLR_CONTAINER_NAME}:${TEST_SOLR_SCHEMA_PATH}`
    ])
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

const reloadSolrCoreViaDocker = async (): Promise<void> => {
  await runDockerCommand([
    'exec',
    TEST_SOLR_CONTAINER_NAME,
    'curl',
    '-sS',
    `${TEST_SOLR_CORE_ADMIN_URL}?action=RELOAD&core=collection1&wt=json`
  ])
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

const runDockerCommand = async (args: string[]): Promise<string> => {
  try {
    const { stdout } = await execFileAsync('docker', args, { maxBuffer: 10 * 1024 * 1024 })
    return stdout
  } catch (error) {
    const execError = error as ExecFileError
    throw new Error(
      `Docker command failed: docker ${args.join(' ')}. Reason was: ${
        execError.stderr ?? execError.stdout ?? execError.message
      }`
    )
  }
}
