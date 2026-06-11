export type EditGuestbookQuestionTypeDTO = 'text' | 'textarea' | 'options'

export interface EditGuestbookOptionDTO {
  id?: number | string
  value: string
  displayOrder: number
}

export interface EditGuestbookCustomQuestionDTO {
  id?: number | string
  question: string
  required: boolean
  displayOrder: number
  type: EditGuestbookQuestionTypeDTO
  hidden: boolean
  optionValues?: EditGuestbookOptionDTO[]
}

export interface EditGuestbookDTO {
  id?: number | string
  name: string
  enabled: boolean
  emailRequired: boolean
  nameRequired: boolean
  institutionRequired: boolean
  positionRequired: boolean
  customQuestions: EditGuestbookCustomQuestionDTO[]
  createTime?: string
}
