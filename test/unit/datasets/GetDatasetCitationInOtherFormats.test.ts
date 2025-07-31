import { GetDatasetCitationInOtherFormats } from '../../../src/datasets/domain/useCases/GetDatasetCitationInOtherFormats'
import { IDatasetsRepository } from '../../../src/datasets/domain/repositories/IDatasetsRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { CitationFormat } from '../../../src/datasets/domain/models/CitationFormat'
import { DatasetNotNumberedVersion } from '../../../src/datasets/domain/models/DatasetNotNumberedVersion'
import { FormattedCitation } from '../../../src/datasets/domain/models/FormattedCitation'

describe('GetDatasetCitationInOtherFormats.execute', () => {
  const testDatasetId = 1
  const testFormat: CitationFormat = CitationFormat.BibTeX
  const testVersion: DatasetNotNumberedVersion = DatasetNotNumberedVersion.LATEST

  test('should return citation response on repository success', async () => {
    const expectedCitation: FormattedCitation = {
      content: '@data{example, ...}',
      contentType: 'text/plain'
    }

    const datasetsRepositoryStub: IDatasetsRepository = {
      getDatasetCitationInOtherFormats: jest.fn().mockResolvedValue(expectedCitation)
    } as unknown as IDatasetsRepository

    const sut = new GetDatasetCitationInOtherFormats(datasetsRepositoryStub)

    const actual = await sut.execute(testDatasetId, testVersion, testFormat as CitationFormat)
    expect(actual).toEqual(expectedCitation)
  })

  test('should throw ReadError on repository failure', async () => {
    const datasetsRepositoryStub: IDatasetsRepository = {
      getDatasetCitationInOtherFormats: jest.fn().mockRejectedValue(new ReadError())
    } as unknown as IDatasetsRepository

    const sut = new GetDatasetCitationInOtherFormats(datasetsRepositoryStub)

    await expect(sut.execute(testDatasetId, testVersion, testFormat)).rejects.toThrow(ReadError)
  })
})
