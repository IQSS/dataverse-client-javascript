export type EditGuestbookQuestionTypeDTO = 'text' | 'textarea' | 'options'

export interface EditGuestbookOptionDTO {
  id?: number
  value: string
  displayOrder: number
}

export interface EditGuestbookCustomQuestionDTO {
  id?: number
  question: string
  required: boolean
  displayOrder: number
  type: EditGuestbookQuestionTypeDTO
  hidden: boolean
  optionValues?: EditGuestbookOptionDTO[]
}

export interface EditGuestbookDTO {
  id?: number
  name: string
  enabled: boolean
  emailRequired: boolean
  nameRequired: boolean
  institutionRequired: boolean
  positionRequired: boolean
  createTime: string
  customQuestions: EditGuestbookCustomQuestionDTO[]
}
