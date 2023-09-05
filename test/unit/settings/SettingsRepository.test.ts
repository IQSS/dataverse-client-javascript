import { SettingsRepository } from '../../../src/settings/infra/repositories/SettingsRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('getSetting', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: SettingsRepository = new SettingsRepository();
  const testSettingName = 'testSettingName';

  beforeEach(() => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);
  });

  afterEach(() => {
    sandbox.restore();
  });

  test('should return setting value on successful response', async () => {
    const testSettingValue = 'testSettingValue';
    const testSuccessfulResponse = {
      data: {
        status: 'OK',
        data: {
          message: testSettingValue,
        },
      },
    };
    const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);

    const actual = await sut.getSetting(testSettingName);

    assert.calledWithExactly(
      axiosGetStub,
      `${TestConstants.TEST_API_URL}/admin/settings/${testSettingName}`,
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
    );
    assert.match(actual, testSettingValue);
  });

  test('should return error result on error response', async () => {
    const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

    let error: ReadError = undefined;
    await sut.getSetting(testSettingName).catch((e) => (error = e));

    assert.calledWithExactly(
      axiosGetStub,
      `${TestConstants.TEST_API_URL}/admin/settings/${testSettingName}`,
      TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
    );
    expect(error).to.be.instanceOf(Error);
  });
});
