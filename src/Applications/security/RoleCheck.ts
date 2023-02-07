/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
export interface IRoleCheck {
  test: (keyInterface: string) => any
}

export default class RoleCheck implements IRoleCheck {
  test (key: string): any {
    throw new Error('LEVEL_CHECK.METHOD_NOT_IMPLEMENTED')
  }
}
