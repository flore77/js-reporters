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

        describe('Global test', function () {
          it('should have no parent suite', function () {
            expect(collectedData[1][1].suiteName).to.be
              .equal(refData[1][1].suiteName)
          })
        })
      })

      describe('Suite with only one passing test', function () {
        it('should be emitted on suiteStart event', function () {
          expect(collectedData[3][0]).to.be.equal('suiteStart')
        })

        it('should have a name', function () {
          expect(collectedData[3][1].suiteName).to.be
            .equal(refData[3][1].suiteName)
        })

        it('should have no other child suites', function () {
          expect(collectedData[3][1].childSuites).to.have
            .lengthOf(refData[3][1].childSuites.length)
        })

        it('should contain only one test', function () {
          expect(collectedData[3][1].tests).to.have
            .lengthOf(refData[3][1].tests.length)
        })

        describe('Test on start', function () {
          it('should have been emitted on testStart event', function () {
            expect(collectedData[4][0]).to.be.equal('testStart')
          })

          it('should have a name', function () {
            expect(collectedData[4][1].testName).to.be
              .equal(refData[4][1].testName)
          })

          it('should contain the name of the suite parent', function () {
            expect(collectedData[4][1].suiteName).to.be
              .equal(refData[4][1].suiteName)
          })

          it('should have only 2 props: testName and suiteName', function () {
            expect(collectedData[4][1]).to.have.all
              .keys(['testName', 'suiteName'])
          })
        })

        describe('Test on end', function () {
          it('should have been emitted on testEnd event', function () {
            expect(collectedData[5][0]).to.be.equal('testEnd')
          })

          it('should have the same name as on start', function () {
            expect(collectedData[5][1].testName).to.be
              .equal(refData[5][1].testName)
          })

          it('should contain the name of the suite parent', function () {
            expect(collectedData[5][1].suiteName).to.be
              .equal(refData[5][1].suiteName)
          })

          it('should contain status as passed', function () {
            expect(collectedData[5][1].status).to.be
              .equal(refData[5][1].status)
          })

          it('should contain its runtime', function () {
            expect(collectedData[5][1].runtime).to.be
              .closeTo(refData[5][1].runtime, 1)
          })

          it('should have no errors', function () {
            expect(collectedData[5][1].errors).to.be.deep
              .equal(refData[5][1].errors)
          })
        })
      })
    })
  })
})
