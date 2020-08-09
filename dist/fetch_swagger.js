const FormatData = require('./formatData')
const WriteFile = require('./writeFile')

module.exports = class FetchSwagger {
    constructor(serverUrl, controllers) {
        this.serverUrl = serverUrl
        this.baseUrl = `${serverUrl}/swagger-resources`
        this.controllers = controllers.length > 0 ? controllers : null
        this.get()
    }
    async get() {
        const { get } = await require('../lib/utils')
        get(this.baseUrl).then(res => {
            const { location } = res[0]
            const finallUrl = `${this.serverUrl}/${location}`
            get(finallUrl).then(res => {
                new FormatData(res, this.controllers, (res) => {
                    new WriteFile()
                        .writeConfigFile(res.name, res.url)
                        .writeRestFile(res)
                })
            })
        }, err => {
            log.error(`请求错误：${url}`)
        })
    }
}