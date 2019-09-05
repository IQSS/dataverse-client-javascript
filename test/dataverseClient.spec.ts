import { DataverseClient } from '../src/index'
import { createSandbox, SinonSandbox, SinonStub, assert } from 'sinon'
import { expect } from 'chai'
import axios from 'axios'
import { internet, random } from 'faker'

describe('DataverseClient', () => {
  const sandbox: SinonSandbox = createSandbox()

  let apiToken: string
  let host: string
  let client: DataverseClient

  let mockResponse: object

  let axiosGetStub: SinonStub

  beforeEach(() => {
    apiToken = random.uuid()
    host = internet.url()
    client = new DataverseClient(host, apiToken)

    mockResponse = {
      status: random.number(),
      data: {}
    }

    axiosGetStub = sandbox.stub(axios, 'get').resolves(mockResponse)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getDataverseInformation', () => {
    it('should call axios with expected url', async () => {
      const alias = random.word()

      await client.getDataverseInformation(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}?key=${apiToken}`)
    })

    it('should call axios with expected url when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const alias = random.word()

      await client.getDataverseInformation(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}`)
    })

    it('should return expected response', async () => {
      const expectedResponse = {
        ...mockResponse
      }
      const alias = random.word()
      axiosGetStub
        .withArgs(`${host}/api/dataverses/${alias}?key=${apiToken}`)
        .resolves(mockResponse)

      const response = await client.getDataverseInformation(alias)

      expect(response).to.be.deep.eq(expectedResponse)
    })
  })

  describe('listDatasets', () => {
    it('should call axios with expected url', async () => {
      const alias = random.word()

      await client.listDatasets(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}/contents?key=${apiToken}`)
    })

    it('should call axios with expected url when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const alias = random.word()

      await client.listDatasets(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}/contents`)
    })

    it('should return expected response', async () => {
      const expectedResponse = {
        ...mockResponse
      }
      const alias = random.word()
      axiosGetStub
        .withArgs(`${host}/api/dataverses/${alias}/contents?key=${apiToken}`)
        .resolves(mockResponse)

      const response = await client.listDatasets(alias)

      expect(response).to.be.deep.eq(expectedResponse)
    })
  })
})