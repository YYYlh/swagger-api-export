export function programBodyTemplate(body: any[]) {
    return {
        type: 'Program',
        body: body,
        sourceType: 'module',
    };
}
// export const name = value
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

// import {...names} from 'source'
export function importTemplate(names: string | string[], source: string) {
    let specifiers: any[] = [];
    if (typeof names === 'object') {
        specifiers = names.map((name) => ({
            type: 'ImportSpecifier',
            local: {
                type: 'Identifier',
                name: name,
            },
            imported: {
                type: 'Identifier',
                name: name,
            },
        }));
    } else if (typeof names === 'string') {
        specifiers = [
            {
                type: 'ImportDefaultSpecifier',
                local: {
                    type: 'Identifier',
                    name: names,
                },
            },
        ];
    }
    return {
        type: 'ImportDeclaration',
        specifiers: specifiers,
        source: {
            type: 'Literal',
            value: source,
            raw: source,
        },
    };
}
// `${vari}str`
export function templateStrTemplate(vari: string, str: string) {
    return {
        type: 'TemplateLiteral',
        quasis: [
            {
                type: 'TemplateElement',
                value: {
                    raw: '',
                    cooked: ''
                },
                tail: false
            },
            {
                type: 'TemplateElement',
                value: {
                    raw: str,
                    cooked: str
                },
                tail: true
            }
        ],
        expressions: [
            {
                type: 'Identifier',
                name: vari
            }
        ]
    }
}

// export default {}
export function es6ExportTemplate(properties: any[]) {
    return {
        type: 'ExportDefaultDeclaration',
        declaration: {
            type: 'ObjectExpression',
            properties: properties
        }
    }
}

// key: value(模板字符串)
export function keyValueTemplate(key: string, value: any) {
    return {
        type: 'Property',
        key: {
            type: 'Identifier',
            name: key
        },
        computed: false,
        value,
        kind: 'init',
        method: false,
        shorthand: false
    }
}

// key: {}
export function objectTemplate(key: string, properties: any[]) {
    return {
        type: 'Property',
        key: {
            type: 'Identifier',
            name: key
        },
        computed: false,
        value: {
            type: 'ObjectExpression',
            properties: properties
        }
    }
}