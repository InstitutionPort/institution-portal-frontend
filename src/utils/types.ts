import { JWTPayload } from "jose"
import { UUIDTypes } from "uuid"


export type ERROR_RESPONSE = {
  code: string
  message: string
  metaData: null | Record<any, any>
}
export type SUCCESS_RESPONSE = ERROR_RESPONSE & { data: null | Record<any, any> }

export type ERROR_API_RESPONSE = {
  success: null
  error: ERROR_RESPONSE
}
export type SUCCESS_API_RESPONSE = {
  success: SUCCESS_RESPONSE
  error: null
}

export type SessionTokenPayload = {
  user: string
  id: UUIDTypes
} & JWTPayload

export type OtpTokenPayload = {
  type: 'password-email' | 'password-mobile' | 'email-new' | 'email-current' | 'mobile-new' | 'mobile-current'
  value: string
  // jti: UUIDTypes
} & JWTPayload


export interface SelfThrownError {
  name: 'SelfThrownError'
  message: string
  code: string
  metaData: Record<string, any> | null
  status: number
}


export type SecureUserMutation = {
  type: 'email-update' | 'mobile-update' | 'mobile-add' | 'mobile-delete' | 'password-mobile' | 'password-email'
}



export type FullNationApiResponse = {
  name: string,
  code: string,
  flag: string,
}
