import LevelCheck from '../../Applications/security/RoleCheck.js'

export default class LevelCheckConcrete extends LevelCheck {
  override verifyKey (key: any): string {
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN

    const isAdminRegisterEnabled = process.env.ADMIN_REGISTER === 'true'
    const isKeyMatchWithAdminToken = ADMIN_TOKEN === key

    if (key == null) return 'base'
  
    if ( isAdminRegisterEnabled && isKeyMatchWithAdminToken ) {
      return 'admin'
    }

    return 'base'
  }
}
