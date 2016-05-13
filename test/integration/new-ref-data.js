var JsReporters = require('../../dist/js-reporters.js')
var Suite = JsReporters.Suite
var Test = JsReporters.Test

var globalTestStart = new Test('global test', undefined, undefined, undefined,
    undefined)
var globalTestEnd = new Test('global test', undefined, 'passed', 0, [])


var passingTestStart1 = new Test('should pass', 'Suite with passing test',
    undefined, undefined, undefined)
var passingTestEnd1 = new Test('should pass', 'Suite with passing test',
    'passed', 0, [])

var passingTestStart2 = new Test('should pass', 'Suite with tests',
    undefined, undefined, undefined)
var passingTestEnd2 = new Test('should pass', 'Suite with tests', 'passed',
    0, [])


var skippedTestStart1 = new Test('should skip', 'Suite with skipped test',
    undefined, undefined, undefined)
var skippedTestEnd1 = new Test('should skip', 'Suite with skipped test',
    'skipped', undefined, [])


var skippedTestStart2 = new Test('should skip', 'Suite with tests',
    undefined, undefined, undefined)
var skippedTestEnd2 = new Test('should skip', 'Suite with tests', 'skipped',
    undefined, [])


var failingTestStart1 = new Test('should fail', 'Suite with failing test',
    undefined, undefined, undefined)
var failingTestEnd1 = new Test('should fail', 'Suite with failing test', 'failed',
    0, [new Error('error')])



var failingTestStart2 = new Test('should fail', 'Suite with tests',
    undefined, undefined, undefined)
var failingTestEnd2 = new Test('should fail', 'Suite with tests', 'failed',
    0, [new Error('error')])


var innerTestStart = new Test('inner test', 'Inner suite',
    undefined, undefined, undefined)
var innerTestEnd = new Test('inner test', 'Inner suite', 'passed', 0, [])

var outterTestStart = new Test('outter test', 'Outter suite',
    undefined, undefined, undefined)
var outterTestEnd = new Test('outter test', 'Outter suite', 'passed', 0, [])

var passingSuite = new Suite('Suite with passing test', [], [passingTestStart1])
var skippedSuite = new Suite('Suite with skipped test', [], [skippedTestStart1])
var failingSuite = new Suite('Suite with failing test', [], [failingTestStart1])

var testSuite = new Suite('Suite with tests', [], [
  passingTestStart2,
  skippedTestStart2,
  failingTestStart2
])

var innerSuite = new Suite('Inner suite', [], [innerTestStart])
var outterSuite = new Suite('Outter suite', [innerSuite], [outterTestStart])

var globalSuite = new Suite(undefined, [
  passingSuite,
  skippedSuite,
  failingSuite,
  testSuite,
  outterSuite
], [globalTestStart])

module.exports = [
  ['runStart', globalSuite, 'Global suite starts'],
  ['testStart', globalTestStart, 'Global test starts'],
  ['testEnd', globalTestEnd, 'Global test ends'],
  ['suiteStart', passingSuite, 'Suite with one passing test starts'],
  ['testStart', passingTestStart1, 'Passing test starts'],
  ['testEnd', passingTestEnd1, 'Passing test ends'],
  ['suiteEnd', passingSuite, 'Suite with one passing test ends'],
  ['suiteStart', skippedSuite, 'Suite with one skipped test starts'],
  ['testStart', skippedTestStart1, 'Skipped test starts'],
  ['testEnd', skippedTestEnd1, 'Skipped test ends'],
  ['suiteEnd', skippedSuite, 'Suite with one skipped test ends'],
  ['suiteStart', failingSuite, 'Suite with one failing tests'],
  ['testStart', failingTestStart1, 'Failing test starts'],
  ['testEnd', failingTestEnd1, 'Failing test ends'],
  ['suiteEnd', failingSuite, 'Suite with one failing test ends'],
  ['suiteStart', testSuite, 'Suite with multiple tests starts'],
  ['testStart', passingTestStart2, 'Passing test starts'],
  ['testEnd', passingTestEnd2, 'Passing test ends'],
  ['testStart', skippedTestStart2, 'Skipped test starts'],
  ['testEnd', skippedTestEnd2, 'Skipped test ends'],
  ['testStart', failingTestStart2, 'Failing test starts'],
  ['testEnd', failingTestEnd2, 'Failing test ends'],
  ['suiteEnd', testSuite, 'Suite with multiple tests ends'],
  ['suiteStart', outterSuite, 'Outter suite starts'],
  ['testStart', outterTestStart, 'Outter test starts'],
  ['testEnd', outterTestEnd, 'Outter test ends'],
  ['suiteStart', innerSuite, 'Inner suite starts'],
  ['testStart', innerTestStart, 'Inner test starts'],
  ['testEnd', innerTestEnd, 'Inner test ends'],
  ['suiteEnd', innerSuite, 'Inner suite ends'],
  ['suiteEnd', outterSuite, 'Outter suite ends'],
  ['runEnd', globalSuite, 'Global suite ends']
]
