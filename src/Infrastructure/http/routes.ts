import { type Application } from "express";
import { type DependencyContainer } from "tsyringe";
import registerUsersRoute from '../../Interface/http/api/users.js'
import registerAuthenticationRouter from '../../Interface/http/api/authentications.js'
import registerProtectedRouter from '../../Interface/http/api/protected.js'

export default function registerRoutes(app: Application, container: DependencyContainer): void {
  app.use('/users', registerUsersRoute(container))
  app.use('/authentications', registerAuthenticationRouter(container))
  app.use('/protected', registerProtectedRouter(container))
}
