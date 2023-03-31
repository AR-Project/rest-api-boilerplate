import express, { type Request, type Response, type NextFunction, Router } from 'express'
import AddUserUseCase from '../../../Applications/use_case/users/AddUserUseCase.js'
import { IRegisteredUser } from '../../../Domains/users/entities/RegisteredUser.js'
import { DependencyContainer } from 'tsyringe'

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
  return router

}



// export default router
