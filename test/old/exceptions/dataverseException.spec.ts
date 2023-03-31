import { DataverseException } from '../../src/exceptions/dataverseException'
import { random } from 'faker'
import { expect } from 'chai'

describe('DataverseException', () => {
  let statusCode: number
  let message: string

  beforeEach(() => {
    statusCode = random.number()
    message = random.words()
  })

  it('should create expected exception', async () => {
    const result = new DataverseException(statusCode, message)

    expect(result.errorCode).to.be.equal(statusCode)
    expect(result.message).to.be.equal(message)
  })

  describe('missing message', () => {
    it('should create expected exception', async () => {
      const result = new DataverseException(statusCode)

      expect(result.errorCode).to.be.equal(statusCode)
      expect(result.message).to.be.equal('')
    })
  })
})