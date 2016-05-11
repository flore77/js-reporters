/* global describe, it */

describe('Suite with passing test', function () {
  it('should pass', function () {

  })
})

describe('Suite with skipped test', function () {
  it.skip('should skip', function () {

  })
})

describe('Suite with failing test', function () {
  it('should fail', function () {
    throw new Error('error')
  })
})

describe('Suite with tests', function () {
  it('should pass', function () {

  })

  it.skip('should skip', function () {

  })

  it('should fail', function () {
    throw new Error('error')
  })
})

describe('Outter suite', function () {
  describe('Inner suite', function () {
    it('nested test', function () {

    })
  })
})
