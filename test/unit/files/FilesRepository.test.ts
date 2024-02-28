import { FilesRepository } from '../../../src/files/infra/repositories/FilesRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';
import {
  createFileModel,
  createManyFilesPayload,
  createFilesSubsetModel,
  createFilePayload,
} from '../../testHelpers/files/filesHelper';
import { createFileDataTablePayload, createFileDataTableModel } from '../../testHelpers/files/fileDataTablesHelper';
import { createFileUserPermissionsModel } from '../../testHelpers/files/fileUserPermissionsHelper';
import { FileSearchCriteria, FileAccessStatus, FileOrderCriteria } from '../../../src/files/domain/models/FileCriteria';
import { DatasetNotNumberedVersion } from '../../../src/datasets';
import { createFileCountsModel, createFileCountsPayload } from '../../testHelpers/files/fileCountsHelper';
import { createFilesTotalDownloadSizePayload } from '../../testHelpers/files/filesTotalDownloadSizeHelper';
import { FileDownloadSizeMode } from '../../../src';

describe('FilesRepository', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: FilesRepository = new FilesRepository();

  const testFile = createFileModel();
  const testDatasetVersionId = DatasetNotNumberedVersion.LATEST;
  const testDatasetId = 1;
  const testIncludeDeaccessioned = false;
  const testCategory = 'testCategory';
  const testTabularTagName = 'testTabularTagName';
  const testContentType = 'testContentType';
  const testFileCriteria = new FileSearchCriteria()
    .withCategoryName(testCategory)
    .withContentType(testContentType)
    .withAccessStatus(FileAccessStatus.PUBLIC)
    .withTabularTagName(testTabularTagName);

  beforeEach(() => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getDatasetFiles', () => {
    const testTotalCount = 4;
    const testFilesSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createManyFilesPayload(testTotalCount),
        totalCount: testTotalCount,
      },
    };

    const testLimit = 10;
    const testOffset = 20;
    const testFileOrderCriteria = FileOrderCriteria.NAME_ZA;

    const expectedRequestConfigApiKey = {
      params: { includeDeaccessioned: testIncludeDeaccessioned, orderCriteria: testFileOrderCriteria },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
    };
    const expectedRequestConfigSessionCookie = {
      params: { includeDeaccessioned: testIncludeDeaccessioned, orderCriteria: testFileOrderCriteria },
      withCredentials: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
    };

    const expectedRequestParamsWithOptional = {
      includeDeaccessioned: testIncludeDeaccessioned,
      limit: testLimit,
      offset: testOffset,
      orderCriteria: testFileOrderCriteria,
      contentType: testFileCriteria.contentType,
      accessStatus: testFileCriteria.accessStatus.toString(),
      categoryName: testFileCriteria.categoryName,
      tabularTagName: testFileCriteria.tabularTagName,
    };

    const expectedRequestConfigApiKeyWithOptional = {
      params: expectedRequestParamsWithOptional,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
    };

    const expectedFiles = createFilesSubsetModel(testTotalCount);

    describe('by numeric id and version id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/files`;

      test('should return files when providing id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

        // API Key auth
        let actual = await sut.getDatasetFiles(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        assert.match(actual, expectedFiles);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetFiles(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigSessionCookie);
        assert.match(actual, expectedFiles);
      });

      test('should return files when providing id, version id, optional params, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

        const actual = await sut.getDatasetFiles(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria,
          testLimit,
          testOffset,
          testFileCriteria,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKeyWithOptional);
        assert.match(actual, expectedFiles);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut
          .getDatasetFiles(testDatasetId, testDatasetVersionId, testIncludeDeaccessioned, testFileOrderCriteria)
          .catch((e) => (error = e));

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/files?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

      test('should return files when providing persistent id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

        // API Key auth
        let actual = await sut.getDatasetFiles(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        assert.match(actual, expectedFiles);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetFiles(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigSessionCookie);
        assert.match(actual, expectedFiles);
      });

      test('should return files when providing persistent id, optional params, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesSuccessfulResponse);

        const actual = await sut.getDatasetFiles(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileOrderCriteria,
          testLimit,
          testOffset,
          testFileCriteria,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKeyWithOptional);
        assert.match(actual, expectedFiles);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut
          .getDatasetFiles(
            TestConstants.TEST_DUMMY_PERSISTENT_ID,
            testDatasetVersionId,
            testIncludeDeaccessioned,
            testFileOrderCriteria,
          )
          .catch((e) => (error = e));

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  describe('getDatasetFileCounts', () => {
    const testFileCountsSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createFileCountsPayload(),
      },
    };

    const expectedRequestConfigApiKey = {
      params: { includeDeaccessioned: testIncludeDeaccessioned },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
    };
    const expectedRequestConfigSessionCookie = {
      params: { includeDeaccessioned: testIncludeDeaccessioned },
      withCredentials: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
    };

    const expectedRequestParamsWithOptional = {
      includeDeaccessioned: testIncludeDeaccessioned,
      contentType: testFileCriteria.contentType,
      accessStatus: testFileCriteria.accessStatus.toString(),
      categoryName: testFileCriteria.categoryName,
      tabularTagName: testFileCriteria.tabularTagName,
    };

    const expectedRequestConfigApiKeyWithOptional = {
      params: expectedRequestParamsWithOptional,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
    };

    const expectedCount = createFileCountsModel();

    describe('by numeric id and version id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/files/counts`;

      test('should return file counts when providing id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileCountsSuccessfulResponse);

        // API Key auth
        let actual = await sut.getDatasetFileCounts(testDatasetId, testDatasetVersionId, testIncludeDeaccessioned);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        assert.match(actual, expectedCount);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetFileCounts(testDatasetId, testDatasetVersionId, testIncludeDeaccessioned);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigSessionCookie);
        assert.match(actual, expectedCount);
      });

      test('should return file counts when providing id, version id, optional params, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileCountsSuccessfulResponse);

        const actual = await sut.getDatasetFileCounts(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileCriteria,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKeyWithOptional);
        assert.match(actual, expectedCount);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut
          .getDatasetFileCounts(testDatasetId, testDatasetVersionId, testIncludeDeaccessioned)
          .catch((e) => (error = e));

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/files/counts?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

      test('should return files when providing persistent id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileCountsSuccessfulResponse);

        // API Key auth
        let actual = await sut.getDatasetFileCounts(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        assert.match(actual, expectedCount);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetFileCounts(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigSessionCookie);
        assert.match(actual, expectedCount);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut
          .getDatasetFileCounts(TestConstants.TEST_DUMMY_PERSISTENT_ID, testDatasetVersionId, testIncludeDeaccessioned)
          .catch((e) => (error = e));

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  describe('getDatasetFilesTotalDownloadSize', () => {
    const testFilesTotalDownloadSizeSuccessfulResponse = {
      data: {
        status: 'OK',
        data: createFilesTotalDownloadSizePayload(),
      },
    };
    const testFileDownloadSizeMode = FileDownloadSizeMode.ARCHIVAL;
    const testIncludeDeaccessioned = false;
    const expectedSize = 173;
    const expectedRequestConfigApiKey = {
      params: { mode: FileDownloadSizeMode.ARCHIVAL.toString(), includeDeaccessioned: testIncludeDeaccessioned },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
    };
    const expectedRequestConfigSessionCookie = {
      params: { mode: FileDownloadSizeMode.ARCHIVAL.toString(), includeDeaccessioned: testIncludeDeaccessioned },
      withCredentials: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
    };
    const expectedRequestConfigApiKeyWithOptional = {
      params: {
        mode: FileDownloadSizeMode.ARCHIVAL.toString(),
        includeDeaccessioned: testIncludeDeaccessioned,
        contentType: testFileCriteria.contentType,
        accessStatus: testFileCriteria.accessStatus.toString(),
        categoryName: testFileCriteria.categoryName,
        tabularTagName: testFileCriteria.tabularTagName,
      },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
    };
    const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetId}/versions/${testDatasetVersionId}/downloadsize`;

    describe('by numeric id and version id', () => {
      test('should return files total download size when providing id, version id, mode, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesTotalDownloadSizeSuccessfulResponse);

        // API Key auth
        let actual = await sut.getDatasetFilesTotalDownloadSize(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        assert.match(actual, expectedSize);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetFilesTotalDownloadSize(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigSessionCookie);
        assert.match(actual, expectedSize);
      });

      test('should return files total download size when providing id, version id, mode, optional params, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesTotalDownloadSizeSuccessfulResponse);

        const actual = await sut.getDatasetFilesTotalDownloadSize(
          testDatasetId,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode,
          testFileCriteria,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKeyWithOptional);
        assert.match(actual, expectedSize);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut
          .getDatasetFilesTotalDownloadSize(
            testDatasetId,
            testDatasetVersionId,
            testIncludeDeaccessioned,
            testFileDownloadSizeMode,
          )
          .catch((e) => (error = e));

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testDatasetVersionId}/downloadsize?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

      test('should return files total download size when providing persistent id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFilesTotalDownloadSizeSuccessfulResponse);

        // API Key auth
        let actual = await sut.getDatasetFilesTotalDownloadSize(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        assert.match(actual, expectedSize);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetFilesTotalDownloadSize(
          TestConstants.TEST_DUMMY_PERSISTENT_ID,
          testDatasetVersionId,
          testIncludeDeaccessioned,
          testFileDownloadSizeMode,
        );

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigSessionCookie);
        assert.match(actual, expectedSize);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut
          .getDatasetFilesTotalDownloadSize(
            TestConstants.TEST_DUMMY_PERSISTENT_ID,
            testDatasetVersionId,
            testIncludeDeaccessioned,
            testFileDownloadSizeMode,
          )
          .catch((e) => (error = e));

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
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
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/downloadCount`;

      test('should return count when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileDownloadCountResponse);

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
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/:persistentId/downloadCount?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

      test('should return count when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileDownloadCountResponse);

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
          expectedApiEndpoint,
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
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/access/datafile/${testFile.id}/userPermissions`;

      test('should return file user permissions when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileUserPermissionsResponse);

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
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/access/datafile/:persistentId/userPermissions?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

      test('should return file user permissions when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testFileUserPermissionsResponse);
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
          expectedApiEndpoint,
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
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/dataTables`;

      test('should return data tables when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testGetFileDataTablesResponse);

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
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/:persistentId/dataTables?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

      test('should return data tables when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testGetFileDataTablesResponse);

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
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
  });
  describe('getFile', () => {
    const expectedConfigApiKey = {
      ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
      params: { returnOwners: true },
    };
    const expectedConfigSessionCookie = {
      ...TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
      params: { returnOwners: true },
    };
    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/versions/${DatasetNotNumberedVersion.LATEST}`;
      const testGetFileResponse = {
        data: {
          status: 'OK',
          data: createFilePayload(),
        },
      };
      test('should return file when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testGetFileResponse);

        // API Key auth
        let actual = await sut.getFile(testFile.id, DatasetNotNumberedVersion.LATEST);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedConfigApiKey);
        assert.match(actual, createFileModel());

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getFile(testFile.id, DatasetNotNumberedVersion.LATEST);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedConfigSessionCookie);
        assert.match(actual, createFileModel());
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getFile(testFile.id, DatasetNotNumberedVersion.LATEST).catch((e) => (error = e));

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedConfigApiKey);
        expect(error).to.be.instanceOf(Error);
      });
    });
    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/:persistentId/versions/${DatasetNotNumberedVersion.LATEST}?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;
      const testGetFileResponse = {
        data: {
          status: 'OK',
          data: createFilePayload(),
        },
      };
      test('should return file when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testGetFileResponse);

        // API Key auth
        let actual = await sut.getFile(TestConstants.TEST_DUMMY_PERSISTENT_ID, DatasetNotNumberedVersion.LATEST);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedConfigApiKey);
        assert.match(actual, createFileModel());

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getFile(TestConstants.TEST_DUMMY_PERSISTENT_ID, DatasetNotNumberedVersion.LATEST);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedConfigSessionCookie);
        assert.match(actual, createFileModel());
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut
          .getFile(TestConstants.TEST_DUMMY_PERSISTENT_ID, DatasetNotNumberedVersion.LATEST)
          .catch((e) => (error = e));

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedConfigApiKey);
        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  describe('getFileCitation', () => {
    const testIncludeDeaccessioned = true;
    const testCitation = 'test citation';
    const testCitationSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          message: testCitation,
        },
      },
    };
    test('should return citation when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testCitationSuccessfulResponse);
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/files/${testFile.id}/versions/${DatasetNotNumberedVersion.LATEST}/citation`;

      // API Key auth
      let actual = await sut.getFileCitation(testFile.id, DatasetNotNumberedVersion.LATEST, testIncludeDeaccessioned);

      assert.calledWithExactly(
        axiosGetStub,
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED,
      );
      assert.match(actual, testCitation);

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

      actual = await sut.getFileCitation(testFile.id, DatasetNotNumberedVersion.LATEST, testIncludeDeaccessioned);

      assert.calledWithExactly(
        axiosGetStub,
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE_INCLUDE_DEACCESSIONED,
      );
      assert.match(actual, testCitation);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut
        .getFileCitation(1, DatasetNotNumberedVersion.LATEST, testIncludeDeaccessioned)
        .catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/files/${testFile.id}/versions/${DatasetNotNumberedVersion.LATEST}/citation`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });
});
