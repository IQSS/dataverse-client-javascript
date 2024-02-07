import { GetDataset } from '../../../src/datasets/domain/useCases/GetDataset'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { assert, createSandbox, SinonSandbox } from 'sinon'
import { createDatasetModel } from '../../testHelpers/datasets/datasetHelper'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { DatasetNotNumberedVersion } from '../../../src/datasets/domain/models/DatasetNotNumberedVersion'

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  test('should return dataset on repository success', async () => {
    const testDataset = createDatasetModel()
    const datasetsRepositoryStub = <IDatasetsRepository>{}
    const getDatasetStub = sandbox.stub().returns(testDataset)
    datasetsRepositoryStub.getDataset = getDatasetStub
    const sut = new GetDataset(datasetsRepositoryStub)

    const actual = await sut.execute(1)

    assert.match(actual, testDataset)
    assert.calledWithExactly(getDatasetStub, 1, DatasetNotNumberedVersion.LATEST, false)
  })

  test('should return error result on repository error', async () => {
    const datasetsRepositoryStub = <IDatasetsRepository>{}
    const testReadError = new ReadError()
    datasetsRepositoryStub.getDataset = sandbox.stub().throwsException(testReadError)
    const sut = new GetDataset(datasetsRepositoryStub)

    let actualError: ReadError = undefined
    await sut.execute(1).catch((e) => (actualError = e))

    assert.match(actualError, testReadError)
  })
})
