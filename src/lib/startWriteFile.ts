import { ExtensionContext, window } from 'vscode'
import { TargetDataInfo } from '../bean/targetDataInfo'
import { WriteConfigFile, WriteRestUrlFile } from './writeFile'
import { join } from 'path'
import { hump } from '../utils'

let serverTitle = ''
export function startWriteFile(context: ExtensionContext, data: TargetDataInfo, writeFileDirPath: string) {
    let key = hump(data.basePath, '-') // 当做文件名和导出的变量名使用
    if (data.title !== serverTitle) {
        serverTitle = data.title
        new WriteConfigFile(join(writeFileDirPath, 'config.js'), [key, data.baseUrl]).write(() => {
            window.showInformationMessage(`config.js已写入${serverTitle}`)
        })
    }
    new WriteRestUrlFile(join(writeFileDirPath, `${key}.js`), [key, data.apis]).write(() => {})
}