import { License, ReadError } from '../../../src'
import { ILicensesRepository } from '../../../src/licenses/domain/repositories/ILicensesRepository'
import { GetAvailableStandardLicenses } from '../../../src/licenses/domain/useCases/GetAvailableStandardLicenses'

describe('GetAvailableStandardLicenses', () => {
  describe('execute', () => {
    test('should return licenses array on repository success', async () => {
      const licensesRepositoryStub: ILicensesRepository = {} as ILicensesRepository

      const testLicenses: License[] = [
        {
          id: 1,
          name: 'CC0 1.0',
          uri: 'http://creativecommons.org/publicdomain/zero/1.0',
          iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png',
          active: true,
          isDefault: true,
          sortOrder: 0,
          rightsIdentifier: 'CC0-1.0',
          rightsIdentifierScheme: 'SPDX',
          schemeUri: 'https://spdx.org/licenses/',
          languageCode: 'en'
        },
        {
          id: 2,
          name: 'CC BY 4.0',
          uri: 'http://creativecommons.org/licenses/by/4.0',
          iconUri: 'https://licensebuttons.net/l/by/4.0/88x31.png',
          active: true,
          isDefault: false,
          sortOrder: 2,
          rightsIdentifier: 'CC-BY-4.0',
          rightsIdentifierScheme: 'SPDX',
          schemeUri: 'https://spdx.org/licenses/',
          languageCode: 'en'
        }
      ]

      licensesRepositoryStub.getAvailableStandardLicenses = jest
        .fn()
        .mockResolvedValue(testLicenses)
      const sut = new GetAvailableStandardLicenses(licensesRepositoryStub)

      const actual = await sut.execute()

      expect(actual).toEqual(testLicenses)
      expect(licensesRepositoryStub.getAvailableStandardLicenses).toHaveBeenCalledTimes(1)
    })

    test('should return error result on repository error', async () => {
      const licensesRepositoryStub: ILicensesRepository = {} as ILicensesRepository
      const expectedError = new ReadError('Failed to fetch licenses')
      licensesRepositoryStub.getAvailableStandardLicenses = jest
        .fn()
        .mockRejectedValue(expectedError)
      const sut = new GetAvailableStandardLicenses(licensesRepositoryStub)

      await expect(sut.execute()).rejects.toThrow(ReadError)
      expect(licensesRepositoryStub.getAvailableStandardLicenses).toHaveBeenCalledTimes(1)
    })
  })
})
