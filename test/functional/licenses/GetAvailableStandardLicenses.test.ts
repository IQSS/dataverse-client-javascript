import { ApiConfig, getAvailableStandardLicenses, License } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('getAvailableStandardLicenses', () => {
  describe('execute', () => {
    beforeAll(async () => {
      ApiConfig.init(
        TestConstants.TEST_API_URL,
        DataverseApiAuthMechanism.API_KEY,
        process.env.TEST_API_KEY
      )
    })

    test('should return available standard license terms', async () => {
      const actualLicenses: License[] = await getAvailableStandardLicenses.execute()
      const expectedLicenses: License[] = [
        {
          id: 1,
          name: 'CC0 1.0',
          shortDescription: 'Creative Commons CC0 1.0 Universal Public Domain Dedication.',
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
          shortDescription: 'Creative Commons Attribution 4.0 International License.',
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

      expect(actualLicenses).toEqual(expectedLicenses)
    })
  })
})
