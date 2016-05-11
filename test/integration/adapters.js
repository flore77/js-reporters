/* eslint-env mocha */

var expect = require('chai').expect
var refData = require('./reference-data.js')
var runAdapters = require('./adapters-run.js')

// Collecting the adapter's output.
var collectedData

function _collectOutput (eventName, done, eventData) {
  collectedData.push([eventName, eventData])
  done()
}

// Attaches the event handler for the runner events.
function _attachListeners (done, runner) {
  var dummyFunc = function () {}

  runner.on('runStart', _collectOutput.bind(null, 'runStart', dummyFunc))
  runner.on('suiteStart', _collectOutput.bind(null, 'suiteStart', dummyFunc))
  runner.on('testStart', _collectOutput.bind(null, 'testStart', dummyFunc))
  runner.on('testEnd', _collectOutput.bind(null, 'testEnd', dummyFunc))
  runner.on('suiteEnd', _collectOutput.bind(null, 'suiteEnd', dummyFunc))

  // Only when the runEnd event is emitted we can notify Mocha that we are done.
  runner.on('runEnd', _collectOutput.bind(null, 'runEnd', done))
}

function _testTestOnStart (index) {
  it('should have been emitted on testStart event', function () {
    expect(collectedData[index][0]).to.be.equal('testStart')
  })

  it('should have a name', function () {
    expect(collectedData[index][1].testName).to.be
      .equal(refData[index][1].testName)
  })

  it('should contain the name of the parent suite', function () {
    expect(collectedData[index][1].suiteName).to.be
      .equal(refData[index][1].suiteName)
  })

  it('should have only 2 props: testName and suiteName', function () {
    expect(collectedData[index][1]).to.have.all
      .keys(['testName', 'suiteName'])
  })
}

function _testTestOnEnd (index, statusMsg, errorMsg) {
  it('should have been emitted on testEnd event', function () {
    expect(collectedData[index][0]).to.be.equal('testEnd')
  })

  it('should have the same name as on start', function () {
    expect(collectedData[index][1].testName).to.be
      .equal(refData[index][1].testName)
  })

  it('should contain the name of the suite parent', function () {
    expect(collectedData[index][1].suiteName).to.be
      .equal(refData[index][1].suiteName)
  })

  it('should contain status as ' + statusMsg, function () {
    expect(collectedData[index][1].status).to.be
      .equal(refData[index][1].status)
  })

  if (statusMsg === 'skipped') {
    it('should have no runtime', function () {
      expect(collectedData[index][1].runtime).to.be
        .equal(refData[index][1].runtime)
    })
  } else {
    it('should contain its runtime', function () {
      expect(collectedData[index][1].runtime).to.be
        .closeTo(refData[index][1].runtime, 1)
    })
  }

  it('should have ' + errorMsg, function () {
    expect(collectedData[index][1].errors).to.be.deep
      .equal(refData[index][1].errors)
  })
}

function _testSimpleSuite (index) {
  it('should have no other child suites', function () {
    expect(collectedData[index][1].childSuites).to.have
      .lengthOf(refData[index][1].childSuites.length)
  })

  it('should contain only one test', function () {
    expect(collectedData[index][1].tests).to.have
      .lengthOf(refData[index][1].tests.length)
  })
}

function _testComplexSuite (index) {
  it('should have no other child suites', function () {
    expect(collectedData[index][1].childSuites).to.have
      .lengthOf(refData[index][1].childSuites.length)
  })

  it('should contain only multiple tests', function () {
    expect(collectedData[index][1].tests).to.have
      .lengthOf(refData[index][1].tests.length)
  })
}

function _testNestedSuite (index) {
  it('should have one child suite', function () {
    expect(collectedData[index][1].childSuites).to.have
      .lengthOf(refData[index][1].childSuites.length)
  })

  it('should contain one test', function () {
    expect(collectedData[index][1].tests).to.have
      .lengthOf(refData[index][1].tests.length)
  })
}

