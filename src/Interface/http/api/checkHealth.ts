import { Request, Response } from "express";

export default async function checkHealth (req:Request, res: Response) {
  await res.json({
      status: 'success',
      message: 'Server is runningsss'
    })
  
} 