import { ExtensionContext, window } from 'vscode'
import { TargetDataInfo } from '../bean/targetDataInfo'
import { WriteConfigFile, WriteRestUrlFile } from './writeFile'
import { join } from 'path'
import { hump } from '../utils'

let serverTitle = ''
export function startWriteFile(context: ExtensionContext, data: TargetDataInfo, writeFileDirPath: string) {
    const { key, baseUrl, apis } = data
    if (data.title !== serverTitle) {
        serverTitle = data.title
        new WriteConfigFile(join(writeFileDirPath, 'config.js'), [key, baseUrl]).write(() => {
            window.showInformationMessage(`${serverTitle}已写入config.js`)
        })
    }
    new WriteRestUrlFile(join(writeFileDirPath, `${key}.js`), [key, apis]).write(() => {})
}