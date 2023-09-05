import { UseCase } from '../../../core/domain/useCases/UseCase';
import { ISettingsRepository } from '../repositories/ISettingsRepository';

export class GetSetting implements UseCase<string> {
  private settingsRepository: ISettingsRepository;

  constructor(settingsRepository: ISettingsRepository) {
    this.settingsRepository = settingsRepository;
  }

  async execute(settingName: string): Promise<string> {
    return await this.settingsRepository.getSetting(settingName);
  }
}
