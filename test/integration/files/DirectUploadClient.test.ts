import { CreatedDatasetIdentifiers, createDataset } from '../../../src'
//import { DirectUploadClient } from '../../../src/files/infra/clients/DirectUploadClient'
import { TestConstants } from '../../testHelpers/TestConstants'
import { createCollectionViaApi, deleteCollectionViaApi, setStorageDriverViaApi } from '../../testHelpers/collections/collectionHelper'
import { deleteUnpublishedDatasetViaApi } from '../../testHelpers/datasets/datasetHelper'

// TODO complete
describe.skip('DirectUploadClient', () => {
    const testCollectionAlias = 'directUploadTest'
    let testDatasetIds : CreatedDatasetIdentifiers
    //const sut: DirectUploadClient = new DirectUploadClient()

    describe('uploadFile', () => {
        beforeAll(async () => {
          await createCollectionViaApi(testCollectionAlias)
          await setStorageDriverViaApi(testCollectionAlias, 'LocalStack')
          testDatasetIds = await createDataset.execute(
            TestConstants.TEST_NEW_DATASET_DTO,
            testCollectionAlias
          )
        })
    
        afterAll(async () => {
          await deleteUnpublishedDatasetViaApi(testDatasetIds.numericId)
          await deleteCollectionViaApi(testCollectionAlias)
        })
    
        test('should upload file to destination when there is only one destination', async () => {
         
        })
      })
})
