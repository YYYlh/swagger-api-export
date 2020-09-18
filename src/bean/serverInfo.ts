export interface Post {
    tags: string[],
    summary: string,
    method: string
}

export interface Get extends Post {
    
}
export interface Tag {
    name: string,
    description: string
}

export interface PathsInfo {
    [key: string]: Get | Post,
}
export interface PathInfo {
    url: string,
    method: string,
    summary: string,
    checked?: boolean
}

export interface ServerInfo {
    title: string,
    host: string,
    basePath: string,
    tags: Tag[],
    paths: PathsInfo
}