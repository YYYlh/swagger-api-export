import { TreeItem, TreeItemCollapsibleState} from 'vscode'

export default class ServerTreeItem extends TreeItem {
    constructor(name: string) {
        super('', TreeItemCollapsibleState.None)
        this.label = name
        this.command = {
            title: name,
            command: 'swagger-api-export.remove',
            arguments: [
                name
            ]
        }
    }
}