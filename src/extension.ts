import { ExtensionContext, window } from 'vscode';
import { registerEvent } from './extension/register'
import ServerProvider from './extension/serverProvider'
import ServerModel from './extension/serverModel'

export function activate(context: ExtensionContext) {
	console.log('swagger-api-export is active')
	const serverProvider = new ServerProvider(context, new ServerModel())
	registerEvent(context, serverProvider)
	window.createTreeView('serverView.list', {
		treeDataProvider: serverProvider
	})
}

export function deactivate() {}
