import FetchServer from './fetchServer'
import { ServerInfo, PathsInfo, PathInfo, Tag } from '../bean/ServerInfo'
import { TargetDataInfo, Api } from '../bean/TargetDataInfo'
import { BaseFs } from '../lib/writeFile'
import { join } from 'path'
import { hump } from '../utils'

const baseFs = new BaseFs()

export default class TargetData {
    private fetchServer: FetchServer
    constructor(server: string) {
        this.fetchServer = new FetchServer(server)
    }

    async getData(writeFileDirPath: string): Promise<TargetDataInfo> {
        const resourceData: ServerInfo = await this.fetchServer.request()
        const basePath = resourceData.title.slice(1)
        let key = ''
        if (basePath) {
            key = hump(resourceData.basePath.slice(1), '-')
        } else {
            key = 'api'
        }
        let tempData: TargetDataInfo = {
            key,
            title: resourceData.title,
            baseUrl: 'http://' + resourceData.host + resourceData.basePath,
            basePath: resourceData.basePath,
            apis: []
        }
        let fileData = ''
        if (writeFileDirPath) {
            fileData = baseFs.upReadFile(join(writeFileDirPath, `${key}.js`))
        }
        tempData.apis = this.margeApis(resourceData.tags, resourceData.paths, fileData)
        return tempData
    }

    margeApis(tags: Tag[], paths: PathsInfo, sourceFileData: string): Api[] {
        let apis: Api[] = []
        for (let i = 0, len = tags.length; i < len; i++) {
            let tag = tags[i]
            let api: Api = {
                name: tag.name,
                description: tag.description,
                list: []
            }
            for (const key in paths) {
                let path: PathInfo = {
                    url: '',
                    method: '',
                    summary: '',
                    checked: false
                }
                
                if (paths[key].tags[0] === tag.name) {
                    path.url = key
                    path.summary = paths[key].summary
                    path.method = paths[key].method
                    if (sourceFileData.includes(key)) {
                        path.checked = true
                    }
                    api.list.push(path)
                }
            }
            apis.push(api)
        }
        return apis
    }
}