var JsReporters = require('../../dist/js-reporters.js')
var Suite = JsReporters.Suite
var Test = JsReporters.Test

var passingTest1 = new Test('should pass', 'Suite with passing test', 'passed',
    0, [])
var passingTest2 = new Test('should pass', 'Suite with tests', 'passed',
    0, [])

var skippedTest1 = new Test('should fail', 'Suite with skipped test', 'skipped',
    0, [])
var skippedTest2 = new Test('should fail', 'Suite with tests', 'skipped',
    0, [])

var failingTest1 = new Test('should fail', 'Suite with failing test', 'failed',
    0, [])
var failingTest2 = new Test('should fail', 'Suite with tests', 'failed',
    0, [])

var passingSuite = new Suite('Suite with passing test', [], [passingTest1])
var skippedSuite = new Suite('Suite with skipped test', [], [skippedTest1])
var failingSuite = new Suite('Suite with failing test', [], [failingTest1])

var testSuite = new Suite('Suite with tests', [], [
  passingTest2,
  skippedTest2,
  failingTest2
])

var innerSuite = new Suite('Inner suite', [], [])
var outterSuite = new Suite('Outter suite', [innerSuite], [])

var globalSuite = new Suite(undefined, [
  passingSuite,
  skippedSuite,
  failingSuite,
  testSuite,
  outterSuite
])

module.exports = [
  ['runStart', globalSuite],
  ['suiteStart', passingSuite],
  ['testStart', passingTest1],
  ['testEnd', passingTest1],
  ['suiteEnd', passingSuite],
  ['suiteStart', skippedSuite],
  ['testStart', skippedTest1],
  ['testEnd', skippedTest1],
  ['suiteEnd', skippedSuite],
  ['suiteStart', failingSuite],
  ['testStart', failingTest1],
  ['testEnd', failingTest1],
  ['suiteEnd', failingSuite],
  ['suiteStart', testSuite],
  ['testStart', passingTest2],
  ['testEnd', passingTest2],
  ['testStart', skippedTest2],
  ['testEnd', skippedTest2],
  ['testStart', failingTest2],
  ['testEnd', failingTest2],
  ['suiteEnd', testSuite],
  ['suiteStart', outterSuite],
  ['suiteStart', innerSuite],
  ['suiteEnd', innerSuite],
  ['outterSuite', outterSuite],
  ['runEnd', globalSuite]
]
