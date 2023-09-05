import { ApiRepository } from '../../../core/infra/repositories/ApiRepository';
import { ISettingsRepository } from '../../domain/repositories/ISettingsRepository';

export class SettingsRepository extends ApiRepository implements ISettingsRepository {
  public async getSetting(settingName: string): Promise<string> {
    return this.doGet(`/admin/settings/${settingName}`)
      .then((response) => response.data.data.message)
      .catch((error) => {
        throw error;
      });
  }
}
