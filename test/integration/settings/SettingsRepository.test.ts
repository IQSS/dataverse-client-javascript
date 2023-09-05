import { SettingsRepository } from '../../../src/settings/infra/repositories/SettingsRepository';
import { assert } from 'sinon';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';

describe('getSetting', () => {
  const sut: SettingsRepository = new SettingsRepository();

  beforeAll(async () => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, process.env.TEST_API_KEY);
  });

  test('should return setting value when setting exists', async () => {
    const systemEmailSettingName = ':SystemEmail';
    const actual = await sut.getSetting(systemEmailSettingName);

    assert.match(actual, 'dataverse@localhost');
  });

  test('should return error when setting does not exist', async () => {
    const nonExistentSettingName = ':NonExistentSetting';
    let error: ReadError = undefined;
    await sut.getSetting(nonExistentSettingName).catch((e) => (error = e));

    assert.match(
      error.message,
      `There was an error when reading the resource. Reason was: [404] Setting ${nonExistentSettingName} not found`,
    );
  });
});
