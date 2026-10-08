import { ExportDatasetMetadata } from '../../../src/datasets/domain/useCases/ExportDatasetMetadata'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { ExportedDatasetMetadata } from '../../../src/datasets/domain/models/ExportedDatasetMetadata'
import { DatasetNotNumberedVersion } from '../../../src/datasets/domain/models/DatasetNotNumberedVersion'

describe('ExportDatasetMetadata.execute', () => {
  const testDatasetId = 1
  const testExporter = 'ddi'

  test('should return exported dataset metadata on repository success', async () => {
    const expectedMetadata: ExportedDatasetMetadata = {
      content: '<codeBook></codeBook>',
      contentType: 'application/xml'
    }

    const datasetsRepositoryStub: IDatasetsRepository = {
      exportDatasetMetadata: jest.fn().mockResolvedValue(expectedMetadata)
    } as unknown as IDatasetsRepository

    const sut = new ExportDatasetMetadata(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId, testExporter, DatasetNotNumberedVersion.DRAFT)

    expect(actual).toEqual(expectedMetadata)
    expect(datasetsRepositoryStub.exportDatasetMetadata).toHaveBeenCalledWith(
      testDatasetId,
      testExporter,
      DatasetNotNumberedVersion.DRAFT
    )
  })

  test('should throw ReadError on repository failure', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {
      exportDatasetMetadata: jest.fn().mockRejectedValue(new ReadError())
    } as unknown as IDatasetsRepository

    const sut = new ExportDatasetMetadata(datasetsRepositoryStub)

    await expect(sut.execute(testDatasetId, testExporter)).rejects.toThrow(ReadError)
  })
})
