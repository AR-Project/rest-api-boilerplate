export interface IRegisterUser {
  username: string
  password: string
  fullname: string
  role: string
}

export default class RegisterUser {
  username: string
  password: string
  fullname: string
  role: string

  constructor (payload: IRegisterUser) {
    this._verifyPayload(payload)

    const { username, password, fullname, role }: IRegisterUser = payload

    this.username = username
    this.password = password
    this.fullname = fullname
    this.role = role
  }

  private _verifyPayload ({ username, password, fullname, role }: IRegisterUser): void {
    if (username == null || password == null || fullname == null) {
      throw new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof fullname !== 'string' ||
      typeof role !== 'string'
    ) {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

  
    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')
    }

    if (username.match(/^[\w]+$/) == null) {
      throw new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
    }
  }
}
