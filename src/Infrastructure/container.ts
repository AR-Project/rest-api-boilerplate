import { container, delay } from "tsyringe";

import { Pool } from "pg";
import pool from "./database/postgres/pool.js";

import type IIdGenerator from "../Applications/tools/IdGenerator.js";
import nanoId from './externalModule/nanoId.js'

container.register<Pool>(Pool, { useValue: pool })
container.register<IIdGenerator>("IIdGenerator", { useValue: nanoId })

export default container


