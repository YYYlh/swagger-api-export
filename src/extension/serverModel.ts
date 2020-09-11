import { workspace, window } from 'vscode'

class BaseModel {
    private key: string = 'swagger-api-export.servers'

    getCfg(): any {
        const config = workspace.getConfiguration()
        return config.get(this.key)
    }

    protected updateCfg(server: string) {
        const config = workspace.getConfiguration()
        const defaultCfg: string[] = []
        const sourceCfg = config.get(this.key, defaultCfg)
        if (!sourceCfg.includes(server)) {
            sourceCfg.push(server)
        }
        return config.update(this.key, sourceCfg)
    }

}

export default class ServerModel extends BaseModel {
    constructor() {
        super()
    }

    updateServerCfg(value: string, cb?: Function) {
        this.updateCfg(value).then(() => {
            cb && cb()
            window.showInformationMessage(`${value}已成功添加`)
        })
    }
}