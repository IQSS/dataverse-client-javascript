import { ReadError, WriteError } from '../../../src'

describe('RepositoryError details', () => {
  test('keeps the existing message and exposes statusCode and fieldErrors', () => {
    const error = new WriteError('[400] Invalid fields.', {
      statusCode: 400,
      fieldErrors: { username: 'This username is already taken.' }
    })

    expect(error.message).toBe(
      'There was an error when writing the resource. Reason was: [400] Invalid fields.'
    )
    expect(error.statusCode).toBe(400)
    expect(error.fieldErrors).toEqual({ username: 'This username is already taken.' })
  })

  test('leaves the details undefined when none are given', () => {
    const error = new ReadError('[404] Not found.')

    expect(error.message).toBe(
      'There was an error when reading the resource. Reason was: [404] Not found.'
    )
    expect(error.statusCode).toBeUndefined()
    expect(error.fieldErrors).toBeUndefined()
  })
})
