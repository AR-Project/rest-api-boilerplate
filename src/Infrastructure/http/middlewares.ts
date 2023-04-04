import express, { Application } from "express";
import { expressjwt } from "express-jwt";

export default function registerMiddleware(app: Application): void {
  app.use(express.json())
  app.use(
    expressjwt({
      secret: process.env.ACCESS_TOKEN_KEY as string,
      algorithms: ["HS256"]
    }).unless({
      path: [
        { url: '/users', methods: ['POST'] },
        { url: '/authentications' },
        { url: '/protected/nonsecure' },
        { url: '/', methods: ['GET'] }
      ]
    })
  )
}
