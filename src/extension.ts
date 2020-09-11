import { ExtensionContext, window } from 'vscode';
import { registerEvent } from './extension/register'
import ServerProvider from './extension/serverProvider'
import ServerModel from './extension/serverModel'

const serverProvider = new ServerProvider(new ServerModel())

export function activate(context: ExtensionContext) {
	console.log('swagger-api-export is active')
	
	registerEvent(context, serverProvider)
	window.createTreeView('serverView.list', {
		treeDataProvider: serverProvider
	})
	serverProvider.refresh()
	
}

export function deactivate() {}
