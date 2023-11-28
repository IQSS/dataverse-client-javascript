import { DatasetsRepository } from '../../../src/datasets/infra/repositories/DatasetsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import {
  createDatasetModel,
  createDatasetVersionPayload,
  createDatasetLicenseModel,
} from '../../testHelpers/datasets/datasetHelper';
import { TestConstants } from '../../testHelpers/TestConstants';
import { DatasetNotNumberedVersion } from '../../../src/datasets';
import { createDatasetUserPermissionsModel } from '../../testHelpers/datasets/datasetUserPermissionsHelper';
import { createDatasetLockModel, createDatasetLockPayload } from '../../testHelpers/datasets/datasetLockHelper';

describe('DatasetsRepository', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: DatasetsRepository = new DatasetsRepository();
  const testDatasetVersionSuccessfulResponse = {
    data: {
      status: 'OK',
      data: createDatasetVersionPayload(),
    },
  };
  const testCitation = 'test citation';
  const testCitationSuccessfulResponse = {
    data: {
      status: 'OK',
      data: {
        message: testCitation,
      },
    },
  };
  const testPrivateUrlToken = 'testToken';
  const testDatasetModel = createDatasetModel();
  const testVersionId = DatasetNotNumberedVersion.LATEST;

  beforeEach(() => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getDatasetSummaryFieldNames', () => {
    test('should return fields on successful response', async () => {
      const testFieldNames = ['test1', 'test2'];
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: testFieldNames,
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);

      const actual = await sut.getDatasetSummaryFieldNames();

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/summaryFieldNames`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testFieldNames);
    });

    test('should return error result on error response', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getDatasetSummaryFieldNames().catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/summaryFieldNames`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDataset', () => {
    const testIncludeDeaccessioned = false;
    const expectedRequestConfigApiKey = {
      params: { includeDeaccessioned: testIncludeDeaccessioned, includeFiles: false },
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY.headers,
    };
    const expectedRequestConfigSessionCookie = {
      params: { includeDeaccessioned: testIncludeDeaccessioned, includeFiles: false },
      withCredentials: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.withCredentials,
      headers: TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE.headers,
    };

    describe('by numeric id', () => {
      test('should return Dataset when providing id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`;

        // API Key auth
        let actual = await sut.getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        assert.match(actual, testDatasetModel);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);
        actual = await sut.getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned);
        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigSessionCookie);
        assert.match(actual, testDatasetModel);
      });

      test('should return Dataset when providing id, version id, and response with license is successful', async () => {
        const testDatasetLicense = createDatasetLicenseModel();
        const testDatasetVersionWithLicenseSuccessfulResponse = {
          data: {
            status: 'OK',
            data: createDatasetVersionPayload(testDatasetLicense),
          },
        };
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionWithLicenseSuccessfulResponse);

        const actual = await sut.getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned);

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
          expectedRequestConfigApiKey,
        );
        assert.match(actual, createDatasetModel(testDatasetLicense));
      });

      test('should return Dataset when providing id, version id, and response with license without icon URI is successful', async () => {
        const testDatasetLicenseWithoutIconUri = createDatasetLicenseModel(false);
        const testDatasetVersionWithLicenseSuccessfulResponse = {
          data: {
            status: 'OK',
            data: createDatasetVersionPayload(testDatasetLicenseWithoutIconUri),
          },
        };
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionWithLicenseSuccessfulResponse);

        const actual = await sut.getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned);

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
          expectedRequestConfigApiKey,
        );
        assert.match(actual, createDatasetModel(testDatasetLicenseWithoutIconUri));
      });

      test('should return error on repository read error', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getDataset(testDatasetModel.id, testVersionId, testIncludeDeaccessioned).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}`,
          expectedRequestConfigApiKey,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
    describe('by persistent id', () => {
      test('should return Dataset when providing persistent id, version id, and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);
        const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testVersionId}?persistentId=${testDatasetModel.persistentId}`;

        // API Key auth
        let actual = await sut.getDataset(testDatasetModel.persistentId, testVersionId, testIncludeDeaccessioned);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigApiKey);
        assert.match(actual, testDatasetModel);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDataset(testDatasetModel.persistentId, testVersionId, testIncludeDeaccessioned);

        assert.calledWithExactly(axiosGetStub, expectedApiEndpoint, expectedRequestConfigSessionCookie);
        assert.match(actual, testDatasetModel);
      });

      test('should return error on repository read error', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut
          .getDataset(testDatasetModel.persistentId, testVersionId, testIncludeDeaccessioned)
          .catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          `${TestConstants.TEST_API_URL}/datasets/:persistentId/versions/${testVersionId}?persistentId=${testDatasetModel.persistentId}`,
          expectedRequestConfigApiKey,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  describe('getPrivateUrlDataset', () => {
    test('should return Dataset when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetVersionSuccessfulResponse);

      const actual = await sut.getPrivateUrlDataset(testPrivateUrlToken);

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testDatasetModel);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getPrivateUrlDataset(testPrivateUrlToken).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDatasetCitation', () => {
    test('should return citation when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testCitationSuccessfulResponse);
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}/citation`;

      // API Key auth
      let actual = await sut.getDatasetCitation(testDatasetModel.id, testVersionId);

      assert.calledWithExactly(
        axiosGetStub,
        expectedApiEndpoint,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED,
      );
      assert.match(actual, testCitation);

      // Session cookie auth
      ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

      actual = await sut.getDatasetCitation(testDatasetModel.id, testVersionId);

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
      await sut.getDatasetCitation(1, testVersionId).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/versions/${testVersionId}/citation`,
        TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY_INCLUDE_DEACCESSIONED,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getPrivateUrlDatasetCitation', () => {
    test('should return citation when response is successful', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testCitationSuccessfulResponse);

      const actual = await sut.getPrivateUrlDatasetCitation(testPrivateUrlToken);

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}/citation`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testCitation);
    });

    test('should return error on repository read error', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getPrivateUrlDatasetCitation(testPrivateUrlToken).catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/datasets/privateUrlDatasetVersion/${testPrivateUrlToken}/citation`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getDatasetUserPermissions', () => {
    const testDatasetUserPermissions = createDatasetUserPermissionsModel();
    const testDatasetUserPermissionsResponse = {
      data: {
        status: 'OK',
        data: testDatasetUserPermissions,
      },
    };

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/userPermissions`;

      test('should return dataset user permissions when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetUserPermissionsResponse);

        // API Key auth
        let actual = await sut.getDatasetUserPermissions(testDatasetModel.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, testDatasetUserPermissions);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetUserPermissions(testDatasetModel.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, testDatasetUserPermissions);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getDatasetUserPermissions(testDatasetModel.id).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/userPermissions?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

      test('should return dataset user permissions when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetUserPermissionsResponse);
        // API Key auth
        let actual = await sut.getDatasetUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, testDatasetUserPermissions);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, testDatasetUserPermissions);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getDatasetUserPermissions(TestConstants.TEST_DUMMY_PERSISTENT_ID).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
  });

  describe('getDatasetLocks', () => {
    const testDatasetLocks = [createDatasetLockModel()];
    const testDatasetLocksResponse = {
      data: {
        status: 'OK',
        data: [createDatasetLockPayload()],
      },
    };

    describe('by numeric id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/${testDatasetModel.id}/locks`;

      test('should return dataset locks when providing id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetLocksResponse);

        // API Key auth
        let actual = await sut.getDatasetLocks(testDatasetModel.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, testDatasetLocks);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetLocks(testDatasetModel.id);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, testDatasetLocks);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getDatasetLocks(testDatasetModel.id).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });

    describe('by persistent id', () => {
      const expectedApiEndpoint = `${TestConstants.TEST_API_URL}/datasets/:persistentId/locks?persistentId=${TestConstants.TEST_DUMMY_PERSISTENT_ID}`;

      test('should return dataset locks when providing persistent id and response is successful', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').resolves(testDatasetLocksResponse);
        // API Key auth
        let actual = await sut.getDatasetLocks(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        assert.match(actual, testDatasetLocks);

        // Session cookie auth
        ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.SESSION_COOKIE);

        actual = await sut.getDatasetLocks(TestConstants.TEST_DUMMY_PERSISTENT_ID);

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_SESSION_COOKIE,
        );
        assert.match(actual, testDatasetLocks);
      });

      test('should return error result on error response', async () => {
        const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

        let error: ReadError = undefined;
        await sut.getDatasetLocks(TestConstants.TEST_DUMMY_PERSISTENT_ID).catch((e) => (error = e));

        assert.calledWithExactly(
          axiosGetStub,
          expectedApiEndpoint,
          TestConstants.TEST_EXPECTED_AUTHENTICATED_REQUEST_CONFIG_API_KEY,
        );
        expect(error).to.be.instanceOf(Error);
      });
    });
  });
});
