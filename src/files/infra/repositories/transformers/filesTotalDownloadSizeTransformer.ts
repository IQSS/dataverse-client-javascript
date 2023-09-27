import { AxiosResponse } from 'axios/index';

export const transformFilesTotalDownloadSizeResponseToNumber = (response: AxiosResponse): number => {
  const filesTotalDownloadSizePayload = response.data.data;
  const message = filesTotalDownloadSizePayload.message;
  const indexOfFilesTotalDownloadSizePayloadNumber = 14;

  return Number(message.split(' ')[indexOfFilesTotalDownloadSizePayloadNumber]);
};
