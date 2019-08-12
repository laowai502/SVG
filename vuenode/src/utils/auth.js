import Cookies from 'js-cookie'

const TokenKey = 'Authorization'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function clearAll() {
	return sessionStorage.clear()
}

export function getLocKey(key) {
  return localStorage.getItem(key)
}

export function setLocKey(key, value) {
  return localStorage.setItem(key, value)
}

export function removeLocToken(key) {
  return localStorage.removeItem(key)
}

export function clearLocalStorage() {
	return localStorage.clear()
}

export function getSessionKey(key) {
  return sessionStorage.getItem(key)
}

export function setSessionKey(key, value) {
  return sessionStorage.setItem(key, value)
}

export function removeSessionToken(key) {
  return sessionStorage.removeItem(key)
}

export function clearSessionStorage() {
	return sessionStorage.clear()
}

/**
 * cookie 时效为one day
 */
export function getCookie(token) {
    return Cookies.get(token)
}

export function setCookie(token, val) {
    return Cookies.set(token, val, { expires: 1 })
}

export function removeCookie(token) {
    return Cookies.remove(token)
}
