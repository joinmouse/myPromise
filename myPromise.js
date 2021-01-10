const PENDING = 'PENDING'
const RESOLVE = 'RESOLVE'
const REJECTED = 'REJECTED'

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
    // 接受两个可选参数: onfulfilled, onrejected, 里面的执行就是异步的
    then(onfulfilled, onrejected) {
        // 对可选参数的处理
        onfulfilled = (typeof onfulfilled === 'function' ? onfulfilled : data => data)
        onrejected = (typeof onrejected === 'function' ? onrejected : err => { throw err })

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
                setTimeout(() => {
                    try {
                        let x = onrejected(this.reason)
                        safelyResolvePromise(promise, x, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                }, 0)
            }
            // 异步
            if(this.state === PENDING) {
                this.onReolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onfulfilled(this.result)
                            safelyResolvePromise(promise, x, resolve, reject)
                        }catch(e) {
                            reject(e)
                        }
                    }, 0)
                    
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onrejected(this.reason)
                            safelyResolvePromise(promise, x, resolve, reject)
                        }catch(e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        })
        return promise
    }

    // Promise.resolve语法糖
    static resolve(value) {
        // 判断是否是thenable对象
        if(isPromise(value)) {
            return value
        }else {
            let promise = new myPromise((resolve) => resolve(value))
            return promise
        }
    }

    static reject(err) {
        // 判断是否是thenable对象
        let promise = new myPromise((resolve, rej) => {
            rej(err)
        })
        return promise
    }

    // 实现静态方法all
    static all(values) {
        return new myPromise((resolve, reject) => {
            let arr = []
            let index = 0
            function processData(key, val) {
                arr[key] = val
                index += 1
                if(index == values.length) {
                    resolve(arr)
                }
            }

            for(let i=0; i<values.length; i++) {
                let current = values[i]
                if(isPromise(current)) {
                    current.then((res) => {
                        processData(i, res)
                    }, err => reject(err))
                }else {
                    processData(i, current)
                }
            }
        })
    }
}

const safelyResolvePromise = (promise, x, resolve, reject) => {
    // 1、x不能是promise
    if(promise === x) {
        return reject(new TypeError("循环引用"))
    }
    // 判断x的类型是否问promise
    let called = false
    if((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            let then = x.then  // 取then有可能出错
            // 当前有then方法，就认为其是一个promise
            if(typeof then === 'function') {
                then.call(x, res => {
                    if(called) return
                    called = true
                    // res可能是promise就递归一下，知道解出来的是一个普通值
                    safelyResolvePromise(promise, res, resolve, reject)  
                }, err => {
                    if(called) return
                    called = true
                    reject(err)
                })
            }else {
                // {then: 1}
                resolve(x)
            }
        }catch(e) {
            if(called) return
            called = true
            reject(e)
        }
    }else {
        // x的值返回的是一个普通值
        resolve(x)
    }
}


// 按照 PromiseA+ 规范来做的判断
const isPromise = (value) => {
    if((typeof value === 'object' && value !== null) || typeof value === 'function') { 
        if(typeof value.then === 'function') {
            return true
        }else {
            return false
        }
    }else {
        return false
    }
}

// 测试部分
myPromise.defer = myPromise.deferred = function () {
    let dfd = {};
    dfd.promise = new myPromise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

module.exports = myPromise