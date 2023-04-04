import nanoId from '../nanoId'

describe('NanoIdGenerator singleton infrastructure concrete', () => {
  it('should generate 21 random string', () => {
    const firstId = nanoId.generate()
    const secondId = nanoId.generate()

    expect(firstId).not.toBe(secondId)
    expect(typeof firstId).toBe('string')
    expect(typeof secondId).toBe('string')
  })
})
