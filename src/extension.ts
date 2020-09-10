import { ExtensionContext } from 'vscode';
import { registerEvent } from './extension/register'

export function activate(context: ExtensionContext) {
	console.log('swagger-api-export is active')
	registerEvent()
	/* let disposable = vscode.commands.registerCommand('swagger-api-export.helloWorld', () => { 
		vscode.window.showInformationMessage('Hello World from swagger-api export!')
	})
	context.subscriptions.push(disposable) */
	// window.createTreeView('serverView.list', {})
}

export function deactivate() {}
