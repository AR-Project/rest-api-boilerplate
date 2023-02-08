/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
export interface IRoleCheck {
  verifyKey: (keyInterface: any) => any
}

export default class RoleCheck implements IRoleCheck {
  verifyKey (key: any): any {
    throw new Error('LEVEL_CHECK.METHOD_NOT_IMPLEMENTED')
  }
}
