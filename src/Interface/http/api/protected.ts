import express, { type Request, type Response, type NextFunction } from 'express'
import { expressjwt, Request as JWTRequest } from "express-jwt";

const router = express.Router()

router.get('/nonsecure', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 'success',
    message: 'unprotected route'
  })
})

router.get(
  '/secure',
  (req: JWTRequest, res: Response) => {
    res.json({
      status: 'success',
      message: 'protected route',
      data: {
        ...req.auth
      }
    })
  }
)

export default router