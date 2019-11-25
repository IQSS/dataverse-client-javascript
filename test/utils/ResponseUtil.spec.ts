import { ResponseUtil } from '../../src/utils/ResponseUtil'
import { random } from 'faker'

describe('ResponseUtil', () => {
  describe('getErrorBody', () => {
    let mockMessage: string

    beforeEach(() => {
      mockMessage = random.words()
    })

    it('should return expected message', () => {
      const expectedResult: string = JSON.stringify({ message: mockMessage })

      const result: string = ResponseUtil.getErrorBody(JSON.stringify({ message: mockMessage }))

      expect(result).toEqual(expectedResult)
    })
  })
})