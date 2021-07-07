"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const register_1 = require("./extension/register");
function activate(context) {
    console.log('swagger-api-export is active');
    register_1.registerEvent();
    /* let disposable = vscode.commands.registerCommand('swagger-api-export.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from swagger-api export!')
    })
    context.subscriptions.push(disposable) */
    // window.createTreeView('serverView.list', {})
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map