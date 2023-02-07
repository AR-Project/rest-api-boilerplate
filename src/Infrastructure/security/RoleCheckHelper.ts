import LevelCheck from '../../Applications/security/RoleCheck.js'

export default class LevelCheckConcrete extends LevelCheck {
  _key: string

  constructor () {
    super()
    this._key = process.env.ADMIN_TOKEN as string
  }

  override test (secretCode: string): string {
    if (secretCode === this._key) {
      return 'admin'
    } else {
      return 'base'
    }
  }
}
