import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';
import { createFilePayload, createFileModel } from '../../testHelpers/files/filesHelper';
import { createFileDataTablePayload, createFileDataTableModel } from '../../testHelpers/files/fileDataTablesHelper';
import { createFileUserPermissionsModel } from '../../testHelpers/files/fileUserPermissionsHelper';
import { FileCriteria, FileAccessStatus, FileOrderCriteria } from '../../../src/files/domain/models/FileCriteria';
import { DatasetNotNumberedVersion } from '../../../src/datasets';

describe('FilesRepository', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: FilesRepository = new FilesRepository();
  const testFilesSuccessfulResponse = {
    data: {
      status: 'OK',
      data: [createFilePayload()],
    },
  };
  const testFile = createFileModel();

  beforeEach(() => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getDatasetFiles', () => {
    const testDatasetVersionId = DatasetNotNumberedVersion.LATEST;
    const testLimit = 10;
    const testOffset = 20;
    const testCategory = 'testCategory';
    const testContentType = 'testContentType';
    const testFileCriteria = new FileCriteria()
      .withOrderCriteria(FileOrderCriteria.NAME_ZA)
      .withCategoryName(testCategory)
      .withContentType(testContentType)
      .withAccessStatus(FileAccessStatus.PUBLIC);

    const expectedRequestParams = {
      limit: testLimit,
      offset: testOffset,
      orderCriteria: testFileCriteria.orderCriteria.toString(),
      categoryName: testFileCriteria.categoryName,
      contentType: testFileCriteria.contentType,
      accessStatus: testFileCriteria.accessStatus.toString(),
    };

    describe('by numeric id and version id', () => {
      const testDatasetId = 1;

      test('should return files when providing id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/files`;
        const expectedFiles = [testFile];

        // API Key auth
        let actual = await sut.getDatasetFiles(testDatasetId, testDatasetVersionId);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, expectedFiles);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetFiles(testDatasetId, testDatasetVersionId);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, expectedFiles);
      });

      test('should return files when providing id, version id, optional params, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

        const actual = await sut.getDatasetFiles(testDatasetId, testDatasetVersionId, testLimit, testOffset, testFileCriteria);

        const expectedRequestConfig = {
          params: expectedRequestParams,
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
        };

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/files`,
          expectedRequestConfig,
        );
        assert.match(actual, [testFile]);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getDatasetFiles(testDatasetId, testDatasetVersionId).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/files`,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      test('should return files when providing persistent id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/files?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;
        const expectedFiles = [testFile];

        // API Key auth
        let actual = await sut.getDatasetFiles(TestConstants.TEST_DUMMY_PERSISTENT_ID, testDatasetVersionId);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, expectedFiles);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetFiles(TestConstants.TEST_DUMMY_PERSISTENT_ID, testDatasetVersionId);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, expectedFiles);
      });

      test('should return files when providing persistent id, optional params, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

        const actual = await sut.getDatasetFiles(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testLimit,
          testOffset,
          testFileCriteria,
        );

        const expectedRequestConfig = {
          params: expectedRequestParams,
          headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
        };

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/files?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`,
          expectedRequestConfig,
        );
        assert.match(actual, [testFile]);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getDatasetFiles(TestConstants.TEST_DUMMY_PERSISTENT_ID, testDatasetVersionId).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/files?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  describe('getFileDownloadCount', () => {
    const testCount = 1;
    const testFileDownloadCountResponse = {
      data: {
        status: 'OK',
        data: {
          message: `${testCount}`,
        },
      },
    };

    describe('by numeric id', () => {
      test('should return count when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileDownloadCountResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/downloadCount`;

        // API Key auth
        let actual = await sut.getFileDownloadCount(testFile.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, testCount);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getFileDownloadCount(testFile.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, testCount);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getFileDownloadCount(testFile.id).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/files/${testFile.id}/downloadCount`,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      test('should return count when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileDownloadCountResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/:persistentId/downloadCount?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

        // API Key auth
        let actual = await sut.getFileDownloadCount(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, testCount);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getFileDownloadCount(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, testCount);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getFileDownloadCount(TestConstants.TEST_DUMMY_PERSISTENT_ID).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/files/:persistentId/downloadCount?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  describe('getFileUserPermissions', () => {
    const testFileUserPermissions = createFileUserPermissionsModel();
    const testFileUserPermissionsResponse = {
      data: {
        status: 'OK',
        data: testFileUserPermissions,
      },
    };

    describe('by numeric id', () => {
      test('should return file user permissions when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileUserPermissionsResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/access/datafile/${testFile.id}/userPermissions`;

        // API Key auth
        let actual = await sut.getFileUserPermissions(testFile.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, testFileUserPermissions);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getFileUserPermissions(testFile.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, testFileUserPermissions);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getFileUserPermissions(testFile.id).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/access/datafile/${testFile.id}/userPermissions`,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      test('should return file user permissions when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileUserPermissionsResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/access/datafile/:persistentId/userPermissions?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;
        // API Key auth
        let actual = await sut.getFileUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, testFileUserPermissions);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getFileUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, testFileUserPermissions);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getFileUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/access/datafile/:persistentId/userPermissions?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  describe('getFileDataTables', () => {
    const expectedDataTables = [createFileDataTableModel()];
    const testGetFileDataTablesResponse = {
      data: {
        status: 'OK',
        data: [createFileDataTablePayload()],
      },
    };

    describe('by numeric id', () => {
      test('should return data tables when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testGetFileDataTablesResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/dataTables`;

        // API Key auth
        let actual = await sut.getFileDataTables(testFile.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, expectedDataTables);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getFileDataTables(testFile.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, expectedDataTables);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getFileDataTables(testFile.id).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/files/${testFile.id}/dataTables`,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      test('should return data tables when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testGetFileDataTablesResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/:persistentId/dataTables?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

        // API Key auth
        let actual = await sut.getFileDataTables(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, expectedDataTables);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getFileDataTables(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, expectedDataTables);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getFileDataTables(TestConstants.TEST_DUMMY_PERSISTENT_ID).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/files/:persistentId/dataTables?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
  });
});
