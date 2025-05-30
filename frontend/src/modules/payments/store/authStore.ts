export const getAuthToken = (): string | null => {
  return localStorage.getItem("token")
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem("token", token)
}

export const removeAuthToken = (): void => {
  localStorage.removeItem("token")
}