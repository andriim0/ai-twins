import { v4 as uuidv4 } from 'uuid'

const USER_ID_COOKIE = 'dt_uid'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function getUserIdFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${USER_ID_COOKIE}=([^;]+)`))
  return match ? match[1] : null
}

export function generateUserId(): string {
  return uuidv4()
}

export function buildUserIdCookie(userId: string): string {
  return `${USER_ID_COOKIE}=${userId}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; HttpOnly`
}

export { USER_ID_COOKIE }
