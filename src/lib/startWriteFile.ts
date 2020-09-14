import { ExtensionContext, window } from 'vscode'
import { TargetDataInfo } from '../bean/targetDataInfo'
import { WriteConfigFile } from './writeFile'
import { join } from 'path'
let filePath = join('/Users/liuhao/Documents/日常/learn', '写代码的地方', 'index.js')

export function startWriteFile(context: ExtensionContext, data: TargetDataInfo) {
    new WriteConfigFile(filePath,  JSON.stringify(data)).write(() => {
        window.showInformationMessage('ccc')
    })
}