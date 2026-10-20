export type SignUpResult = SignUpCreatedResult | SignUpPendingResult

export interface SignUpCreatedResult {
  status: 'created'
  identifier: string
}

export interface SignUpPendingResult {
  status: 'pending'
}
