import { writeFileSync } from 'fs'

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