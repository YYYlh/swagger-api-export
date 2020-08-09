#!/usr/bin/env node
require('./lib/global')() // 添加全局变量(log)
const FetchSwagger = require('./dist/fetch_swagger')
const { program } = require('commander')
const process = require('process')

program
    .version('1.0.0')

program
    .command('fetch [serverUrl] [controllers...]')
    .description('读取swagger地址')
    .action(function(serverUrl, controllers){
        new FetchSwagger(serverUrl, controllers)
    })
program.parse(process.argv)

 