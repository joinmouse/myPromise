const myPromise = require('../myPromise')

var p1 = new myPromise(function(resolve, reject) {
    resolve('Success');
})
  
p1.then(function(value) {
    console.log(value); // "Success!"
    throw 'oh, no!';
}).catch(function(e) {
    console.log(e); // "oh, no!"
}).then(function(){
    console.log('after a catch the chain is restored');
}, function () {
    console.log('Not fired due to the catch');
});