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
            }
        }
        let reject= (reason) => {
            if(this.state === PENDING) {
                this.state = REJECTED
                this.reason = reason
            }
        }
        try {
            executor(resolve, reject)
        }catch(e) {
            reject(e)  //执行发生错误。默认调用了reject方法
        }
    }
    // 接受两个参数
    then(onfulfilled, onrejected) {
        if(this.state === RESOLVE) {
            onfulfilled(this.result)
        }
        if(this.state === REJECTED) {
            onrejected(this.reason)
        }
        if(this.state === PENDING) {
            this.onReolvedCallbacks.push(() => {
                onfulfilled(this.result)
            })
            this.onRejectedCallbacks.push(() => {
                onrejected(this.reason)
            })
        }
    }
}

module.exports = myPromise