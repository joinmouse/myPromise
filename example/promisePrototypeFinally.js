const { resolve, reject } = require('../myPromise')
const myPromise = require('../myPromise')

let p = new myPromise((resolve, reject) => {
    resolve(100)
})

p.then(res => {
    console.log(res)
    return new myPromise((resolve, reject) => {
        setTimeout(() => {
            resolve('hahhah~')
        }, 3000)
    })
}, err => {
    console.log(err)
}).finally(() => {
    console.log('finally')
}).then(res => {
    console.log(`res: ` + res)
})