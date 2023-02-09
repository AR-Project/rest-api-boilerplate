import LevelCheckHelper from '../RoleCheckHelper.js'

describe('Level Check Helper', () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
  })

  afterEach(() => {
    process.env = env
  })

  describe('test function', () => {
    it('should return "admin" as string when payload is match with ADMIN_KEY and ADMIN_REGISTER is true', () => {
      // Arrange
      process.env.ADMIN_TOKEN = 'isAdmin'
      process.env.ADMIN_REGISTER = 'true'
      const levelCheckHelper = new LevelCheckHelper()

      const expectedResult = 'admin'

      // Action
      const result = levelCheckHelper.verifyKey('isAdmin')

      // Assert
      expect(result).toBe(expectedResult)
    })
    it('should return false when payload is not match with ADMIN_KEY env', () => {
      // Arrange
      process.env.ADMIN_TOKEN = 'isAdmin'
      process.env.ADMIN_REGISTER = 'true'
      const levelCheckHelper = new LevelCheckHelper()

      const expectedResult = 'base'

      // Action
      const result = levelCheckHelper.verifyKey('notAdmin')

      // Assert
      expect(result).toBe(expectedResult)
    })
    it('should return false when ADMIN_REGISTRATION is false', () => {
      // Arrange
      process.env.ADMIN_TOKEN = 'isAdmin'
      process.env.ADMIN_REGISTER = 'false'
      const levelCheckHelper = new LevelCheckHelper()

      const expectedResult = 'base'

      // Action
      const result = levelCheckHelper.verifyKey('isAdmin')

      // Assert
      expect(result).toBe(expectedResult)
    })
    it('should return false when key is undefined', () => {
      // Arrange
      process.env.ADMIN_TOKEN = 'isAdmin'
      process.env.ADMIN_REGISTER = 'false'
      const levelCheckHelper = new LevelCheckHelper()

      const expectedResult = 'base'

      // Action
      const result = levelCheckHelper.verifyKey(null)

      // Assert
      expect(result).toBe(expectedResult)
    })
  })
})
