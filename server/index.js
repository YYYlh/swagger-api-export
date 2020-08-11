const express = require('express')
const bodyParser = require('body-parser')
const opn = require('opn')
const FetchSwagger = require('../dist/fetch_swagger')

const app = express()
const jsonParser = bodyParser.json()

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.get('/', (req, res) => {
    res.end('hello world')
})
app.post('/getServerData', jsonParser, (req, res) => {
    new FetchSwagger(req.body.url, []).getData(data => {
        res.end(JSON.stringify(data))
    })
})

module.exports = () => {
    
    app.listen(520, () => {
        opn('http://localhost:520')
    })
}