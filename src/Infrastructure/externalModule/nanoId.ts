import IdGeneratorHelper from "../../Applications/tools/IdGenerator.js";
import { nanoid } from "nanoid";

class NanoId extends IdGeneratorHelper {
  override generate(): string {
    return nanoid()
  }
}

const singleton = new NanoId()

Object.freeze(singleton)

export default singleton;