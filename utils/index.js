
exports.get = async function(url) {
    const { get } = await require('superagent')
    return new Promise((reslove, reject) => {
        get(url).end((err, res) => {
            if (err) {
                reject(err)
            } else {
                reslove(res)
            }
        })
    })
}