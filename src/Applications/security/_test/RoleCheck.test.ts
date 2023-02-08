import LevelCheck from '../RoleCheck.js'

describe('LevelCheck interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const levelCheck = new LevelCheck()

    expect(() =>  levelCheck.verifyKey('secretKey') ).toThrow('LEVEL_CHECK.METHOD_NOT_IMPLEMENTED')
  })
})
