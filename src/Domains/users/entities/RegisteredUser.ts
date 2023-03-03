export interface IRegisteredUser {
  id: string
  username: string
  fullname: string
  role: string
}

interface IRegisteredUserEntities extends IRegisteredUser {
  _verifyPayload(payload: IRegisteredUser): void
}

export default class RegisteredUser implements IRegisteredUserEntities {
  id: string
  username: string
  fullname: string
  role: string

  constructor(payload: IRegisteredUser) {
    this._verifyPayload(payload)

    const { id, username, fullname, role } = payload

    this.id = id
    this.username = username
    this.fullname = fullname
    this.role = role
  }

  _verifyPayload({ id, username, fullname, role }: IRegisteredUser): void {
    if (id == null || username == null || fullname == null || role == null) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof fullname !== 'string' ||
      typeof role !== 'string'
    ) {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
