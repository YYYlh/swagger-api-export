import { Event, EventEmitter, TreeDataProvider, TreeItem } from 'vscode'
import ServerTreeItem from './serverTreeItem'
import ServerModel from './serverModel'

export default class ServerProvider implements TreeDataProvider<ServerTreeItem> {

    private model: ServerModel
    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>()
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

    constructor(serverModel: ServerModel) {
        this.model = serverModel
    }

    refresh(): any {
        this._onDidChangeTreeData.fire(undefined);
    }
    
    getTreeItem(element: ServerTreeItem): TreeItem | Thenable<TreeItem> {
        return element
    }

    getChildren(): ServerTreeItem[] {
        const servers: string[] = this.model.getCfg() || []
        return servers.map(item => new ServerTreeItem(item))
    }
}