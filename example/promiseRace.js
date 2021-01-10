const myPromise = require('../myPromise')

let p1 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功了')
    // reject('err1')
  }, 2000)
})

let p2 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')    
    // reject('err2')
  }, 1000)
})

myPromise.race([p1, p2]).then((result) => {
  console.log(result)               // ['成功了', 'success']
}, err=> {
  console.log(err)
})