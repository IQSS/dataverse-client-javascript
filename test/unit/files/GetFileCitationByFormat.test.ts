import { ReadError } from '../../../src'
import { FileCitationFormat } from '../../../src/files/domain/models/FileCitationFormat'
import { IFilesRepository } from '../../../src/files/domain/repositories/IFilesRepository'
import { GetFileCitationByFormat } from '../../../src/files/domain/useCases/GetFileCitationByFormat'

describe('execute', () => {
  const testId = 1

  test.each([
    {
      format: FileCitationFormat.ENDNOTE,
      contentType: 'XML',
      citation: '<?xml version="1.0" encoding="UTF-8"?><xml><records></records></xml>'
    },
    {
      format: FileCitationFormat.RIS,
      contentType: 'plain text',
      citation: 'TY  - DATA\nT1  - Test\nER  - '
    },
    {
      format: FileCitationFormat.BIBTEX,
      contentType: 'plain text',
      citation: '@article{test}'
    },
    {
      format: FileCitationFormat.CSL,
      contentType: 'JSON',
      citation: JSON.stringify([{ id: 'doi:10.5072/FK2/TEST', type: 'dataset' }])
    },
    {
      format: FileCitationFormat.INTERNAL,
      contentType: 'HTML',
      citation: '<a href="https://doi.org/10.5072/FK2/TEST">Test Dataset</a>'
    }
  ])(
    'should return file citation in $contentType when format is $format',
    async ({ format, citation }) => {
      const filesRepositoryStub = <IFilesRepository>{}
      filesRepositoryStub.getFileCitationByFormat = jest.fn().mockResolvedValue(citation)

      const sut = new GetFileCitationByFormat(filesRepositoryStub)

      const actual = await sut.execute(testId, format)

      expect(actual).toEqual(citation)
      expect(filesRepositoryStub.getFileCitationByFormat).toHaveBeenCalledWith(
        testId,
        format,
        undefined
      )
    }
  )

  test.each(['1.0', ':draft', ':latest', ':latest-published'])(
    'should forward dataset version %s and a persistent identifier',
    async (version) => {
      const repository = <IFilesRepository>{}
      repository.getFileCitationByFormat = jest.fn().mockResolvedValue('citation')
      const sut = new GetFileCitationByFormat(repository)
      const fileId = 'doi:10.5072/FK2/TEST/FILE'

      await expect(sut.execute(fileId, FileCitationFormat.ENDNOTE, version)).resolves.toBe(
        'citation'
      )
      expect(repository.getFileCitationByFormat).toHaveBeenCalledWith(
        fileId,
        FileCitationFormat.ENDNOTE,
        version
      )
    }
  )

  test('should return error result on repository error', async () => {
    const filesRepositoryStub = <IFilesRepository>{}
    filesRepositoryStub.getFileCitationByFormat = jest.fn().mockRejectedValue(new ReadError())

    const sut = new GetFileCitationByFormat(filesRepositoryStub)

    await expect(sut.execute(testId, FileCitationFormat.BIBTEX)).rejects.toThrow(ReadError)
  })
})
