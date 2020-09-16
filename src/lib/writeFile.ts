import { writeFileSync, readFileSync, existsSync } from 'fs'
import { hump } from '../utils'
import { programBodyTemplate, exportsVarTemplate } from '../astTemplate'
import { parseModule, generate, traverse } from './ast'

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
    private data: string
    constructor(path: string, data: string) {
        super()
        this.path = path
        this.data = data
    }
    write(callback: Function) {
        this.writeFile(this.path, this.data)
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
        let key = hump(this.data[0].substr(1), '-')
        let value = this.data[1]

        let body: any[] = []
        let resourceData = ''
        let exists = false

        if (this.isExists(this.path)) {
            resourceData = this.readFile(this.path)
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
        this.writeFile(this.path, generate(program))
        callback()
    }
}