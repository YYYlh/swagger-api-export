import { ExtensionContext, window } from 'vscode'
import { TargetDataInfo } from '../bean/targetDataInfo'
import { WriteConfigFile, WriteRestUrlFile } from './writeFile'
import { join } from 'path'

let serverTitle = ''
export function startWriteFile(context: ExtensionContext, data: TargetDataInfo, writeFileDirPath: string) {
    
    if (data.title !== serverTitle) {
        serverTitle = data.title
    } else {
        new WriteRestUrlFile(join(writeFileDirPath, 'config.js'), [data.basePath, data.baseUrl]).write(() => {
            window.showInformationMessage(`config.js已写入${serverTitle}`)
        })
    }
}