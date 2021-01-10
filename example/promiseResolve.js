const myPromise = require('../myPromise')

// 普通值
myPromise.resolve(1).then(res => {
    console.log(res)
})