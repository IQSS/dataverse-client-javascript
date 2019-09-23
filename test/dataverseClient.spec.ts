import { DataverseClient, DataverseSearchOptions, SearchType } from '../src/index'
import { assert, createSandbox, SinonSandbox, SinonStub } from 'sinon'
import { expect } from 'chai'
import axios from 'axios'
import request from 'request-promise'
import path from 'path'
import { internet, random } from 'faker'
import { DataverseException } from '../src/exceptions/dataverseException'
import { DataverseMetricType } from '../src/@types/dataverseMetricType'
import { DatasetSubjects } from '../src/@types/datasetSubjects'
import { BasicDatasetInformation } from '../src/@types/basicDataset'
import { DatasetUtil } from '../src/utils/datasetUtil'
import fs from 'fs'

describe('DataverseClient', () => {
  const sandbox: SinonSandbox = createSandbox()

  let apiToken: string
  let host: string
  let client: DataverseClient

  let mockResponse: object
  let mockDatasetInformation: object

  let axiosGetStub: SinonStub
  let axiosPostStub: SinonStub
  let requestPostStub: SinonStub

  let mapBasicDatasetInformationStub: SinonStub

  beforeEach(() => {
    apiToken = random.uuid()
    host = internet.url()
    client = new DataverseClient(host, apiToken)

    mockResponse = {
      status: random.number(),
      data: {}
    }

    mockDatasetInformation = {
      datasetVersion: {
        metadataBlocks: {
          citation: {
            fields: [{
              value: "Darwin's Finches",
              typeClass: 'primitive',
              multiple: false,
              typeName: 'title'
            }
            ],
            displayName: 'Citation Metadata'
          }
        }
      }
    }

    axiosGetStub = sandbox.stub(axios, 'get').resolves(mockResponse)
    axiosPostStub = sandbox.stub(axios, 'post').resolves(mockResponse)
    requestPostStub = sandbox.stub(request, 'post').resolves(mockResponse)

    mapBasicDatasetInformationStub = sandbox.stub(DatasetUtil, 'mapBasicDatasetInformation').returns(mockDatasetInformation)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('getDataverseInformation', () => {
    it('should call axios with expected url', async () => {
      const alias = random.word()

      await client.getDataverseInformation(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}`, { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const alias = random.word()

      await client.getDataverseInformation(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}`, { headers: { 'X-Dataverse-key': '' } })
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

    it('should throw expected error', async () => {
      const alias = random.word()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.getDataverseInformation(alias).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)

    })
  })

  describe('listDatasets', () => {
    it('should call axios with expected url', async () => {
      const dataverseAlias = random.word()

      await client.listDatasets(dataverseAlias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${dataverseAlias}/contents`, { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const alias = random.word()

      await client.listDatasets(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}/contents`, { headers: { 'X-Dataverse-key': '' } })
    })

    it('should return expected response', async () => {
      const expectedResponse = {
        ...mockResponse
      }
      const alias = random.word()
      axiosGetStub
        .withArgs(`${host}/api/dataverses/${alias}/contents`, { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const response = await client.listDatasets(alias)

      expect(response).to.be.deep.eq(expectedResponse)
    })

    it('should throw expected error', async () => {
      const dataverseAlias = random.word()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.listDatasets(dataverseAlias).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)

    })
  })

  describe('addDataset', () => {
    const jsonFixture = JSON.stringify({
      'datasetVersion': {
        'metadataBlocks': {
          'citation': {
            'fields': [{
              'value': "Darwin's Finches",
              'typeClass': 'primitive',
              'multiple': false,
              'typeName': 'title'
            }
            ],
            'displayName': 'Citation Metadata'
          }
        }
      }
    })

    it('should call axios with expected url', async () => {
      const dataverseAlias = random.word()

      await client.addDataset(dataverseAlias, jsonFixture)

      assert.calledOnce(axiosPostStub)
      assert.calledWithExactly(axiosPostStub, `${host}/api/dataverses/${dataverseAlias}/datasets`, JSON.stringify(jsonFixture), { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const dataverseAlias = random.word()

      await client.addDataset(dataverseAlias, jsonFixture)

      assert.calledOnce(axiosPostStub)
      assert.calledWithExactly(axiosPostStub, `${host}/api/dataverses/${dataverseAlias}/datasets`, JSON.stringify(jsonFixture), { headers: { 'X-Dataverse-key': '' } })
    })

    it('should return expected response', async () => {
      const expectedResponse = {
        ...mockResponse
      }
      const dataverseAlias = random.word()
      axiosPostStub
        .withArgs(`${host}/api/dataverses/${dataverseAlias}/datasets`, JSON.stringify(jsonFixture), { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const response = await client.addDataset(dataverseAlias, jsonFixture)

      expect(response).to.be.deep.eq(expectedResponse)
    })

    it('should throw expected error', async () => {
      const dataverseAlias = random.word()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosPostStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.addDataset(dataverseAlias, jsonFixture).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })
  })

  describe('addBasicDataset', () => {
    it('should call mapBasicDatasetInformation with expected input', async () => {
      const dataverseAlias = 'theam'
      const datasetInformation: BasicDatasetInformation = {
        title: 's',
        descriptions: [{ text: 'some ', date: '2019-09-09' }],
        authors: [
          {
            fullname: 'tester tests'
          }
        ],
        contact: [{ email: 'tai@theagilemonkeys.com', fullname: 'Tai Nguyen' }],
        subject: [DatasetSubjects.AGRICULTURAL_SCIENCE]
      }

      await client.addBasicDataset(dataverseAlias, datasetInformation)

      assert.calledOnce(mapBasicDatasetInformationStub)
      assert.calledWithExactly(mapBasicDatasetInformationStub, datasetInformation)
    })

    it('should call axios with expected url', async () => {
      const dataverseAlias = 'theam'
      const datasetInformation: BasicDatasetInformation = {
        title: 's',
        descriptions: [{ text: 'some ', date: '2019-09-09' }],
        authors: [
          {
            fullname: 'tester tests'
          }
        ],
        contact: [],
        subject: [DatasetSubjects.AGRICULTURAL_SCIENCE]
      }

      await client.addBasicDataset(dataverseAlias, datasetInformation)

      assert.calledOnce(axiosPostStub)
      assert.calledWithExactly(axiosPostStub, `${host}/api/dataverses/${dataverseAlias}/datasets`, JSON.stringify(mockDatasetInformation), {
        headers: {
          'X-Dataverse-key': apiToken,
          'Content-Type': 'application/json'
        }
      })
    })

    it('should return expected response', async () => {
      const expectedResponse = {
        ...mockResponse
      }
      const dataverseAlias = random.word()

      const datasetInformation: BasicDatasetInformation = {
        title: 's',
        descriptions: [{ text: 'some ', date: '2019-09-09' }],
        authors: [
          {
            fullname: 'tester tests'
          }
        ],
        contact: [],
        subject: [DatasetSubjects.AGRICULTURAL_SCIENCE]
      }

      axiosGetStub
        .withArgs(`${host}/api/dataverses/${dataverseAlias}/datasets`, JSON.stringify(mockDatasetInformation), { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const response = await client.addBasicDataset(dataverseAlias, datasetInformation)

      expect(response).to.be.deep.eq(expectedResponse)
    })

    it('should throw expected error', async () => {
      const dataverseAlias = random.word()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosPostStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })
      const datasetInformation: BasicDatasetInformation = {
        title: 's',
        descriptions: [{ text: 'some ', date: '2019-09-09' }],
        authors: [
          {
            fullname: 'tester tests'
          }
        ],
        contact: [],
        subject: [DatasetSubjects.AGRICULTURAL_SCIENCE]
      }

      let error: DataverseException = undefined

      await client.addBasicDataset(dataverseAlias, datasetInformation).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
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
      assert.calledWithExactly(axiosGetStub, `${host}/api/search`, {
        params: expectedOptions
      })
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

    it('should throw expected error', async () => {
      const query = random.word()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.search({ query }).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })

  })

  describe('getFile', () => {
    it('should call axios with expected url', async () => {
      const fileId: string = random.number().toString()

      await client.getFile(fileId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/access/datafile/${fileId}`, {
        headers: { 'X-Dataverse-key': apiToken },
        responseType: 'arraybuffer'
      })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const fileId: string = random.number().toString()

      await client.getFile(fileId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/access/datafile/${fileId}`, {
        headers: { 'X-Dataverse-key': '' },
        responseType: 'arraybuffer'
      })
    })

    it('should return expected response', async () => {
      const fileId: string = random.number().toString()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/access/datafile/${fileId}`, {
          headers: { 'X-Dataverse-key': apiToken },
          responseType: 'arraybuffer'
        })
        .resolves(mockResponse)

      const response = await client.getFile(fileId)

      expect(response).to.be.deep.equal(expectedResponse)
    })

    it('should throw expected error', async () => {
      const fileId: string = random.number().toString()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.getFile(fileId).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })

  })

  describe('getFileMetadata', () => {
    it('should call axios with expected url', async () => {
      const fileId: string = random.number().toString()

      await client.getFileMetadata(fileId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/files/${fileId}/metadata/`, { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const fileId: string = random.number().toString()

      await client.getFileMetadata(fileId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/files/${fileId}/metadata/`, { headers: { 'X-Dataverse-key': '' } })
    })

    it('should return expected response', async () => {
      const fileId: string = random.number().toString()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/files/${fileId}/metadata/`, { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const response = await client.getFileMetadata(fileId)

      expect(response).to.be.deep.equal(expectedResponse)
    })

    it('should throw expected error', async () => {
      const fileId: string = random.number().toString()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.getFileMetadata(fileId).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)

    })

    describe('Draft version', () => {
      it('should call axios with expected url', async () => {
        const fileId: string = random.number().toString()

        await client.getFileMetadata(fileId, true)

        assert.calledOnce(axiosGetStub)
        assert.calledWithExactly(axiosGetStub, `${host}/api/files/${fileId}/metadata/draft`, { headers: { 'X-Dataverse-key': apiToken } })
      })

      it('should call axios with expected headers when no apiToken provided', async () => {
        client = new DataverseClient(host)
        const fileId: string = random.number().toString()

        await client.getFileMetadata(fileId, true)

        assert.calledOnce(axiosGetStub)
        assert.calledWithExactly(axiosGetStub, `${host}/api/files/${fileId}/metadata/draft`, { headers: { 'X-Dataverse-key': '' } })
      })

      it('should return expected response', async () => {
        const fileId: string = random.number().toString()
        const expectedResponse = {
          ...mockResponse
        }
        axiosGetStub
          .withArgs(`${host}/api/files/${fileId}/metadata/draft`, { headers: { 'X-Dataverse-key': apiToken } })
          .resolves(mockResponse)

        const response = await client.getFileMetadata(fileId, true)

        expect(response).to.be.deep.equal(expectedResponse)
      })

      it('should throw expected error', async () => {
        const fileId: string = random.number().toString()
        const errorMessage = random.words()
        const errorCode = random.number()
        axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

        let error: DataverseException = undefined

        await client.getFileMetadata(fileId, true).catch(e => error = e)

        expect(error).to.be.instanceOf(Error)
        expect(error.message).to.be.equal(errorMessage)
        expect(error.errorCode).to.be.equal(errorCode)
      })

    })
  })

  describe('getLatestDatasetInformation', () => {
    it('should call axios with expected url', async () => {
      const datasetId: string = random.number().toString()

      await client.getLatestDatasetInformation(datasetId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}`, { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const datasetId: string = random.number().toString()

      await client.getLatestDatasetInformation(datasetId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}`, { headers: { 'X-Dataverse-key': '' } })
    })

    it('should return expected response', async () => {
      const datasetId: string = random.number().toString()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/datasets/${datasetId}`, { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const response = await client.getLatestDatasetInformation(datasetId)

      expect(response).to.be.deep.equal(expectedResponse)
    })

    it('should throw expected error', async () => {
      const datasetId: string = random.number().toString()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.getLatestDatasetInformation(datasetId).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })
  })

  describe('getDatasetVersions', () => {
    it('should call axios with expected url', async () => {
      const datasetId: string = random.number().toString()

      await client.getDatasetVersions(datasetId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/versions`, { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const datasetId: string = random.number().toString()

      await client.getDatasetVersions(datasetId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/versions`, { headers: { 'X-Dataverse-key': '' } })
    })

    it('should return expected response', async () => {
      const datasetId: string = random.number().toString()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/datasets/${datasetId}/versions`, { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const response = await client.getDatasetVersions(datasetId)

      expect(response).to.be.deep.equal(expectedResponse)
    })

    it('should throw expected error', async () => {
      const datasetId: string = random.number().toString()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.getDatasetVersions(datasetId).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })
  })

  describe('getDatasetVersion', () => {
    it('should call axios with expected url', async () => {
      const datasetId: string = random.number().toString()
      const version: string = random.number().toString()

      await client.getDatasetVersion(datasetId, version)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/versions/${version}`, { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const datasetId: string = random.number().toString()
      const version: string = random.number().toString()

      await client.getDatasetVersion(datasetId, version)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/versions/${version}`, { headers: { 'X-Dataverse-key': '' } })
    })

    it('should return expected response', async () => {
      const datasetId: string = random.number().toString()
      const version: string = random.number().toString()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/datasets/${datasetId}/versions/${version}`, { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const response = await client.getDatasetVersion(datasetId, version)

      expect(response).to.be.deep.equal(expectedResponse)
    })

    it('should throw expected error', async () => {
      const datasetId: string = random.number().toString()
      const version: string = random.number().toString()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.getDatasetVersion(datasetId, version).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })
  })

  describe('getDatasetThumbnail', () => {
    it('should call axios with expected url', async () => {
      const datasetId: string = random.number().toString()

      await client.getDatasetThumbnail(datasetId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/thumbnail`, {
        headers: { 'X-Dataverse-key': apiToken },
        responseType: 'arraybuffer'
      })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const datasetId: string = random.number().toString()

      await client.getDatasetThumbnail(datasetId)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/thumbnail`, {
        headers: { 'X-Dataverse-key': '' },
        responseType: 'arraybuffer'
      })
    })

    it('should return expected response', async () => {
      const datasetId: string = random.number().toString()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/datasets/${datasetId}/thumbnail`, { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const response = await client.getDatasetThumbnail(datasetId)

      expect(response).to.be.deep.equal(expectedResponse)
    })

    it('should throw expected error', async () => {
      const datasetId: string = random.number().toString()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.getDatasetThumbnail(datasetId).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })
  })

  describe('uploadDatasetThumbnail', () => {
    const testImage = fs.readFileSync(path.resolve(__dirname, '../test/assets/theam.png'), 'base64')

    it('should call request with expected url', async () => {
      const datasetId: string = random.number().toString()
      const expectedRequest = {
        url: `${host}/api/datasets/${datasetId}/thumbnail`,
        headers: { 'X-Dataverse-key': apiToken },
        formData: { file: testImage },
        resolveWithFullResponse: true
      }

      await client.uploadDatasetThumbnail(datasetId, testImage)

      assert.calledOnce(requestPostStub)
      assert.calledWithExactly(requestPostStub, expectedRequest)
    })

    it('should call request with expected headers when no apiToken provided', async () => {
      const datasetId: string = random.number().toString()
      const expectedRequest = {
        url: `${host}/api/datasets/${datasetId}/thumbnail`,
        headers: { 'X-Dataverse-key': ''},
        formData: { file: testImage },
        resolveWithFullResponse: true
      }
      client = new DataverseClient(host)

      await client.uploadDatasetThumbnail(datasetId, testImage)

      assert.calledOnce(requestPostStub)
      assert.calledWithExactly(requestPostStub, expectedRequest)
    })

    it('should return expected response', async () => {
      const expectedResponse = {
        ...mockResponse
      }
      const datasetId: string = random.number().toString()

      const expectedRequest = {
        url: `${host}/api/datasets/${datasetId}/thumbnail`,
        headers: { 'X-Dataverse-key': apiToken },
        formData: { file: testImage },
        resolveWithFullResponse: true
      }

      requestPostStub.withArgs(expectedRequest).resolves(mockResponse)

      const response = await client.uploadDatasetThumbnail(datasetId, testImage)

      expect(response).to.be.deep.equal(expectedResponse)
    })

    it('should throw expected error', async() => {
      const datasetId = random.word()
      const errorMessage = random.words()
      const errorCode = random.number()
      requestPostStub.rejects({ response: { statusCode: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.uploadDatasetThumbnail(datasetId, testImage).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })
  })

  describe('listDataverseRoleAssignments', () => {
    it('should call axios with expected url', async () => {
      const alias = random.word()

      await client.listDataverseRoleAssignments(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}/assignments`, { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const alias = random.word()

      await client.listDataverseRoleAssignments(alias)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/dataverses/${alias}/assignments`, { headers: { 'X-Dataverse-key': '' } })
    })

    it('should return expected response', async () => {
      const alias = random.word()
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/dataverses/${alias}/assignments`, { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const result = await client.listDataverseRoleAssignments(alias)

      expect(result).to.be.deep.equal(expectedResponse)
    })

    it('should throw expected error', async () => {
      const alias = random.word()
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.listDataverseRoleAssignments(alias).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })

  })

  describe('getMetric', () => {
    it('should call getMetricByCountry with expected input', async () => {
      const datasetId: string = random.number().toString()
      const yearMonth = '201901'
      const getMetricByCountryStub: SinonStub = sandbox.stub(DataverseClient.prototype, 'getMetricByCountry')

      await client.getMetric(datasetId, DataverseMetricType.VIEWS_TOTAL, yearMonth)

      assert.calledOnce(getMetricByCountryStub)
      assert.calledWithExactly(getMetricByCountryStub, datasetId, DataverseMetricType.VIEWS_TOTAL, undefined, yearMonth)
    })

    it('should call getMetricByCountry with expected input when no year provided', async () => {
      const datasetId: string = random.number().toString()
      const getMetricByCountryStub: SinonStub = sandbox.stub(DataverseClient.prototype, 'getMetricByCountry')

      await client.getMetric(datasetId, DataverseMetricType.DOWNLOADS_TOTAL)

      assert.calledOnce(getMetricByCountryStub)
      assert.calledWithExactly(getMetricByCountryStub, datasetId, DataverseMetricType.DOWNLOADS_TOTAL, undefined, undefined)
    })
  })

  describe('getMetricByCountry', () => {
    it('should call axios with expected url', async () => {
      const datasetId: string = random.number().toString()
      const metricType: DataverseMetricType = DataverseMetricType.DOWNLOADS_UNIQUE

      await client.getMetricByCountry(datasetId, metricType)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/makeDataCount/${metricType}`, { headers: { 'X-Dataverse-key': apiToken } })
    })

    it('should call axios with expected headers when no apiToken provided', async () => {
      client = new DataverseClient(host)
      const datasetId: string = random.number().toString()
      const metricType: DataverseMetricType = DataverseMetricType.DOWNLOADS_UNIQUE

      await client.getMetricByCountry(datasetId, metricType)

      assert.calledOnce(axiosGetStub)
      assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/makeDataCount/${metricType}`, { headers: { 'X-Dataverse-key': '' } })
    })

    it('should return expected response', async () => {
      const datasetId: string = random.number().toString()
      const metricType: DataverseMetricType = DataverseMetricType.DOWNLOADS_UNIQUE
      const expectedResponse = {
        ...mockResponse
      }
      axiosGetStub
        .withArgs(`${host}/api/datasets/${datasetId}/makeDataCount/${metricType}`, { headers: { 'X-Dataverse-key': apiToken } })
        .resolves(mockResponse)

      const result = await client.getMetricByCountry(datasetId, metricType)

      expect(result).to.be.deep.equal(expectedResponse)
    })

    describe('date provided', () => {
      it('should call axios with expected url', async () => {
        const datasetId: string = random.number().toString()
        const metricType: DataverseMetricType = DataverseMetricType.DOWNLOADS_UNIQUE
        const date = '201901'
        await client.getMetricByCountry(datasetId, metricType, undefined, date)

        assert.calledOnce(axiosGetStub)
        assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/makeDataCount/${metricType}/${date}`, { headers: { 'X-Dataverse-key': apiToken } })
      })
    })

    describe('country provided', () => {
      it('should call axios with expected url', async () => {
        const datasetId: string = random.number().toString()
        const metricType: DataverseMetricType = DataverseMetricType.DOWNLOADS_UNIQUE
        const countryCode = 'US'
        await client.getMetricByCountry(datasetId, metricType, countryCode, undefined)

        assert.calledOnce(axiosGetStub)
        assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/makeDataCount/${metricType}?country=${countryCode}`, { headers: { 'X-Dataverse-key': apiToken } })
      })
    })

    describe('date and country provided', () => {
      it('should call axios with expected url', async () => {
        const datasetId: string = random.number().toString()
        const metricType: DataverseMetricType = DataverseMetricType.DOWNLOADS_UNIQUE
        const date = '201901'
        const countryCode = 'US'
        await client.getMetricByCountry(datasetId, metricType, countryCode, date)

        assert.calledOnce(axiosGetStub)
        assert.calledWithExactly(axiosGetStub, `${host}/api/datasets/${datasetId}/makeDataCount/${metricType}/${date}?country=${countryCode}`, { headers: { 'X-Dataverse-key': apiToken } })
      })
    })

    it('should throw expected error', async () => {
      const datasetId: string = random.number().toString()
      const metricType: DataverseMetricType = DataverseMetricType.DOWNLOADS_UNIQUE
      const errorMessage = random.words()
      const errorCode = random.number()
      axiosGetStub.rejects({ response: { status: errorCode, data: { message: errorMessage } } })

      let error: DataverseException = undefined

      await client.getMetricByCountry(datasetId, metricType).catch(e => error = e)

      expect(error).to.be.instanceOf(Error)
      expect(error.message).to.be.equal(errorMessage)
      expect(error.errorCode).to.be.equal(errorCode)
    })
  })
})