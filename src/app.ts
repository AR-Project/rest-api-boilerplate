import express, {Express, Request, Response} from 'express'
import server from './Infrastructure/http/createServer.js'
import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT

const app = server

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
