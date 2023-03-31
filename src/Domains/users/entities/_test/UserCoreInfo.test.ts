import UserCoreInfo from "../UserCoreInfo.js";

describe('UserCoreInfo entities', () => {
  it('should throw error when Payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'user-123',
    }

    // @ts-expect-error testing threw error
    expect(() => new UserCoreInfo(payload)).toThrowError('USER_CORE_INFO.NOT_CONTAIN_NEEDED_PROPERTY')
  })
  it('should throw error when Payload data type is not string', () => {
    // Arrange
    const payload = {
      id: { 0: 'user-123' },
      role: ['base']
    }

    // @ts-expect-error testing threw error
    expect(() => new UserCoreInfo(payload)).toThrowError('USER_CORE_INFO.NOT_MEET_DATA_TYPE_SPECIFICATION')
  })
})
