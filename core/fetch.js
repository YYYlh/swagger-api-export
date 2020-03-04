const superagent = require('superagent')
const formatApiData = require('./formatData')

// 此部分为获取用户所提供的swagger数据
module.exports = function(url, needTags) {
  superagent.get(`${url}/swagger-resources`).end((err, res) => {
    if (err) {
      console.log('\x1B[31m%s\x1b[39m', `错误：请检查服务 ${url} 是否可用`)
      return false
    }
    // 最终获取数据的地址
    const location = `${url}${res.body[0].location}`
    superagent.get(location).end((err, res) => {
      // 获取到全部接口数据
      const { body } = res
      // 处理数据
      formatApiData(body, needTags)
    })
  })
}