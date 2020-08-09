const {hump} = require('../lib/utils')
module.exports = class FormatData {
    aliasObj = {}
    constructor(data, controllers, callback) {
        const { host, paths, basePath, tags } = data
        this.serverObj = {
            name: hump(basePath.slice(1)),
            fileName: basePath.slice(1),
            url: `http://${host}${basePath}`
        }
        let tempTags = []
        // 首先处理所需api数据
        if (!controllers) {
            tempTags = tags
        } else {
            // 首先判断用户是否有取别名
            let needTagStrs = []
            for (const item of controllers) {
                if (item.includes(':')) {
                    //设置别名映射表
                    const tag = item.split(':')
                    needTagStrs.push(tag[0])
                    this.aliasObj[tag[0]] = tag[1]
                } else {
                    needTagStrs.push(item)
                }
            }
            // 判断用户输入所需tag是否存在
            for (let i = 0, len = needTagStrs.length; i < len; i++) {
                const item = needTagStrs[i]
                const result = tags.find((r) => r.name === item)
                if (!result) {
                    log.warning(`没找到${item}`)
                    continue
                } else {
                    tempTags.push(result)
                }
            }
        }
        this.serverObj.initialPaths = this.classify(tags, paths)
        this.serverObj.paths = this.formatPaths(this.classify(tempTags, paths))
        this.serverObj.aliasObj = this.reverseObj(this.aliasObj)
        callback(this.serverObj)
    }
    classify(t, p) {
        const tags = JSON.parse(JSON.stringify(t))
        const paths = JSON.parse(JSON.stringify(p))
        const result = {}
        for (const item of tags) {
            const name = item.name
            let aliasName = ''
            // 对照别名hash表 有别名的用别名
            if (this.aliasObj[item.name]) {
                aliasName = this.aliasObj[item.name]
            } else {
                aliasName = item.name
            }
            result[aliasName] = {
                description: item.description,
                tagName: []
            }
            for (const key in paths) {
                let methond = ''
                if (paths[key].get) {
                    methond = 'get'
                } else {
                    methond = 'post'
                }
                if (paths[key][methond] && paths[key][methond].tags[0] === name) {
                    result[aliasName].tagName.push({
                        path: key,
                        methond,
                        summary: paths[key][methond].summary
                    })
                }
            }
        }
        return result
    }
    formatPaths(paths) {
        let result = {}
        for (const key in paths) {
          let path = paths[key]
          let obj = {}
          for (const tag of path.tagName) {
            const pathArr = tag.path.split('/')
            let pathKey = pathArr[pathArr.length - 1]
            obj[pathKey] = tag.path
          }
          result[hump(key)] = obj
        }
        return result
    }
    reverseObj(obj) {
        let result = {}
        for (const key in obj) {
            result[obj[key]] = key
        }
        return result
    }
}