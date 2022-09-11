export const encode = (args) => {
  // btoa(JSON.stringify(args))
  const str = JSON.stringify(args)
  const buff = new (Buffer.from as any)(str, "base64")
  return buff
}

export const decode = (buff) => {
  //JSON.parse(atob(str))
  //const buff = new Buffer.from(str, "base64")
  const newStr = buff.toString()
  const json = JSON.parse(newStr)
  return json
}

export const addTime = (timeToAdd) => {
  const date = new Date()
  const time = date.getTime()
  const expiresDefault = new Date(time + timeToAdd)
  return expiresDefault.getTime()
}
