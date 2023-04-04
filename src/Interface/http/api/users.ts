import express, { type Request, type Response, type NextFunction, Router } from 'express'
import { DependencyContainer } from 'tsyringe'

import { IRegisteredUser } from '../../../Domains/users/entities/RegisteredUser.js'

import AddUserUseCase from '../../../Applications/use_case/users/AddUserUseCase.js'

const successResponseBody = (addedUser: IRegisteredUser) => ({
  status: 'succes',
  data: {
    addedUser
  }
})

export default function registerUsersRoute(container: DependencyContainer): Router {
  const router = express.Router()
  router.post(
    '/',
    (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body
      const addUserUseCase = container.resolve(AddUserUseCase)
      addUserUseCase.execute(payload)
        .then((addedUser: IRegisteredUser) => {
          res.statusCode = 201
          res.json(successResponseBody(addedUser))
        })
        .catch((error: any) => {
          next(error)
        })
    })
  return router
}
