export const encode = (args: Record<string, unknown>) => btoa(JSON.stringify(args))

export const decode = (str: string) => JSON.parse(atob(str))

export const addTime = (timeToAdd: number) => {
  const date = new Date()
  const time = date.getTime()
  const expiresDefault = new Date(time + timeToAdd)
  return expiresDefault.getTime()
}
