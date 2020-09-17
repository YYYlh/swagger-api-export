import { writeFileSync, readFileSync, existsSync } from 'fs'
import { programBodyTemplate, exportsVarTemplate } from '../astTemplate'
import { parseModule, generate, traverse } from './ast'
import { Api } from '../bean/targetDataInfo'

class BaseFs {
    protected writeFile(path: string, data: string) {
        writeFileSync(path, data)
    }

    protected readFile(path: string): string {
        return readFileSync(path).toString()
    }

    protected isExists(path: string): boolean {
        return existsSync(path)
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
        // this.writeFile(this.path, this.data)
        callback()
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
        let resourceData = ''
        if (this.isExists(this.path)) {
            resourceData = this.readFile(this.path)    
        }
        const finalData = this.disposeAst(this.data, resourceData)
        this.writeFile(this.path, finalData)
        callback()
    }
    disposeAst(data: string[], resourceData: string): string {
        let [key, value] = data
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