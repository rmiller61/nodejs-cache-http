const express = require("express")
const responseTime = require("response-time")
const redis = require("redis")
const axios = require("axios")
const bodyParser = require("body-parser")

const encode = (args) => {
  // btoa(JSON.stringify(args))
  const str = JSON.stringify(args)
  const buff = new Buffer.from(str, "base64")
  return buff
}

const decode = (buff) => {
  //JSON.parse(atob(str))
  //const buff = new Buffer.from(str, "base64")
  const newStr = buff.toString()
  const json = JSON.parse(newStr)
  return json
}

const addTime = (timeToAdd) => {
  const date = new Date()
  const time = date.getTime()
  const expiresDefault = new Date(time + timeToAdd)
  return expiresDefault.getTime()
}

const defaults = {
  expires: 1000 * 60 * 60 * 24 * 7, // 7 days by default
}

const today = new Date()

const now = today.getTime()

// Src: https://betterprogramming.pub/how-to-cache-api-requests-with-redis-and-node-js-cba883385e7

const runApp = async () => {
  // connect to redis
  const client = redis.createClient()
  client.on("error", (err) => console.log("Redis Client Error", err))
  await client.connect()
  console.log("Redis connected!")

  const jsonParser = bodyParser.json()
  const app = express()
  app.use(responseTime())

  app.post("/", jsonParser, async (req, res) => {
    const { expires: reqExpires, ...config } = req.body
    const expiresAt = addTime(reqExpires || defaults.expires)

    try {
      // The key for the database entry
      const key = encode(config)

      // Check the database for the key
      const cachedResponse = await client.get(key)

      const update = async () => {
        const { data } = await axios.request(config)
        // If the key does not exist, set the key to the value and return the value
        const value = {
          response: data,
          expiresAt,
        }
        await client.set(key, JSON.stringify(value))
        return data
      }

      if (cachedResponse) {
        // If the key exists
        const { response, expiresAt } = decode(cachedResponse)

        if (expiresAt > now) {
          //console.log(expiresAt, now)
          // If the cached response is still valid
          return res.status(200).header("x-api-cache-status", "CACHED").json(response)
        } else {
          // If the cached response is expired
          const updatedResponse = await update()
          return res
            .status(200)
            .header("x-api-cache-status", "EXPIRED-UPDATED")
            .json(updatedResponse)
        }
      } else {
        // If the key does not exist
        const updatedResponse = await update()
        return res.status(200).header("x-api-cache-status", "FRESH").json(updatedResponse)
      }
    } catch (err) {
      throw new Error(err)
    }
  })

  app.get("/cache", async (req, res) => {
    const key = req.query.url

    try {
      const cachedResponse = await client.get(key)
      //console.log('cachedResponse', cachedResponse)
      return res.status(200).json(cachedResponse)
      //return res.status(200).json(decodeURI(key))
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  })

  app.post("/save", jsonParser, async (req, res) => {
    const date = new Date()
    const time = date.getTime()
    const msDefault = 1000 * 60 * 60 * 24 * 7 // 7 days by default
    const expiresDefault = new Date(time + msDefault)
    const key = req.body.url
    const data = req.body.data
    const expires = req.body.expires ?? expiresDefault.getTime() // 7 days by default
    const value = {
      data,
      expires,
    }

    try {
      await client.set(key, JSON.stringify(value))
      return res.status(200).json(value)
      //return res.status(200).json(decodeURI(key))
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  })

  app.listen(process.env.PORT || 3005, () => {
    console.log("Node server started")
  })
}

runApp()
