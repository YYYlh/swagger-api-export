import { writeFileSync } from 'fs'
import { hump } from '../utils'
class BaseFs {
    protected writeFile(path: string, data: string) {
        writeFileSync(path, data)
    }
}


export class WriteConfigFile extends BaseFs {
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

export class WriteRestUrlFile extends BaseFs {
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
        // this.writeFile(this.path, `export const ${key} = "${value}"`)
        callback()
    }
}