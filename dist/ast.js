const escodegen = require('escodegen')
const esprima = require('esprima')
const estraverse = require('estraverse')

module.exports = class Ast {
    traverse() {
        return estraverse.traverse
    }
    parseModule(str) {
        return esprima.parseModule(str)
    }
    generate(program) {
        return escodegen.generate(program)
    }
}