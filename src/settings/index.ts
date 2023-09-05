import { SettingsRepository } from './infra/repositories/SettingsRepository';
import { GetSetting } from './domain/useCases/GetSetting';

const getSetting = new GetSetting(new SettingsRepository());

export { getSetting };
