import express, { type Request, type Response, type Express } from 'express'

// Express Services
import registerMiddleware from './middlewares.js'
import registerRoutes from './routes.js'
import errorHandlerMiddleware from '../../Interface/http/error/errorHandler.js'
import { type DependencyContainer } from "tsyringe"

export default function createServer(container: DependencyContainer): Express {
  const server = express()
  registerMiddleware(server)

  // Sanity Check
  server.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'hello world, from boilerplate REST API'
    })
  })
  registerRoutes(server, container)
  server.use(errorHandlerMiddleware)
  return server
}
