import express, { type Request, type Response, type NextFunction, Router } from 'express'
import { DependencyContainer } from 'tsyringe'

import type IUserlogin from '../../../Domains/users/entities/UserLogin.js'
import type INewAuth from '../../../Domains/authentications/entities/NewAuth.js'

import LogoutUserUseCase, { type IDeleteTokenUseCasePayload } from '../../../Applications/use_case/authentications/LogoutUserUseCase.js'
import LoginUserUseCase from '../../../Applications/use_case/authentications/LoginUserUseCase.js'
import RefreshAuthenticationUseCase, { type IRefreshTokenUseCasePayload } from '../../../Applications/use_case/authentications/RefreshAuthenticationUseCase.js'

const postResponseBody = (tokens: INewAuth) => ({
  status: 'success',
  data: {
    ...tokens
  }
})

const putResponseBody = (token: string) => ({
  status: 'success',
  data: {
    accessToken: token
  }
})

export default function registerAuthenticationRoutes(container: DependencyContainer): Router {
  const router = express.Router()
  router
    .route('/')
    .post((req: Request, res: Response, next: NextFunction) => {
      const payload: IUserlogin = req.body
      const loginUserUseCase = container.resolve(LoginUserUseCase)
      loginUserUseCase.execute(payload)
        .then((tokens: INewAuth) => {
          res.statusCode = 201
          res.json(postResponseBody(tokens))
        })
        .catch((error: any) => next(error))
    })
    .put((req: Request, res: Response, next: NextFunction) => {
      const payload: IRefreshTokenUseCasePayload = req.body
      const refreshAuthenticationUseCase = container
        .resolve(RefreshAuthenticationUseCase)
      refreshAuthenticationUseCase.execute(payload)
        .then((token: string) => {
          res.json(putResponseBody(token))
        })
        .catch((error: any) => next(error))
    })
    .delete((req: Request, res: Response, next: NextFunction) => {
      const payload: IDeleteTokenUseCasePayload = req.body
      const logoutUserUseCase = container.resolve(LogoutUserUseCase)
      logoutUserUseCase.execute(payload)
        .then(() => {
          res.json({ status: 'success' })
        })
        .catch((error: any) => next(error))
    })

  return router
}
