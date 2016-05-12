var JsReporters = require('../../dist/js-reporters.js')
var Suite = JsReporters.Suite
var Test = JsReporters.Test

var globalTest = new Test('global test', undefined, 'passed', 0, [])

var passingTest1 = new Test('should pass', 'Suite with passing test', 'passed',
    0, [])
var passingTest2 = new Test('should pass', 'Suite with tests', 'passed',
    0, [])

var skippedTest1 = new Test('should skip', 'Suite with skipped test', 'skipped',
    undefined, [])
var skippedTest2 = new Test('should skip', 'Suite with tests', 'skipped',
    undefined, [])

var failingTest1 = new Test('should fail', 'Suite with failing test', 'failed',
    0, [new Error('error')])
var failingTest2 = new Test('should fail', 'Suite with tests', 'failed',
    0, [new Error('error')])

var innerTest = new Test('inner test', 'Inner suite', 'passed', 0, [])
var outterTest = new Test('outter test', 'Outter suite', 'passed', 0, [])

var passingSuite = new Suite('Suite with passing test', [], [passingTest1])
var skippedSuite = new Suite('Suite with skipped test', [], [skippedTest1])
var failingSuite = new Suite('Suite with failing test', [], [failingTest1])

var testSuite = new Suite('Suite with tests', [], [
  passingTest2,
  skippedTest2,
  failingTest2
])

var innerSuite = new Suite('Inner suite', [], [innerTest])
var outterSuite = new Suite('Outter suite', [innerSuite], [outterTest])

var globalSuite = new Suite(undefined, [
  passingSuite,
  skippedSuite,
  failingSuite,
  testSuite,
  outterSuite
], [globalTest])

module.exports = [
  ['runStart', globalSuite, 'Global suite starts'],
  ['testStart', globalTest, 'Global test starts'],
  ['testEnd', globalTest, 'Global test ends'],
  ['suiteStart', passingSuite, 'Suite with one passing test starts'],
  ['testStart', passingTest1, 'Passing test starts'],
  ['testEnd', passingTest1, 'Passing test ends'],
  ['suiteEnd', passingSuite, 'Suite with one passing test ends'],
  ['suiteStart', skippedSuite, 'Suite with one skipped test starts'],
  ['testStart', skippedTest1, 'Skipped test starts'],
  ['testEnd', skippedTest1, 'Skipped test ends'],
  ['suiteEnd', skippedSuite, 'Suite with one skipped test ends'],
  ['suiteStart', failingSuite, 'Suite with one failing tests'],
  ['testStart', failingTest1, 'Failing test starts'],
  ['testEnd', failingTest1, 'Failing test ends'],
  ['suiteEnd', failingSuite, 'Suite with one failing test ends'],
  ['suiteStart', testSuite, 'Suite with multiple tests starts'],
  ['testStart', passingTest2, 'Passing test starts'],
  ['testEnd', passingTest2, 'Passing test ends'],
  ['testStart', skippedTest2, 'Skipped test starts'],
  ['testEnd', skippedTest2, 'Skipped test ends'],
  ['testStart', failingTest2, 'Failing test starts'],
  ['testEnd', failingTest2, 'Failing test ends'],
  ['suiteEnd', testSuite, 'Suite with multiple tests ends'],
  ['suiteStart', outterSuite, 'Outter suite starts'],
  ['testStart', outterTest, 'Outter test starts'],
  ['testEnd', outterTest, 'Outter test ends'],
  ['suiteStart', innerSuite, 'Inner suite starts'],
  ['testStart', innerTest, 'Inner test starts'],
  ['testEnd', innerTest, 'Inner test ends'],
  ['suiteEnd', innerSuite, 'Inner suite ends'],
  ['suiteEnd', outterSuite, 'Outter suite ends'],
  ['runEnd', globalSuite, 'Global suite ends']
]
