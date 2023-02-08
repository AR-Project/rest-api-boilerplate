import LevelCheck from '../../Applications/security/RoleCheck.js'

export default class LevelCheckConcrete extends LevelCheck {
  override verifyKey (secretCode: any): boolean {
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN
    if (secretCode == null) {
      return false
    }
  
    if (
      process.env.ADMIN_REGISTER === 'true' && 
      ADMIN_TOKEN === secretCode
    ) {
      return true
    }

    return false
  }
}
