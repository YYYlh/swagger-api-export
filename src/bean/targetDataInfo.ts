import { Tag, PathInfo } from './ServerInfo'

export interface TargetDataInfo {
    title: string,
    url: string,
    apis: Api[]
}

export interface Api extends Tag {
    list: PathInfo[]
}