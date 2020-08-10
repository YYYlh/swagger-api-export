const Ast = require('../dist/ast')
const ast = new Ast()

module.exports = {
  programBodyTemplate(body) {
    return {
      type: "Program",
      body: body,
      sourceType: "module",
    };
  },
  importTemplate(names, source) {
    let specifiers = [];
    if (Object.prototype.toString.call(names) === "[object Array]") {
      specifiers = names.map((name) => ({
        type: "ImportSpecifier",
        local: {
          type: "Identifier",
          name: name,
        },
        imported: {
          type: "Identifier",
          name: name,
        },
      }));
    } else if (typeof names === "string") {
      specifiers = [
        {
          type: "ImportDefaultSpecifier",
          local: {
            type: "Identifier",
            name: names,
          },
        },
      ];
    }
    return {
      type: "ImportDeclaration",
      specifiers: specifiers,
      source: {
        type: "Literal",
        value: source,
        raw: source,
      },
    };
  },
  // 导出变量模板
  exportsVarTemplate(name, value) {
    return {
      type: "ExportNamedDeclaration",
      declaration: {
        type: "VariableDeclaration",
        declarations: [
          {
            type: "VariableDeclarator",
            id: {
              type: "Identifier",
              name,
            },
            init: {
              type: "Literal",
              value,
              raw: value,
            },
          },
        ],
        kind: "const",
      },
    };
  },
  // 导出对象模板
  exportObjectTemplate(obj) {
    return {
      "type": "ExpressionStatement",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "module"
          },
          "property": {
            "type": "Identifier",
            "name": "exports"
          }
        },
        "right": {
          "type": "ObjectExpression",
          "properties": [
            obj
          ]
        }
      }
    }
  },
  // esmodule导出
  es6ExportTemplate(properties) {
    return {
      "type": "ExportDefaultDeclaration",
      "declaration": {
        "type": "ObjectExpression",
        "properties": properties
      }
    }
  },
  // key-value生成模板
  keyValueTemplate(obj) {
    const code = `let a = ${JSON.stringify(obj)}`
    let program = ast.parseModule(code)
    ast.traverse()(program, {
      leave(node) {
        if (node.type === 'Property') {
          // 判断有没有'/' ','
          if (node.key) {
            const value = node.key.value
            const reg = new RegExp("[`~!@#$^&*%()=|{}':;',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
            if (reg.test(value)) {
            } else {
              node.key.type = 'Identifier'
              node.key.name = value
            }
          }
        }
      }
    })
    return program.body[0].declarations[0].init.properties
  },
  // 模板字符串模板
  templateStrTemplate(vari, str) {
    return {
      "type": "TemplateLiteral",
      "quasis": [
        {
          "type": "TemplateElement",
          "value": {
            "raw": "",
            "cooked": ""
          },
          "tail": false
        },
        {
          "type": "TemplateElement",
          "value": {
            "raw": str,
            "cooked": str
          },
          "tail": true
        }
      ],
      "expressions": [
        {
          "type": "Identifier",
          "name": vari
        }
      ]
    }
  }
};
