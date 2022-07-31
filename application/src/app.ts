import express from "express"
import responseTime from "response-time"
import bodyParser from "body-parser"
import axios from "axios"
import { defaults, now } from "./constants"
import { encode, decode, addTime } from "./utils"
const redis = require("redis")

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
    } catch (err: any) {
      throw new Error(err)
    }
  })

  app.listen(process.env.PORT || 3005, () => {
    console.log("Node server started")
  })
}

runApp()