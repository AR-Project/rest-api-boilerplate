import * as dotenv from 'dotenv'
dotenv.config()
import 'reflect-metadata'
import express, { Express, Request, Response } from 'express'
import container from './Infrastructure/container.js'
import server from './Infrastructure/http/createServer.js'

const PORT = process.env.PORT

const app = server

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
