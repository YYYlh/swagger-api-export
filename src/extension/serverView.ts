import { ViewColumn, Uri, ExtensionContext } from 'vscode'
import ReusedWebviewPanel from './ReusedWebviewPanel'
import { TargetDataInfo } from '../bean/targetDataInfo'
import { join } from 'path'
import { readFileSync } from 'fs'
import { startWriteFile } from '../lib/startWriteFile'

function serverView(context: ExtensionContext, server: string, data: TargetDataInfo, writeFileDirPath: string) {
    const viewPath = context.asAbsolutePath(join('resources', 'index.html'));
    const panel = ReusedWebviewPanel.create(
        'serverView',
        server,
        ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    )

    const dataDom = `<div id="data">${JSON.stringify(data)}</div>`
    const html = readFileSync(viewPath).toString().replace('$data', dataDom)
    panel.webview.html = html

    panel.webview.onDidReceiveMessage(
        ({ command, data }) => {
            switch (command) {
                case 'postExportData':
                    startWriteFile(context, data, writeFileDirPath)
                break
            }
        },
        undefined,
        context.subscriptions
    );
}

export default serverView
