import { window, commands, ExtensionContext } from 'vscode'
import ServerModel from './serverModel'
import ServerProvider from './serverProvider'

const serverModel = new ServerModel()

// 注册事件
export function registerEvent(context: ExtensionContext, serverProvider: ServerProvider) {
    // 添加swagger服务地址
    const add = commands.registerCommand('swagger-api-export.add', async () => {
        const server = await window.showInputBox({placeHolder: '请输入正确的swagger服务地址'})
        if (!server) return
        serverModel.updateServerCfg(server, () => {
            serverProvider.refresh()
        })
    })
    // 删除swagger服务地址
    const remove = commands.registerCommand('swagger-api-export.remove', (server) => {

    })
    context.subscriptions.push(...[add, remove])
}