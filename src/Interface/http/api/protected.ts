import express, { type Request, type Response, type NextFunction, Router } from 'express'
import { Request as JWTRequest } from "express-jwt";
import { DependencyContainer } from 'tsyringe';

export default function registerProtectedRoutes(container: DependencyContainer): Router {
  const router = express.Router()
  router.get(
    '/nonsecure',
    (req: Request, res: Response, next: NextFunction) => {
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
  return router
}
