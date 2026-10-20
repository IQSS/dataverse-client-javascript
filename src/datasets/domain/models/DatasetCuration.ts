export interface DatasetCurationStatus {
  label?: string
  createTime?: string
  assigner?: string
}

export interface DatasetReviewSubmission {
  inReview: boolean
  message: string
}
