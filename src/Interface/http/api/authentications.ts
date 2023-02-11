import express, { type Request, type Response, type NextFunction } from 'express'

import type IUserlogin from '../../../Domains/users/entities/UserLogin.js'
import type INewAuth from '../../../Domains/authentications/entities/NewAuth.js' 
import { type IRefreshTokenUseCasePayload } from '../../../Applications/use_case/authentications/RefreshAuthenticationUseCase.js'

import LogoutUserUseCase, { type IDeleteTokenUseCasePayload } from '../../../Applications/use_case/authentications/LogoutUserUseCase.js'


import pool from '../../../Infrastructure/database/postgres/pool.js'
import NanoIdInfrastructure from '../../../Infrastructure/externalModule/nanoId.js'

import UserRepositoryPostgres from '../../../Infrastructure/repository/UserRepositoryPostgres.js'
import AuthenticationRepositoryPostgres from '../../../Infrastructure/repository/AuthenticationsRepositoryPostgres.js'

import JwtTokenManager from '../../../Infrastructure/security/JwtTokenManager.js'
import BcryptPasswordHash from '../../../Infrastructure/security/BcryptPasswordHash.js'

import LoginUserUseCase from '../../../Applications/use_case/authentications/LoginUserUseCase.js'
import RefreshAuthenticationUseCase from '../../../Applications/use_case/authentications/RefreshAuthenticationUseCase.js'

// Start of construct object 
const userRepositoryPostgres = new UserRepositoryPostgres(pool, NanoIdInfrastructure)
const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)



// Start of define router
const router = express.Router()

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const payload: IUserlogin = req.body
  const loginUserUseCase = new LoginUserUseCase({
    userRepository: userRepositoryPostgres,
    authenticationRepository: authenticationRepositoryPostgres,
    authenticationTokenManager: new JwtTokenManager(),
    passwordHash: new BcryptPasswordHash()
  })

  loginUserUseCase.execute(payload)
    .then((tokens: INewAuth) => {
      res.statusCode = 201
      res.json({
        status: 'success',
        data : {
          ...tokens
        }
      })
    })
    .catch((error: any) => next(error))
})

router.put('/', (req: Request, res: Response, next: NextFunction) => {
  const payload: IRefreshTokenUseCasePayload = req.body
  const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
    authenticationRepository: authenticationRepositoryPostgres,
    authenticationTokenManager: new JwtTokenManager()
  })

  refreshAuthenticationUseCase.execute(payload)
    .then((token: string) =>{
      res.json({
        status: 'success',
        data: {
          accessToken: token
        }
      })
    })
    .catch((error: any) => next(error))
})


router.delete('/', (req: Request, res: Response, next: NextFunction) => {
  const payload: IDeleteTokenUseCasePayload = req.body
  const logoutUserUseCase = new LogoutUserUseCase({
    authenticationRepository: authenticationRepositoryPostgres,
  })

  logoutUserUseCase.execute(payload)
  .then(() =>{
    res.json({
      status: 'success',
    })
  })
  .catch((error: any) => next(error))
})

export default router