const { resolve } = require("path")

const PENDING = 'PENDING'
const RESOLVE = 'RESOLVE'
const REJECTED = 'REJECTED'

const safelyResolvePromise = (promise, x, resolve, reject) => {
    // 1、x不能是promise
    if(promise === x) {
        return reject(new TypeError("promise 不能返回当前的 promise"))
    }
}

class myPromise {
    constructor(executor) {
        this.state = PENDING  // 默认是pending状态
        this.result = undefined
        this.reason = undefined

        this.onReolvedCallbacks = []  //成功回调的数组
        this.onRejectedCallbacks = []  //失败回调的数组

        // pending状态下才可以去改值
        let resolve = (result) => {
            if(this.state === PENDING) {
                this.state = RESOLVE
                this.result = result
                this.onReolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject= (reason) => {
            if(this.state === PENDING) {
                this.state = REJECTED
                this.reason = reason
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        }catch(e) {
            reject(e)  //执行发生错误。默认调用了reject方法
        }
    }
    // 接受两个参数, 里面的执行就是异步的
    then(onfulfilled, onrejected) {
        // (resolve, reject) => {} 组成的executor 会立即执行
        let promise = new myPromise((resolve, reject) => {
            // 同步
            if(this.state === RESOLVE) {
                setTimeout(() => {
                    try {
                        let x = onfulfilled(this.result)
                        // data可能是普通值，也可能是promise
                        safelyResolvePromise(promise, x, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                }, 0)
            }
            if(this.state === REJECTED) {
                let err = onrejected(this.reason)
                reject(err)
            }
            // 异步
            if(this.state === PENDING) {
                this.onReolvedCallbacks.push(() => {
                    onfulfilled(this.result)
                })
                this.onRejectedCallbacks.push(() => {
                    onrejected(this.reason)
                })
            }
        })
        
        return promise
    }
}

module.exports = myPromise