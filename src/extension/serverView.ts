import { ViewColumn, Uri, ExtensionContext, window } from 'vscode'
import ReusedWebviewPanel from './ReusedWebviewPanel'
import { TargetDataInfo } from '../bean/targetDataInfo'
import { join } from 'path'
import { readFileSync } from 'fs'

function serverView(context: ExtensionContext, server: string, data: TargetDataInfo) {
    const viewPath = join(context.extensionPath, 'src', 'webView')
    const panel = ReusedWebviewPanel.create(
        'serverView',
        server,
        ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [Uri.file(viewPath)]
        }
    )

    const dataDom = `<div id="data">${JSON.stringify(data)}</div>`
    const html = readFileSync(join(viewPath, 'index.html')).toString().replace('$data', dataDom)
    panel.webview.html = html

    panel.webview.onDidReceiveMessage(
        message => {
            console.log(message);
        },
        undefined,
        context.subscriptions
    );
}

export default serverView
