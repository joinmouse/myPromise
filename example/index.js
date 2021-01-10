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

/*
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
console.log('---- 测试异步 ----')
let promise = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('异步执行')
    }, 0)
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
    console.log('---- 测试异步 ----')
}, err => {
    console.log(err)
    console.log('---- 测试异步 ----')
})

let p = new myPromise((resolve, reject) => {
    resolve(10)
})
p.then(data => {
    console.log(data)
    return 100
}).then(data => {
    console.log(data)
})
*/

// promise不能自己返回自己
let promise1 = new myPromise((resolve, reject) => {
    resolve(1000)
})
let promise2 = promise1.then((res) => {
    console.log(res)
    return new myPromise((resolve, reject) => {
        setTimeout(()=>{
            resolve('demo')
        }, 0)
    })
}, err => {
    console.log(err)
})
promise2.then(res => {
    console.log('执行啦~')
    console.log(res)
}, err => {
    console.log(err)
}).then(res => {
    console.log(res)
})

// 可选参数调用
let promiseA = new myPromise((resolve, reject) => {
    // resolve('promiseA')  
    reject('err')
})
promiseA.then().then().then(res => {
    console.log(res)
}, err => {
    console.log(err)
})