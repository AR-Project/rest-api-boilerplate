import container from '../../../Infrastructure/container.js'
import express, { type Request, type Response, type NextFunction } from 'express'

import AddUserUseCase from '../../../Applications/use_case/users/AddUserUseCase.js'

import { IRegisteredUser } from '../../../Domains/users/entities/RegisteredUser.js'

const router = express.Router()

router.post('/', (req: Request, res: Response, next: NextFunction) => {
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

export default router
