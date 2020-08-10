const fs = require('fs')
const path = require('path')
const process = require('process')
const Ast = require('./ast')
const { 
    programBodyTemplate,
    exportsVarTemplate,
    importTemplate,
    templateStrTemplate,
    keyValueTemplate,
    es6ExportTemplate
} = require('../lib/ast_template')
const { hump } = require('../lib/utils')

const ast = new Ast()
const cwdDir = process.cwd()
const configDir = path.join(cwdDir, 'src/config')

module.exports = class WriteFile {
    constructor() {
        this.exists = false
        this.mkConfigDir()
    }
    readFile(path) {
        const buffer = fs.readFileSync(path)
        return buffer.toString()
    }
    writeConfigFile(name, url) {
        let body = []
        let fileDataAst = null
        const configFilePath = path.join(configDir, 'config.js')
        if (fs.existsSync(configFilePath)) {
            const fileData = this.readFile(configFilePath)
            body = ast.parseModule(fileData).body
        }
        fileDataAst = exportsVarTemplate(name, url)
        const program = programBodyTemplate(body)
        ast.traverse()(program, {
            leave(node) {
                if (node.type === 'VariableDeclaration') {
                    if (node.declarations[0].id.name === name) {
                      node.declarations[0].init.value = url
                      node.declarations[0].init.raw = url
                      this.exists = true
                    }
                }
                if (node.sourceType === 'module') {
                    // 已经循环完毕
                    if (!this.exists) {
                        node.body = [...body, fileDataAst]
                    } 
                }
            }
        })
        fs.writeFileSync(configFilePath, ast.generate(program))
        log.success(`${name}已写入config.js`)
        return this
    }
    writeRestFile({fileName, name, paths, initialPaths, aliasObj}) {
        let body = []
        let existsFileDatas = []
        let commentsObj = {}
        let tagNames = []
        for (const key in initialPaths) {
            const cur = initialPaths[key]
            const tagName = cur.tagName
            tagNames.push(...tagName)
            commentsObj[hump(key)] = cur.description
        }
        for (const item of tagNames) {
            const arr = item.path.split('/')
            const len = arr.length
            const key = arr[len - 1]
            commentsObj[key] = item.summary
        }
        const restUrlFilePath = path.join(configDir, `${fileName}.js`)
        if (fs.existsSync(restUrlFilePath)) {
            const fileData = this.readFile(restUrlFilePath)
            if(fileData) {
                let properties = ast.parseModule(fileData).body[1].declaration.properties
                for(const item of properties) {
                    const name = item.key.name
                    if (name in paths) {
                        
                    } else {
                        existsFileDatas.push(item)
                    }
                }
            }
        }
        const importAst = importTemplate([name], './config.js')
        body[0] = importAst
        const program = programBodyTemplate(body)
        const pathsObjAst = keyValueTemplate(paths)
        const exportDefaultAst = es6ExportTemplate(pathsObjAst)
        ast.traverse()(program, {
            leave(node) {
              if (node.sourceType === 'module') {
                node.body = [...body, exportDefaultAst]
              }
            }
        })
        ast.traverse()(program, {
            leave(node) {
                if (node.type === 'Property') { 
                    if (node.value.type !== 'ObjectExpression') {
                        const oldValue = node.value.value
                        node.value = templateStrTemplate(name, oldValue)
                    }
                }
                if (node.sourceType === 'module') {
                    node.body[1].declaration.properties.unshift(...existsFileDatas)
                }
            }
        })
        ast.traverse()(program, {
            leave(node) {
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
        fs.writeFileSync(restUrlFilePath, ast.generate(program))  
        log.success(`${fileName}.js`)
    }
    mkConfigDir() {
        fs.existsSync(configDir) || fs.mkdirSync(configDir) 
    }
}