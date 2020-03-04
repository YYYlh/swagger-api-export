const fs = require('fs')
// 将a-b ==> aB
function format(str) {
  const strArr = str.split('')
  for (let i = 0, len = strArr.length; i < len; i++) {
    if (strArr[i] === '-') {
      strArr[i + 1] = strArr[i + 1].toLocaleUpperCase()
    }
  }
  const formatArr = strArr.filter(item => item !== '-')
  return formatArr.join('')
}
// 在这里写入文件
exports.writeConfigFile = function(fileData) {
  const formatName = format(fileData.serverName)
  const content = `export const ${formatName} = 'http://${fileData.serverUrl}/${fileData.serverName}'\n`
  // 在写入时先获取文件的内容
  fs.readFile('config.js', (err, data) => {
    if (err) {
      wirte(content)
    } else {
      // 如果文件中存在相同数据-则不需要在写入
      if (String(data).includes(content)) return false
      wirte(content)
    }
  })
  function wirte(content) {
    fs.appendFile('config.js', content, (error) => {
      if(error){
        console.log(error);
        return false;
      }
      console.log('\x1B[32m%s\x1b[39m', `config.js写入成功 👌`);
    })
  }
}
exports.writeRestUrlFile = function(fileData) {
  let str = ''
  const formatName = format(fileData.serverName)
  for (const key in fileData.paths) {
    let pathStr = ''
    for (const item of fileData.paths[key].tagName) {
      const pathArr = item.path.split('/')
      pathKey = pathArr[pathArr.length - 1]
      pathStr += `
    ${pathKey}: ${formatName} + '${item.path}', // ${item.summary}`
    }
    str +=`
  ${format(key)}: { // ${fileData.paths[key].description}
    ${pathStr}
  },\n`}
  const content = `
import { ${formatName} } from './config.js'

export const ${formatName} = {
${str}
}
`
  fs.readFile(`${fileData.serverName}-url.js`, (err, data) => {
    if (err) {
      wirte(content)
    } else if(!String(data)) {
      wirte(content)
    } else {
      // 如果不是第一次写入 在原先的基础上追加
      // 原先内容
      const oldContentArr = String(data).split('\n')
      oldContentArr.splice(oldContentArr.length - 2, 0, str)
      wirte(oldContentArr.join('\n'))
    }
  })
  function wirte(content) {
    fs.writeFile(`${fileData.serverName}-url.js`, content, (error) => {
      if(error){
          console.log(error);
          return false;
      }
      console.log('\x1B[32m%s\x1b[39m', `${fileData.serverName}-url.js写入成功 👌`);
    })
  }
}