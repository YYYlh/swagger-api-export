const chalk = require('chalk')
const logSymbols = require('log-symbols')

module.exports = function() {
    globalThis.log = {
        success(text) {
            console.log(logSymbols['success'], chalk['green'](text))
        },
        error(text) {
            console.log(logSymbols['error'], chalk['red'](text))
        },
        warning(text) {
            console.log(logSymbols['warning'], chalk['yellow'](text))
        },
        info(text) {
            console.log(logSymbols['info'], chalk['blue'](text))
        }
    }
}