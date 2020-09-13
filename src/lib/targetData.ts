import FetchServer from './fetchServer'
import { ServerInfo, PathsInfo, PathInfo, Tag } from '../bean/ServerInfo'
import { TargetDataInfo, Api } from '../bean/TargetDataInfo'

export default class TargetData {
    private fetchServer: FetchServer
    constructor(server: string) {
        this.fetchServer = new FetchServer(server)
    }

    async getData(): Promise<TargetDataInfo> {
        const resourceData: ServerInfo = await this.fetchServer.request()
        let tempData: TargetDataInfo = {
            title: resourceData.title,
            baseUrl: 'http://' + resourceData.host + resourceData.basePath,
            apis: []
        }
        tempData.apis = this.margeApis(resourceData.tags, resourceData.paths)
        return tempData
    }

    margeApis(tags: Tag[], paths: PathsInfo): Api[] {
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
                }
                
                if (paths[key].tags[0] === tag.name) {
                    path.url = key
                    path.summary = paths[key].summary
                    path.method = paths[key].method
                    api.list.push(path)
                }
            }
            apis.push(api)
        }
        return apis
    }
}