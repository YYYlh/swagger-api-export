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
        return config.update(this.key, sourceCfg, true)
    }

    protected removeCfg(server: string) {
        const config = workspace.getConfiguration()
        const defaultCfg: string[] = []
        const sourceCfg = config.get(this.key, defaultCfg)
        const newCfg = sourceCfg.filter(item => item !== server)
        return config.update(this.key, newCfg, true)
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

    removeServerCfg(value: string, cb?: Function) {
        this.removeCfg(value).then(() => {
            cb && cb()
            window.showInformationMessage(`${value}已删除`)
        })
    }
}