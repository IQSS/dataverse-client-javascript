import { RemoveDefaultTemplate } from '../../../src/templates/domain/useCases/RemoveDefaultTemplate'
import { ITemplatesRepository } from '../../../src/templates/domain/repositories/ITemplatesRepository'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should remove default template for :root', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.unsetDefaultTemplate = jest.fn().mockResolvedValue(undefined)
    const sut = new RemoveDefaultTemplate(templatesRepositoryStub)

    const actual = await sut.execute()

    expect(templatesRepositoryStub.unsetDefaultTemplate).toHaveBeenCalledWith(':root')
    expect(actual).toBeUndefined()
  })

  test('should call repository with provided collection id/alias', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.unsetDefaultTemplate = jest.fn().mockResolvedValue(undefined)
    const sut = new RemoveDefaultTemplate(templatesRepositoryStub)

    const actual = await sut.execute('alias123')

    expect(templatesRepositoryStub.unsetDefaultTemplate).toHaveBeenCalledWith('alias123')
    expect(actual).toBeUndefined()
  })

  test('should return error result on repository error', async () => {
    const templatesRepositoryStub: ITemplatesRepository = {} as ITemplatesRepository
    templatesRepositoryStub.unsetDefaultTemplate = jest.fn().mockRejectedValue(new WriteError())
    const sut = new RemoveDefaultTemplate(templatesRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(WriteError)
  })
})
