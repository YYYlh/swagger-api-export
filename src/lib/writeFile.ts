import { writeFileSync, readFileSync, existsSync } from 'fs'
import { 
    programBodyTemplate,
    exportsVarTemplate,
    importTemplate,
    es6ExportTemplate,
    templateStrTemplate,
    keyValueTemplate,
    objectTemplate
} from '../astTemplate'
import { parseModule, generate, traverse } from './ast'
import { Api } from '../bean/targetDataInfo'
import { hump } from '../utils'

export class BaseFs {
    protected writeFile(path: string, data: string) {
        writeFileSync(path, data)
    }

    protected readFile(path: string): string {
        return readFileSync(path).toString()
    }

    protected isExists(path: string): boolean {
        return existsSync(path)
    }

    upReadFile(path: string) {
        let result = ''
        if (this.isExists(path)) {
            result = this.readFile(path)
        }
        return result
    }
}


export class WriteRestUrlFile extends BaseFs {
    private path: string
    private data: [string, Api[]]
    constructor(path: string, data: [string, Api[]]) {
        super()
        this.path = path
        this.data = data
    }
    write(callback: Function) {
        let resourceData = this.upReadFile(this.path)
        const finalData = this.disposeAst(resourceData)
        this.writeFile(this.path, finalData)
        callback()
    }
    disposeAst(resourceData: string): string {
        const [key, apis] = this.data
        let body: any[] = []
        if (resourceData) {
            body = parseModule(resourceData).body
        }
        const importAst = importTemplate([key], './config.js')
        if (body.length === 0) {
            body[0] = importAst
        }
        body[1] = this.apiToAst(apis, key)
        let program = programBodyTemplate(body)
        program = parseModule(generate(program), {
            range: true
        })
        this.addComment(program, apis)
        return generate(program, {
            comment: true
        })
    }
    addComment(program: any, apis: Api[]) {
        interface comments {
            [key: string]: string
        }
        let commentsObj: comments = {}
        for (const ii of apis) {
            commentsObj[this.removeController(ii.name)] = ii.description
            for (const jj of ii.list) {
                commentsObj[this.getLastKey(jj.url)] = jj.summary
            }
        }
        traverse(program as any, {
            leave(node: any) {
                if (node.type === 'Property') {
                    const key = node.key
                    if (key.name in commentsObj) {
                        const range = key.range
                        const comment = commentsObj[key.name]
                        const commentRange1 = range[0] - 5
                        const commentRange = [commentRange1 - comment.length, commentRange1]
                        node.leadingComments = [
                            {
                                type: "Line",
                                value: comment,
                                range: commentRange
                            }
                        ]
                    }
                }
            }
        })
        return program
    }

    apiToAst(apis: Api[], key: string): any {
        let root: any[] = []
        for (let i = 0, len = apis.length; i < len; i++) {
            let api = apis[i]
            let properties: any[] = []
            for (let j = 0, len = api.list.length; j < len; j++) {
                properties.push(keyValueTemplate(this.getLastKey(api.list[j].url), templateStrTemplate(key, api.list[j].url)))
            }
            root.push(objectTemplate(this.removeController(api.name), properties))
        }
        return es6ExportTemplate(root)
    }

    // /aaa/bbb/ccc => ccc
    getLastKey(str: string): string {
        let arr = str.split('/')
        return arr[arr.length - 1]
    }
    removeController(str: string) {
        let reg = /^\s+|\s+$/g
        let result = hump(str, '-').replace(reg, '').replace('Controller', '')
        return result
    }
}

export class WriteConfigFile extends BaseFs {
    private path: string
    private data: string[]
    constructor(path: string, data: string[]) {
        super()
        this.path = path
        this.data = data
    }
    write(callback: Function) {
        let resourceData = this.upReadFile(this.path)
        const finalData = this.disposeAst(resourceData)
        this.writeFile(this.path, finalData)
        callback()
    }
    disposeAst(resourceData: string): string {
        let [key, value] = this.data
        let exists = false
        let body: any[] = []
        if (resourceData) {
            body = parseModule(resourceData).body
        }
        const dataAst = exportsVarTemplate(key, value)
        const program = programBodyTemplate(body)
        traverse(program as any, {
            leave(node: any) {
                if (node.type === 'VariableDeclaration') {
                    if (node.declarations[0].id.type === 'Identifier') {
                        if (node.declarations[0].id.name ===  key) {
                            node.declarations[0].init.value = value
                            node.declarations[0].init.raw = value
                            exists = true
                        }
                    }
                }
                if (node.type === 'Program') {
                    if (node.sourceType === 'module') {
                        if (!exists) {
                            node.body = [...body, dataAst]
                        }    
                    }
                }
            }
        })
        return generate(program)
    }
}