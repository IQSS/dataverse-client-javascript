const { ApiConfig, getDataset, getDatasetStorageDriver, getCollection } = require('./dist')

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

async function main() {
  const DATAVERSE_API_URL = 'http://localhost:8080/api'
  const DATAVERSE_API_KEY = 'e79d640d-0cc1-465d-b5a1-1bc134d562e8'
  const DATASET_ID = 'reviews'
  const DATASET_VERSION = process.env.DATASET_VERSION || 'latest'

  ApiConfig.init(
    'http://localhost:8080/api',
    ApiConfig.API_KEY,
    'e79d640d-0cc1-465d-b5a1-1bc134d562e8'
  )

  getCollection
    .execute('reviews')
    .then((collection) => {
      console.log('Collection allowed dataset types:', collection.allowedDatasetTypes)
      console.log('Collection:', collection)
    })
    .catch((error) => {
      console.error('Error fetching collection:', {
        name: error?.name,
        message: error?.message,
        cause: error?.cause,
        stack: error?.stack
      })
    })
}

main().catch((error) => {
  console.error('Execution failed:')
  console.error(error?.message || error)
  process.exit(1)
})
