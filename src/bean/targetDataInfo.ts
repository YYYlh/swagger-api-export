import { Tag, PathInfo } from './ServerInfo'

export interface TargetDataInfo {
    title: string,
    baseUrl: string,
    apis: Api[]
}

export interface Api extends Tag {
    list: PathInfo[]
}