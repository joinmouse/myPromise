const myPromise = require('../myPromise')

myPromise.reject(new Error('fail err')).then(function() {
    // not called
}, function(error) {
    console.error(error) // Stacktrace
})