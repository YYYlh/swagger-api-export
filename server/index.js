const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const opn = require('opn')
const FetchSwagger = require('../dist/fetch_swagger')
const FormatData = require('../dist/format_data')
const WriteFile = require('../dist/write_file')


const writeFile = new WriteFile()
const app = express()
const jsonParser = bodyParser.json()
app.use(express.static(path.resolve(__dirname, '../app/dist')))

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.get('/', (req, res) => {
    res.render('index')
})
app.post('/getServerData', jsonParser, (req, res) => {
    new FetchSwagger(req.body.url, []).getData(data => {
        // 读取文件
        const fileData = writeFile.readFile('', data.fileName)
        const initialPaths = JSON.parse(JSON.stringify(data)).initialPaths
        for (const key in initialPaths) {
            const cur = initialPaths[key]
            for (const item of cur.tagName) {
                if (fileData.includes(item.path)) {
                    item.check = true
                }
            }
        }
        data.initialPaths = initialPaths
        res.end(JSON.stringify(data))
    })
})
app.post('/submitServerData', jsonParser, (req, res) => {
    const formatData = new FormatData()
    const jsonParams = req.body
    if (jsonParams) {
        const paths = formatData.formatPaths(jsonParams.paths)
        jsonParams.paths = paths
        new WriteFile()
            .writeConfigFile(jsonParams.name, jsonParams.url)
            .writeRestFile(jsonParams)
        res.end(JSON.stringify({ success: true }))
    } else {
        res.end(JSON.stringify({ success: false }))
    }
})

module.exports = () => {
    app.listen(520, () => {
        opn('http://localhost:520')
    })
}