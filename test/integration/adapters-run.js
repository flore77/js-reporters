// var Jasmine = require('jasmine')
// var QUnit = require('qunitjs')
var Mocha = require('mocha')
var JsReporters = require('../../dist/js-reporters.js')
var path = require('path')

var testDir = path.join(__dirname, '..')
// var testFile = 'tests.js'

/**
 * Exports a function for each adapter that will run against a default
 * test fixture.
 */
module.exports = {
 /* Jasmine: function (attachListeners) {
    var jasmine = new Jasmine()
    var jasmineRunner

    jasmine.loadConfig({
      spec_dir: 'test/jasmine',
      spec_files: [testFile]
    })

    jasmineRunner = new JsReporters.JasmineAdapter(jasmine.env)
    jasmine.addReporter({})

    attachListeners(jasmineRunner)

    jasmine.execute()
  },

  QUnit: function (attachListeners) {
    var qunitRunner = new JsReporters.QUnitAdapter(QUnit)

    attachListeners(qunitRunner)

    QUnit.config.autorun = false

    require(path.join(testDir, 'qunit', testFile))

    QUnit.load()
  },*/

  Mocha: function (attachListeners) {
    var mocha = new Mocha()
    var mochaRunner

    mocha.addFile(path.join(testDir, 'fixtures', 'mocha.js'))

    mochaRunner = new JsReporters.MochaAdapter(mocha)

    attachListeners(mochaRunner)

    mocha.run()
  }
}
