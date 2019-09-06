import { DataverseClient, DataverseSearchOptions, SearchType } from '../src/index'
import { assert, createSandbox, SinonSandbox, SinonStub } from 'sinon'
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

  describe('search', () => {
    it('should call axios with expected url and options', async () => {
      const query = random.word()
      const type: SearchType = SearchType.DATASET
      const expectedOptions: DataverseSearchOptions = {
        q: query,
        subtree: undefined,
        start: undefined,
        type,
        sort: undefined,
        order: undefined,
        'per_page': undefined,
        'show_entity_ids': undefined,
        'show_relevance': undefined
      }
      await client.search({ query, type })

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/search`, { params: expectedOptions })
    })

    it('should return expected response', async () => {
      const query = random.word()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/search`)
        .resolves(mockResponse)

      const response = await client.search({ query })

      expect(response).to.be.deep.eq(expectedResponse)
    })
  })

  describe('getFile', () => {
    it('should call axios with expected url', async () => {
      const fileId: string = random.number().toString()

      await client.getFile(fileId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/access/datafile/${fileId}?key=${apiToken}`)
    })

    it('should return expected response', async () => {
      const fileId: string = random.number().toString()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/access/datafile/${fileId}?key=${apiToken}`)
        .resolves(mockResponse)

      const response = await client.getFile(fileId)

      expect(response).to.be.deep.equal(expectedResponse)
    })
  })
})