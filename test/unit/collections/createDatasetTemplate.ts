import { CreateDatasetTemplate } from '../../../src/collections/domain/useCases/CreateDatasetTemplate'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { CreateDatasetTemplateDTO } from '../../../src/collections/domain/dtos/CreateDatasetTemplateDTO'
import { WriteError } from '../../../src'

describe('execute', () => {
  const testTemplateDTO = { name: 't' } as CreateDatasetTemplateDTO
  const testCollectionId = 1

  test('should return undefined when repository call is successful', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.createDatasetTemplate = jest.fn().mockResolvedValue(testCollectionId)
    const sut = new CreateDatasetTemplate(collectionRepositoryStub)

    const actual = await sut.execute(testTemplateDTO)

    expect(collectionRepositoryStub.createDatasetTemplate).toHaveBeenCalledWith(
      ':root',
      testTemplateDTO
    )
    expect(actual).toEqual(testCollectionId)
  })

  test('should call repository with provided collection id/alias', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.createDatasetTemplate = jest.fn().mockResolvedValue(testCollectionId)

    const sut = new CreateDatasetTemplate(collectionRepositoryStub)
    const actual = await sut.execute(testTemplateDTO, 'alias123')

    expect(collectionRepositoryStub.createDatasetTemplate).toHaveBeenCalledWith(
      'alias123',
      testTemplateDTO
    )

    expect(actual).toEqual(testCollectionId)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.createDatasetTemplate = jest.fn().mockRejectedValue(new WriteError())
    const testCreateTemplate = new CreateDatasetTemplate(collectionRepositoryStub)

    await expect(testCreateTemplate.execute(testTemplateDTO)).rejects.toThrow(WriteError)
  })
})
