const { resolve } = require('path')
const myPromise = require('./myPromise')

// 1、测试resolve
new myPromise((resolve, reject) => {
    // throw new Error('fail')
    resolve(1)
}).then(res => {
    console.log(res)
}, err => {
    console.log(`err: ${err}`)
})

// 2、测试throw
new myPromise((resolve, reject) => {
    throw new Error('fail')
    resolve(1)
}).then(res => {
    console.log(res)
}, err => {
    console.log(`err: ${err}`)
})

// 测试异步
let promise = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步执行')
    })
})
promise.then(data => {
    console.log(data)
}, err => {
    console.log(err)
})
promise.then(data => {
    console.log(data)
}, err => {
    console.log(err)
})
promise.then(data => {
    console.log(data)
}, err => {
    console.log(err)
})
