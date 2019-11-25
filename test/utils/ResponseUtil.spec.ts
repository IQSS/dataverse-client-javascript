import { ResponseUtil } from '../../src/utils/ResponseUtil'
import { random } from 'faker'

describe('ResponseUtil', () => {
  describe('getErrorMessage', () => {
    let mockMessage: string

    beforeEach(() => {
      mockMessage = random.words()
    })

    it('should return expected message', () => {
      const expectedResult: string = mockMessage

      const result: string = ResponseUtil.getErrorMessage(JSON.stringify({ message: mockMessage }))

      expect(result).toEqual(expectedResult)
    })
  })
})