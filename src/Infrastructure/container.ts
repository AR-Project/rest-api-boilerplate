import { container } from "tsyringe";

import { Pool } from "pg";
import pool from "./database/postgres/pool.js";

import IRoleCheck from '../Applications/security/RoleCheck.js'
import RoleCheckHelper from '../Infrastructure/security/RoleCheckHelper.js'

import IIdGenerator from "../Applications/tools/IdGenerator.js";
import nanoId from './externalModule/nanoId.js'

import PasswordHash from '../Applications/security/PasswordHash.js'
import BcryptPasswordHash from "./security/BcryptPasswordHash.js";

import IUserRepository from "Domains/users/UserRepository.js";
import UserRepositoryPostgres from "./repository/UserRepositoryPostgres.js";

import IAuthenticationRepository from '../Domains/authentications/AuthenticationRepository.js'
import AuthenticationRepositoryPostgres from "./repository/AuthenticationsRepositoryPostgres.js";
import IAuthenticationTokenManager from '../Applications/security/AuthenticationTokenManager.js'
import JwtTokenManager from "./security/JwtTokenManager.js";


container.register<Pool>(Pool, { useValue: pool })
container.register<IIdGenerator>("IIdGenerator", { useValue: nanoId })
container.register<PasswordHash>('PasswordHash', { useClass: BcryptPasswordHash })
container.register<IRoleCheck>('IRoleCheck', { useClass: RoleCheckHelper })

container.register<IUserRepository>('IUserRepository', { useClass: UserRepositoryPostgres })
container.register<IAuthenticationRepository>(
  'AuthenticationRepository',
  {
    useClass: AuthenticationRepositoryPostgres
  }
)
container.register<IAuthenticationTokenManager>(
  'AuthenticationTokenManager',
  {
    useClass: JwtTokenManager
  }
)
container.register
export default container


