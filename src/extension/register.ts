import { window, commands } from 'vscode'

// 注册事件
export function registerEvent() {
    // 添加swagger服务地址
    commands.registerCommand('swagger-api-export.add', async () => {
        const server = await window.showInputBox({placeHolder: '请输入正确的swagger服务地址'})
        if (!server) return
    })
}