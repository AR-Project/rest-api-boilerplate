import container from '../../../Infrastructure/container.js'
import express, { type Request, type Response, type NextFunction } from 'express'

import pool from '../../../Infrastructure/database/postgres/pool.js'
import NanoIdInfrastructure from '../../../Infrastructure/externalModule/nanoId.js'
import UserRepositoryPostgres from '../../../Infrastructure/repository/UserRepositoryPostgres.js'

import AddUserUseCase from '../../../Applications/use_case/users/AddUserUseCase.js'
import BcryptPasswordHash from '../../../Infrastructure/security/BcryptPasswordHash.js'
import RoleCheck from '../../../Infrastructure/security/RoleCheckHelper.js'

import { IRegisteredUser } from '../../../Domains/users/entities/RegisteredUser.js'

// const userRepositoryPostgres = new UserRepositoryPostgres(pool, NanoIdInfrastructure)
const userRepositoryPostgres = container.resolve(UserRepositoryPostgres)
const addUserUseCase = new AddUserUseCase({
  userRepository: userRepositoryPostgres,
  passwordHash: new BcryptPasswordHash(),
  roleCheck: new RoleCheck()
})

const router = express.Router()

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body
  addUserUseCase.execute(payload)
    .then((addedUser: IRegisteredUser) => {
      res.statusCode = 201
      res.json({
        status: 'succes',
        data: {
          addedUser
        }
      })
    })
    .catch((error: any) => {
      next(error)
    })
})

export default router
