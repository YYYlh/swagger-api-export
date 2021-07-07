import { window, commands, ExtensionContext, env, Uri } from 'vscode'
import ServerModel from './serverModel'
import ServerProvider from './serverProvider'
import TargetData from '../lib/targetData'
import { TargetDataInfo } from '../bean/targetDataInfo'
import serverView from './serverView'

const serverModel = new ServerModel()
// 注册事件
export function registerEvent(context: ExtensionContext, serverProvider: ServerProvider) {
    let activeServer = ''
    let writeFileDirPath = ''
    // 添加swagger服务地址
    const add = commands.registerCommand('swagger-api-export.add', async () => {
        const server = await window.showInputBox({placeHolder: '请输入正确的swagger服务地址'})
        if (!server) return
        serverModel.updateServerCfg(server, () => {
            serverProvider.refresh()
        })
    })
    // 删除swagger服务地址
    const remove = commands.registerCommand('swagger-api-export.remove', ({label}) => {
        serverModel.removeServerCfg(label, () => {
            serverProvider.refresh()
        })
    })
    // 请求点击的服务地址
    const fetch = commands.registerCommand('swagger-api-export.fetch', async (server) => {
        if (!writeFileDirPath) {
            let folderUris = await window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true
            })
            if (!folderUris) {
                return
            }
            writeFileDirPath = folderUris[0].fsPath
        }
        const targetData: TargetDataInfo = await new TargetData(server).getData(writeFileDirPath)
        if (activeServer === server) {
            return
        } else {
            activeServer = server
        }
        serverView(context ,server, targetData, writeFileDirPath)
    })
    // 打开swagger服务地址
    const open = commands.registerCommand('swagger-api-export.open', ({label}) => {
        const url = Uri.parse(`${label}/swagger-ui.html`)
        env.openExternal(url)
    })
    context.subscriptions.push(...[add, remove, fetch, open])
}