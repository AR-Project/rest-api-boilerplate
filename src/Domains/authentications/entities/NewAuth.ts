interface newAuth {
  accessToken: string
  refreshToken: string
}

export default class NewAuth {
  accessToken: string
  refreshToken: string

  constructor (payload: newAuth) {
    this._verifyPayload(payload)

    this.accessToken = payload.accessToken
    this.refreshToken = payload.refreshToken
  }

  _verifyPayload (payload: newAuth): void {
    const { accessToken, refreshToken } = payload

    if (accessToken == null || refreshToken == null) {
      throw new Error('NEW_AUTH.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('NEW_AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}
