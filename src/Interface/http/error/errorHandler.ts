import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from 'express'
import DomainErrorTranslator, { type ITranslatedError } from '../../../Commons/exceptions/DomainErrorTranslator.js'
import ClientError from '../../../Commons/exceptions/ClientError.js'


export default function errorHandlerMiddleware(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof Error) {
    const translatedError: ITranslatedError = DomainErrorTranslator.translate(err)

    // Error coming from expressjwt middleware
    if (err.name === "UnauthorizedError") {
      const responseBody = {
        status: 'fail',
        message: 'unauthorized'
      }
      res.status(401).json(responseBody)
    }

    // Error coming from infrastructure, domains and application layer
    if (translatedError instanceof ClientError) {
      res.status(translatedError.statusCode)
      res.json({ status: 'fail', message: translatedError.message })
    } else {
      next(err)
    }
  }
}
