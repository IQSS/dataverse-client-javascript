import { GetSetting } from '../../../src/settings/domain/useCases/GetSetting';
import { ISettingsRepository } from '../../../src/settings/domain/repositories/ISettingsRepository';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { assert, createSandbox, SinonSandbox } from 'sinon';

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox();
  const testSettingName = 'testSettingName';

  afterEach(() => {
    sandbox.restore();
  });

  test('should return setting value on repository success', async () => {
    const testSettingValue = 'testSettingValue';
    const settingsRepositoryStub = <ISettingsRepository>{};
    const getSettingStub = sandbox.stub().returns(testSettingValue);
    settingsRepositoryStub.getSetting = getSettingStub;

    const sut = new GetSetting(settingsRepositoryStub);

    const actual = await sut.execute(testSettingName);

    assert.match(actual, testSettingValue);
    assert.calledWithExactly(getSettingStub, testSettingName);
  });

  test('should return error result on repository error', async () => {
    const settingsRepositoryStub = <ISettingsRepository>{};
    const testReadError = new ReadError();
    settingsRepositoryStub.getSetting = sandbox.stub().throwsException(testReadError);

    const sut = new GetSetting(settingsRepositoryStub);

    let actualError: ReadError = undefined;
    await sut.execute(testSettingName).catch((e) => (actualError = e));

    assert.match(actualError, testReadError);
  });
});
