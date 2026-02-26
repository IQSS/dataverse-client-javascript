export type CreateGuestbookQuestionTypeDTO = 'text' | 'textarea' | 'options'

export interface CreateGuestbookOptionDTO {
  value: string
  displayOrder: number
}

export interface CreateGuestbookCustomQuestionDTO {
  question: string
  required: boolean
  displayOrder: number
  type: CreateGuestbookQuestionTypeDTO
  hidden: boolean
  optionValues?: CreateGuestbookOptionDTO[]
}

export interface CreateGuestbookDTO {
  name: string
  enabled: boolean
  emailRequired: boolean
  nameRequired: boolean
  institutionRequired: boolean
  positionRequired: boolean
  email: string
  institution: string
  position: string
  customQuestions: CreateGuestbookCustomQuestionDTO[]
}
