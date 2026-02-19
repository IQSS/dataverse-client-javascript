export interface GuestbookAnswerDTO {
  id: number | string
  value: string | string[]
}

export interface GuestbookResponseDTO {
  guestbookResponse: {
    answers: GuestbookAnswerDTO[]
  }
}
