import { FilesConfig } from '../../../src/files'

describe('FilesConfig', () => {
  beforeEach(() => {
    // Reset config before each test
    FilesConfig.init({})
  })

  describe('init', () => {
    test('should set useS3Tagging configuration', () => {
      FilesConfig.init({ useS3Tagging: false })

      const config = FilesConfig.getConfig()
      expect(config.useS3Tagging).toBe(false)
    })

    test('should set maxMultipartRetries configuration', () => {
      FilesConfig.init({ maxMultipartRetries: 10 })

      const config = FilesConfig.getConfig()
      expect(config.maxMultipartRetries).toBe(10)
    })

    test('should set fileUploadTimeoutMs configuration', () => {
      FilesConfig.init({ fileUploadTimeoutMs: 120000 })

      const config = FilesConfig.getConfig()
      expect(config.fileUploadTimeoutMs).toBe(120000)
    })

    test('should set multiple configuration options', () => {
      FilesConfig.init({
        useS3Tagging: false,
        maxMultipartRetries: 3,
        fileUploadTimeoutMs: 30000
      })

      const config = FilesConfig.getConfig()
      expect(config.useS3Tagging).toBe(false)
      expect(config.maxMultipartRetries).toBe(3)
      expect(config.fileUploadTimeoutMs).toBe(30000)
    })
  })

  describe('getConfig', () => {
    test('should return empty config by default', () => {
      const config = FilesConfig.getConfig()
      expect(config).toEqual({})
    })

    test('should return previously set config', () => {
      const expectedConfig = { useS3Tagging: true, maxMultipartRetries: 5 }
      FilesConfig.init(expectedConfig)

      const config = FilesConfig.getConfig()
      expect(config).toEqual(expectedConfig)
    })
  })
})
