import { CreateTemplate } from '../../../src/collections/domain/useCases/CreateTemplate'
import { ICollectionsRepository } from '../../../src/collections/domain/repositories/ICollectionsRepository'
import { TemplateCreateDTO } from '../../../src/collections/domain/dtos/TemplateCreateDTO'
import { WriteError } from '../../../src'

describe('execute', () => {
  const testTemplateDTO = { name: 't' } as TemplateCreateDTO
  const testCollectionId = 1

  test('should return undefined when repository call is successful', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.createTemplate = jest.fn().mockResolvedValue(testCollectionId)
    const sut = new CreateTemplate(collectionRepositoryStub)

    const actual = await sut.execute(testTemplateDTO)

    expect(collectionRepositoryStub.createTemplate).toHaveBeenCalledWith(':root', testTemplateDTO)
    expect(actual).toEqual(testCollectionId)
  })

  test('should call repository with provided collection id/alias', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.createTemplate = jest.fn().mockResolvedValue(testCollectionId)

    const sut = new CreateTemplate(collectionRepositoryStub)
    const actual = await sut.execute(testTemplateDTO, 'alias123')

    expect(collectionRepositoryStub.createTemplate).toHaveBeenCalledWith(
      'alias123',
      testTemplateDTO
    )

    expect(actual).toEqual(testCollectionId)
  })

  test('should return error result on repository error', async () => {
    const collectionRepositoryStub: ICollectionsRepository = {} as ICollectionsRepository
    collectionRepositoryStub.createTemplate = jest.fn().mockRejectedValue(new WriteError())
    const testCreateTemplate = new CreateTemplate(collectionRepositoryStub)

    await expect(testCreateTemplate.execute(testTemplateDTO)).rejects.toThrow(WriteError)
  })
})
