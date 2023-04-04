export interface IUserCoreInfo {
  id: string
  role: string
}
export default class UserCoreInfo {
  id: string
  role: string

  constructor(payload: IUserCoreInfo) {
    this._verifyPayload(payload)
    const { id, role } = payload

    this.id = id
    this.role = role

  }

  _verifyPayload(payload: IUserCoreInfo): void {
    const { id, role } = payload

    if (id == null || role == null) {
      throw new Error('USER_CORE_INFO.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof id !== 'string' || typeof role !== 'string') {
      throw new Error('USER_CORE_INFO.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }

  }
}
