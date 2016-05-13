import EventEmitter from 'events'
import {Test, Suite} from '../Data.js'

export default class MochaAdapter extends EventEmitter {
  constructor (mocha) {
    super()

    this.mocha = mocha
    this.idDataMap = {}
    this.errors = []
    this.index = 0

    mocha.reporter((runner) => {
      this.runner = runner
      runner.on('start', this.onStart.bind(this))
      runner.on('suite', this.onSuite.bind(this))
      runner.on('test', this.onTest.bind(this))
      runner.on('fail', this.onFail.bind(this))
      runner.on('test end', this.onTestEnd.bind(this))
      runner.on('suite end', this.onSuiteEnd.bind(this))
      runner.on('end', this.onEnd.bind(this))
    })
  }

  convertSuite (mochaSuite) {
    var name = mochaSuite.title
    var childSuites = []
    var tests = []

    mochaSuite.index = this.index
    this.index++

    for (let child of mochaSuite.suites) {
      childSuites.push(this.convertSuite(child))
    }

    for (let child of mochaSuite.tests) {
      tests.push(this.convertTest(child))
    }

    var suite = new Suite(name, childSuites, tests)

    this.idDataMap[mochaSuite.index] = suite
    return suite
  }

  convertTest (mochaTest) {
    var testName = mochaTest.title
    var parent = mochaTest.parent
    var suiteName

    mochaTest.index = this.index
    this.index++

    while (parent.title !== '') {
      if (suiteName === undefined) {
        suiteName = parent.title
      } else {
        suiteName = parent.title + ' ' + suiteName
      }

      parent = parent.parent
    }

    var test = new Test(testName, suiteName)

    this.idDataMap[mochaTest.index] = test
    return test
  }

  onStart () {
    var startSuite = this.convertSuite(this.runner.suite)
    startSuite.name = undefined
    this.idDataMap.globalSuite = startSuite

    this.emit('runStart', startSuite)
  }

  onSuite (mochaSuite) {
    if (!mochaSuite.root) {
      this.emit('suiteStart', this.idDataMap[mochaSuite.index])
    }
  }

  onTest (mochaTest) {
    this.errors = []
    this.emit('testStart', this.idDataMap[mochaTest.index])
  }

  onFail (mochaTest, error) {
    this.errors.push(error)
  }

  onTestEnd (mochaTest) {
    var test = this.idDataMap[mochaTest.index]

    if (mochaTest.pending) {
      this.emit('testStart', test)
      test.status = 'skipped'
    } else {
      test.status = mochaTest.state
    }

    test.runtime = mochaTest.duration
    test.errors = this.errors

    this.emit('testEnd', test)
  }

  onSuiteEnd (mochaSuite) {
    if (!mochaSuite.root) {
      this.emit('suiteEnd', this.idDataMap[mochaSuite.index])
    }
  }

  onEnd () {
    this.emit('runEnd', this.idDataMap.globalSuite)
  }
}
