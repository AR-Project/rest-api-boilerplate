import express, { type Request, type Response, type NextFunction, type ErrorRequestHandler } from 'express'

import checkHealth from '../../Interface/http/api/checkHealth.js'
import nanoIdApi from '../../Interface/http/api/nanoid.js'

const server = express()

server.use(express.json())

server.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hello nodemonn from npm package'
  })
})

server.get('/health', checkHealth)
server.get('/generate', nanoIdApi)

export default server