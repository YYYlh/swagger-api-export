import { TreeItem, TreeItemCollapsibleState, ExtensionContext} from 'vscode'
import {join} from 'path'

export default class ServerTreeItem extends TreeItem {
    constructor(context: ExtensionContext, name: string) {
        super('', TreeItemCollapsibleState.None)
        this.label = name
        this.iconPath = context.asAbsolutePath(join('resources', `item.svg`));
        this.command = {
            title: name,
            command: 'swagger-api-export.fetch',
            arguments: [
                name
            ]
        }
    }
}