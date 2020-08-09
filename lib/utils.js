exports.get = async function(url) {
    const { get } = await require('superagent')
    return new Promise((reslove, reject) => {
        get(url).end((err, res) => {
            if (err) {
                reject(err)
            } else {
                reslove(res.body)
            }
        })
    })
}
exports.hump = function(str) {
    const strArr = str.split('')
    for (let i = 0, len = strArr.length; i < len; i++) {
      if (strArr[i] === '-') {
        strArr[i + 1] = strArr[i + 1].toLocaleUpperCase()
      }
    }
    const formatArr = strArr.filter(item => item !== '-')
    return formatArr.join('')
}