import express, { type Request, type Response, type NextFunction } from 'express'

const router = express.Router()

router.get('/nonsecure',  (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 'success',
    message: 'unprotected route'
  })
})

export default router