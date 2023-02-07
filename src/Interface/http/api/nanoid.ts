
import { Request, Response } from "express";

import generator from '../../../Infrastructure/externalModule/nanoId.js'

export default async function checkHealth (req:Request, res: Response) {
  res.statusCode = 201
  res.json({
      message: 'success',
      id: `${generator.generate()}`
    })
  
} 