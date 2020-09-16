
export function programBodyTemplate(body: any[]) {
    return {
        type: 'Program',
        body: body,
        sourceType: 'module',
    };
}
// 导出变量模板
export function exportsVarTemplate(name: string, value: string) {
    return {
        type: 'ExportNamedDeclaration',
        declaration: {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name,
                    },
                    init: {
                        type: 'Literal',
                        value,
                        raw: value,
                    },
                },
            ],
            kind: 'const',
        },
    };
}