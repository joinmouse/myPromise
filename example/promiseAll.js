const myPromise = require('../myPromise')

// 普通值
myPromise.all([1,2,3,4]).then(res => {
    console.log(res)
})

let promise = new myPromise((resolve, reject) => {
    resolve('promise')
})
myPromise.all([1,2, promise, 3,4]).then(res => {
    console.log(res)
})