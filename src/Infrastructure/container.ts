import { container } from "tsyringe";

// Postgress Pool
import { type Pool } from "pg";
import pool from "./database/postgres/pool.js";

// Application Layer
import IRoleCheck from '../Applications/security/RoleCheck.js'
import IAuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js'
import IPasswordHash from '../Applications/security/PasswordHash.js'
import IIdGenerator from "../Applications/tools/IdGenerator.js";

// Application Layer - Implementation
import BcryptPasswordHash from "./security/BcryptPasswordHash.js";
import JwtTokenManager from "./security/JwtTokenManager.js";
import RoleCheckHelper from '../Infrastructure/security/RoleCheckHelper.js'
import nanoId from './externalModule/nanoId.js'

// Domain Layer
import IUserRepository from "../Domains/users/UserRepository.js";
import IAuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js'

// Domain Layer - Implementation
import UserRepositoryPostgres from "./repository/UserRepositoryPostgres.js";
import AuthenticationRepositoryPostgres from "./repository/AuthenticationsRepositoryPostgres.js";

container.register<Pool>("Pool", { useValue: pool })
container.register<IIdGenerator>("IIdGenerator", { useValue: nanoId })
container.register<IPasswordHash>('IPasswordHash', { useClass: BcryptPasswordHash })
container.register<IRoleCheck>('IRoleCheck', { useClass: RoleCheckHelper })
container.register<IAuthenticationTokenManager>(
  'IAuthenticationTokenManager',
  {
    useClass: JwtTokenManager
  }
)
container.register<IUserRepository>(
  'IUserRepository',
  {
    useClass: UserRepositoryPostgres
  }
)
container.register<IAuthenticationRepository>(
  'IAuthenticationRepository',
  {
    useClass: AuthenticationRepositoryPostgres
  }
)

export default container
