import express from "express"
import responseTime from "response-time"
import redis from "redis"
import axios from "axios"
import bodyParser from "body-parser"

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
