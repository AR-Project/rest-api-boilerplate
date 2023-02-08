import IdGeneratorHelper from "../../Applications/tools/IdGenerator.js";
import { nanoid } from "nanoid";

class NanoIdInfrastructure extends IdGeneratorHelper {
  override generate(): string {
    return nanoid()
  }
}

const singleton = new NanoIdInfrastructure()

Object.freeze(singleton)

export default singleton;