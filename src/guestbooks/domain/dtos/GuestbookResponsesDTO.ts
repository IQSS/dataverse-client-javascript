import { Guestbook } from '../models/Guestbook'
import { GuestbookResponse } from '../models/GuestbookResponse'

export interface GuestbookResponsesDTO {
  guestbook: Guestbook
  responses: GuestbookResponse[]
  pagination?: GuestbookResponsesPaginationDTO
}

export interface GuestbookResponsesPaginationDTO {
  next?: string
  totalResponses: number
}
