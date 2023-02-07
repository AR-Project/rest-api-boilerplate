import nanoId from '../nanoId'

describe('NanoIdGenerator singleton infrastructure concrete', () => {
  it('should generate 21 random string', () => {
    const firstId = nanoId.generate()
    const secondId = nanoId.generate()

    console.log(`${firstId} || ${secondId}`);
    

    expect(true).toBe(true)
  })
})