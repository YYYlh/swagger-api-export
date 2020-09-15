import { Tag, PathInfo } from './ServerInfo'

export interface TargetDataInfo {
    title: string,
    baseUrl: string,
    basePath: string,
    apis: Api[]
}

export interface Api extends Tag {
    list: PathInfo[]
}