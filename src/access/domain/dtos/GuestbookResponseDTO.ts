export interface GuestbookAnswerDTO {
  id: number | string
  value: string | string[]
}

export interface GuestbookResponseDTO {
  guestbookResponse: {
    name?: string
    email?: string
    institution?: string
    position?: string
    answers?: GuestbookAnswerDTO[]
  }
}
