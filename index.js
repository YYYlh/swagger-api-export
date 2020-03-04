#!/usr/bin/env node
const program = require('commander')
const app = require('./core/fetch')

// 配置命令行
program
  .version('1.0.0')
  .parse(process.argv)
// 获取用户的参数
const { args } = program

const argsLen = args.length

if (argsLen === 0) {
  console.log('请输入服务地址！')
  return false
}
// 获取参数 第一个为服务地址 后面n个为所需接口
const baseUrl = args[0]
let needs = []
if (argsLen > 1) {
  needs = args.slice(1)
} else {
  needs = null
}
app(baseUrl, needs)