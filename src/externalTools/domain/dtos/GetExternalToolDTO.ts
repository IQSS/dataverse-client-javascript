import type { GuestbookResponseDTO } from '../../../access/domain/dtos/GuestbookResponseDTO'

/**
 * @property {boolean} preview - boolean flag to indicate if the request is for previewing the tool or not.
 * @property {string} locale - string specifying the locale for internationalization
 */

export interface GetExternalToolDTO {
  preview: boolean
  locale: string
}

export interface GetFileExternalToolDTO extends GetExternalToolDTO {
  /** The completed guestbook form for files that require one. */
  guestbookResponse?: GuestbookResponseDTO['guestbookResponse']
}
