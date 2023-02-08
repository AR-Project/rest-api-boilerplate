import express, { type Request, type Response, type NextFunction, type ErrorRequestHandler } from 'express'

import checkHealth from '../../Interface/http/api/checkHealth.js'
import nanoIdApi from '../../Interface/http/api/nanoid.js'

import ClientError from '../../Commons/exceptions/ClientError.js'
import DomainErrorTranslator, { type ITranslatedError } from '../../Commons/exceptions/DomainErrorTranslator.js'

import userRouter from '../../Interface/http/api/users.js'


const server = express()

server.use(express.json())

server.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hello nodemonn from npm package'
  })
})

server.get('/health', checkHealth)
server.get('/generate', nanoIdApi)

server.use('/users', userRouter)

server.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof Error) {
    const translatedError: ITranslatedError = DomainErrorTranslator.translate(err)

    if (translatedError instanceof ClientError) {
      res.status(translatedError.statusCode)
      res.json({ status: 'fail', message: translatedError.message })
    } else {
      console.log(err.stack)
      // res.status(500)
      // res.json({ status: 'fail', message: 'server fail' })
      next(err)
    }
  }
})


export default server