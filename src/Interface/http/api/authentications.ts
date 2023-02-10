import express, { type Request, type Response, type NextFunction } from 'express'

import type IUserlogin from '../../../Domains/users/entities/UserLogin.js'
import type INewAuth from '../../../Domains/authentications/entities/NewAuth.js' 

import pool from '../../../Infrastructure/database/postgres/pool.js'
import NanoIdInfrastructure from '../../../Infrastructure/externalModule/nanoId.js'

import UserRepositoryPostgres from '../../../Infrastructure/repository/UserRepositoryPostgres.js'
import AuthenticationRepositoryPostgres from '../../../Infrastructure/repository/AuthenticationsRepositoryPostgres.js'

import JwtTokenManager from '../../../Infrastructure/security/JwtTokenManager.js'
import BcryptPasswordHash from '../../../Infrastructure/security/BcryptPasswordHash.js'

import LoginUserUseCase from '../../../Applications/use_case/authentications/LoginUserUseCase.js'

// Start of construct object 
const userRepositoryPostgres = new UserRepositoryPostgres(pool, NanoIdInfrastructure)
const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)

const loginUserUseCase = new LoginUserUseCase({
  userRepository: userRepositoryPostgres,
  authenticationRepository: authenticationRepositoryPostgres,
  authenticationTokenManager: new JwtTokenManager(),
  passwordHash: new BcryptPasswordHash()
})

// Start of define router
const router = express.Router()

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const payload: IUserlogin = req.body

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

export default router