export interface ISettingsRepository {
  getSetting(settingName: string): Promise<string>;
}
