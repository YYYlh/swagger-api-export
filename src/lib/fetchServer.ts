import axios from 'axios'
import { ServerInfo, PathsInfo } from '../bean/ServerInfo'

export default class FetchServer {
    private server: string

    constructor(server: string) {
        this.server = server
    }

    request(): Promise<ServerInfo> {
        let resultData: ServerInfo = {
            title: '',
            tags: [],
            host: '',
            basePath: '',
            paths: {}
        }
        return new Promise((reslove, reject) => {
            axios.get(this.server + '/swagger-resources').then((res) => {
                axios.get(this.server + res.data[0].location).then(result => {
                    const { data: { tags, host, basePath, paths, info: { title } } } = result
                    resultData.title = title
                    resultData.tags = tags
                    resultData.host = host
                    resultData.basePath = basePath
                    resultData.paths = this.formatPaths(paths)
                    reslove(resultData)
                })
            }).catch(() => {
                reject({ success: false, data: '请求失败' })
            })
        })
    }

    formatPaths(paths: any): PathsInfo{
        let resultPaths: PathsInfo = {
        
        }
        for (const key in paths) {
            const method = paths[key].get ? 'get' : 'post'
            if (paths[key][method]) {
                resultPaths[key] = {
                    method,
                    summary: paths[key][method].summary,
                    tags: paths[key][method].tags,
                }
            } 
        }
        return resultPaths
    }
}