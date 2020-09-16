export { parseModule } from 'esprima'
export { traverse } from 'estraverse'
export { generate } from 'escodegen'


/* import { parseModule } from 'esprima'
import { traverse } from 'estraverse'
import { generate } from 'escodegen' */


/* const a = parseModule('export const a = "asas"')

traverse(a, {
    leave(node) {
        if (node.type === 'VariableDeclaration') {
            if (node.declarations[0].id.type === 'Identifier') {
                console.log(node.declarations[0].id.name)
            }
        }
        if(node.type === 'Program') {
             
            if (node.sourceType === 'module') {
                node.body = 
            }
        }
    }
}) */