/**
 * @param index {Integer}
 * @param type {Char} - Describing what type of suite is under testing.
 *
 * s - simple suite with only one test and no child suites.
 * c - complex suite with multiple tests and no child suites.
 * n - nested suite with one test and one child suite.
 */
function _testSuite (index, type) {
  it('should be emitted on suiteStart event', function () {
    expect(collectedData[index][0]).to.be.equal('suiteStart')
  })

  it('should have a name', function () {
    expect(collectedData[index][1].suiteName).to.be
      .equal(refData[index][1].suiteName)
  })

  switch (type) {
    case 's': {
      _testSimpleSuite(index)
      break
    }
    case 'c': {
      _testComplexSuite(index)
      break
    }
    case 'n': {
      _testNestedSuite(index)
      break
    }
  }
}

describe('Adapters integration', function () {
  Object.keys(runAdapters).forEach(function (adapter) {
    describe(adapter + ' adapter', function () {
      before(function (done) {
        collectedData = []
        runAdapters[adapter](_attachListeners.bind(null, done))
      })

      describe('Global suite', function () {
        it('should be emitted on runStart event', function () {
          expect(collectedData[0][0]).to.be.equal('runStart')
        })

        it('should have no name', function () {
          expect(collectedData[0][1].name).to.be.equal(refData[0][1].name)
        })

        it('should have all the other suites as childSuites', function () {
          expect(collectedData[0][1].childSuites).to.have
            .lengthOf(refData[0][1].childSuites.length)
        })

        it('should contain all the global tests', function () {
          expect(collectedData[0][1].tests).to.have
            .lengthOf(refData[0][1].tests.length)
        })

        describe('Global test on start', function () {
          _testTestOnStart(1)
        })

        describe('Global test on end', function () {
          _testTestOnEnd(2, 'passed', 'no errors')
        })
      })

      describe('Suite with only one passing test', function () {
        _testSuite(3, 's')

        describe('Passing test on start', function () {
          _testTestOnStart(4)
        })

        describe('Passing test on end', function () {
          _testTestOnEnd(5, 'passed', 'no errors')
        })
      })

      describe('Suite with only one skipped test', function () {
        _testSuite(7, 's')

        describe('Skipped test on start', function () {
          _testTestOnStart(8)
        })

        describe('Skipped test on end', function () {
          _testTestOnEnd(9, 'skipped', 'no errors')
        })
      })

      describe('Suite with only one failing test', function () {
        _testSimpleSuite(11, 's')

        describe('Failing test on start', function () {
          _testTestOnStart(12)
        })

        describe('Failing test on end', function () {
          _testTestOnEnd(13, 'failing', 'errors')
        })
      })

      describe('Suite with multiple tests', function () {
        _testSuite(15, 'c')

        describe('Passing test on start', function () {
          _testTestOnStart(16)
        })

        describe('Passing test on end', function () {
          _testTestOnEnd(17, 'passing', 'no errors')
        })

        describe('Skipped test on start', function () {
          _testTestOnStart(18)
        })

        describe('Skipped test on end', function () {
          _testTestOnEnd(19, 'skipped', 'no errors')
        })

        describe('Failing test on start', function () {
          _testTestOnStart(20)
        })

        describe('Failing test on end', function () {
          _testTestOnEnd(21, 'failing', 'errors')
        })
      })

      describe('Nested suites', function () {
        describe('Outter suite', function () {
          _testSuite(23, 'n')

          describe('Outter test on start', function () {
            _testTestOnStart(24)
          })

          describe('Outter test on end', function () {
            _testTestOnEnd(25, 'passing', 'no errors')
          })
        })

        describe('Inner suite', function () {
          _testSuite(26, 's')

          describe('Inner test on start', function () {
            _testTestOnStart(27)
          })

          describe('Inner test on end', function () {
            _testTestOnEnd(28, 'passing', 'no errors')
          })
        })
      })
    })
  })
})
