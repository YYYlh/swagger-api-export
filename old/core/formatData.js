const { writeConfigFile, writeRestUrlFile } = require('./writeFile')
// 在这里处理获取到的接口数据
// 别名映射表
const aliasObj = {}
module.exports = function(apiData, needTags) {
  const serverObj = {} // 保存服务信息
  serverObj.serverName = apiData.basePath.slice(1) // 服务名字
  serverObj.serverUrl = apiData.host // 服务地址
  // 拿到全部tags
  const tags = apiData.tags
  // 拿到所有接口地址paths
  const paths = apiData.paths
  let tempTags = []
  // 首先处理所需api数据
  if (!needTags) {
    tempTags = tags
  } else {
    // 首先判断用户是否有取别名
    let needTagStrs = []
    for (const item of needTags) {
      if (item.includes(':')) {
        //设置别名映射表
        const tag = item.split(':')
        needTagStrs.push(tag[0])
        aliasObj[tag[0]] = tag[1]
      } else {
        needTagStrs.push(item)
      }
    }
    // 判断用户输入所需tag是否存在
    for (const item of needTagStrs) {
      const result = tags.find((r) => r.name === item)
      if (!result) {
        console.log('\x1B[31m%s\x1b[39m', `没有该${item}分类`)
        return false
      } else {
        tempTags.push(result)
      }
    }
  }
  serverObj.paths = classify(tempTags, paths)
  // 处理好后写入文件
  writeConfigFile({ serverName: serverObj.serverName, serverUrl: serverObj.serverUrl })
  writeRestUrlFile(serverObj)
}
// 在这里进行tags和paths的分类
function classify(tags, paths) {
  const result = {}
  for (const item of tags) {
    const name = item.name
    let aliasName = ''
    // 对照别名hash表 有别名的用别名
    if (aliasObj[item.name]) {
      aliasName = aliasObj[item.name]
    } else {
      aliasName = item.name
    }
    result[aliasName] = {
      description: item.description,
      tagName: []
    }
    for (const key in paths) {
      let methond = ''
      if (paths[key].get) {
        methond = 'get'
      } else {
        methond = 'post'
      }
      if (paths[key][methond] && paths[key][methond].tags[0] === name) {
        result[aliasName].tagName.push({
          path: key,
          methond,
          summary: paths[key][methond].summary
        })
      }
    }
  }
  return result
}