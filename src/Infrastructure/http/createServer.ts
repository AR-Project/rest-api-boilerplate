import "reflect-metadata"
import * as dotenv from 'dotenv'
dotenv.config()
import express, { type Request, type Response } from 'express'
import { expressjwt, Request as JWTRequest } from "express-jwt";

// Middleware
import registerMiddleware from './middlewares.js'
import errorHandlerMiddleware from '../../Interface/http/error/errorHandler.js'

// Router
import userRouter from '../../Interface/http/api/users.js'
import authenticationRouter from '../../Interface/http/api/authentications.js'
import protectedRouter from '../../Interface/http/api/protected.js'


const server = express()
registerMiddleware(server)

// Sanity Check
server.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hello world, from boilerplate REST API'
  })
})

// Register Route
server.use('/users', userRouter)
server.use('/authentications', authenticationRouter)
server.use('/protected', protectedRouter)

// Error Middleware
server.use(errorHandlerMiddleware)

export default server