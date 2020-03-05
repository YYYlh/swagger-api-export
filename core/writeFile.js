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
  const fileName = 'config.js'
  const formatName = format(fileData.serverName)
  const content = `export const ${formatName} = 'http://${fileData.serverUrl}/${fileData.serverName}'\n`
  // 在写入时先获取文件的内容
  fs.readFile(fileName, (err, data) => {
    if (err) {
      wirte(fileName, content)
    } else {
      // 如果文件中存在相同数据-则不需要在写入
      if (String(data).includes(content)) return false
      wirte(fileName, content)
    }
  })
}
exports.writeRestUrlFile = function(fileData) {
  let str = ''
  const fileName = `${fileData.serverName}-url.js`
  const formatName = format(fileData.serverName)
  for (const key in fileData.paths) {
    let pathStr = ''
    for (const item of fileData.paths[key].tagName) {
      const pathArr = item.path.split('/')
      pathKey = pathArr[pathArr.length - 1]
    // ====== 拼接字符串区域 start===============
      pathStr += `
    ${pathKey}: ${formatName} + '${item.path}', // ${item.summary}`
    }
    // ====== 拼接字符串区域 end===============
    pathStr = deleteFirstRow(pathStr)
// ====== 拼接字符串区域 start===============
    str +=`
  ${format(key)}: { // ${fileData.paths[key].description}
${pathStr}
  },`}
  str = deleteFirstRow(str)
  let content = `
import { ${formatName} } from './config.js'

export const ${formatName} = {
${str}
}
` 
// ====== 拼接字符串区域 end===============
  fs.readFile(fileName, (err, data) => {
    content = deleteFirstRow(content)
    if (err) {
      wirte(fileName, content)
    } else if(!String(data)) {
      wirte(fileName, content)
    } else {
      // 如果不是第一次写入 在原先的基础上追加
      // 原先内容
      const oldContentArr = String(data).split('\n')
      oldContentArr.splice(oldContentArr.length - 2, 0, str)
      wirte(fileName, oldContentArr.join('\n'))
    }
  })
}
// 写入文件
function wirte(fileName, content) {
  fs.writeFile(fileName, content, (error) => {
    if(error){
        console.log(error);
        return false;
    }
    console.log('\x1B[32m%s\x1b[39m', `${fileName} -- 👌`);
  })
}
// 删除文件内容的第一行
function deleteFirstRow(data) {
  const arr = String(data).split('\n')
  let result = arr.splice(1)
  return result.join('\n')
}