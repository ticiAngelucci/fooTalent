export const getAuthToken = (): string | null => {
  return sessionStorage.getItem("token")
}

export const setAuthToken = (token: string): void => {
  sessionStorage.setItem("token", token)
}

export const removeAuthToken = (): void => {
  sessionStorage.removeItem("token")
}