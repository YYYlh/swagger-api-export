const FormatData = require('./format_data')
const WriteFile = require('./write_file')

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
                new FormatData(res, this.controllers, (data) => {
                    if(typeof this.callback === 'function') {
                        this.callback(data)
                    } else {
                        new WriteFile()
                            .writeConfigFile(data.name, data.url)
                            .writeRestFile(data)
                    }  
                })
            })
        }, err => {
            this.callback(err)
            log.error(`请求错误：${url}`)
        })
    }
    getData(callback) {
        this.callback = callback
    }
}