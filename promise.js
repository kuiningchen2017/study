/*
  Promise是异步编程的解决方案，比传统的解决方案 ——回调函数和事件—— 更合理更强大
*/
const url = 'https://jsonplaceholder.typicode.com/todos'
const xhr = new XMLHttpRequest() // 它是由浏览器提供的，不是JavaScript原生的
let btnDom = document.getElementById('btn')
btnDom.onclick = function() {
  // 请求数据
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status <= 300) {
        let data = xhr.responstText
        // 拿到请求数据返回的值再去发送请求 
        // ... 这样就造成了回调函数和事件的层层嵌套（回调低于）
      } else {
        console.log('Request was unsuccessful: ' + xhr.status);
      }
    }
  }
  xhr.open('get', url)
  xhr.setRequestHeader('myNewHeader', 'MyNewHeaderValue')
  xhr.send(null)
}
/*
  所谓Promise，简单来说就是一个容器，里面保存着未来才会结束的事件的结果（通常是一个异步的操作）
  两个特点：
  （1）对象的状态不受外界影响。pending（进行中）、fulfilled（已成功）、rejected（已失败）
  只有异步操作的结果可以决定当前是哪种状态，任何其他操作都无法改变这个状态。这个也是Promise名称的由来（Promise 承诺）
  （2）一旦状态改变，就不会再改变，任何时候都可以得到这个结果
  只有两种情况：从pending到fulfilled 和 从pending到rejected
  缺点：
  （1）无法取消，一旦新建它就会立即执行，无法中途取消
  （2）其次，如果不设置回调函数，Promise内部抛出的错误，不会反应到外部
*/
var promise = new Promise((resolve, reject) => {
  // ... some code
  if (true) { /* 异步操作成功 */
    resolve('success') // 将Promise对象的状态从'未完成'变成'成功'
  } else {
    reject('fail') // 将Promise对象的状态从'未完成'变成'失败'
  }
})
// Promise实例生成后，可以用then方法分别指定resolved状态和rejected状态的回调函数
promise.then((value) => {
  console.log(value) // success
},(err) => {
  console.log(err) // 该回调函数不会执行
})

/*
  下面举个Promise对象的简单例子
*/ 
function timeout(ms) {
  return new Promise((reslove, reject) => {
    setTimeout(reslove, ms)
  })
}
timeout(1000).then(val => {
  console.log(val) // undefined res的时候没有传数据过来
})

/*
  Promise 新建后会立即执行
*/
{
let promise = new Promise((resolve, reject) => {
  console.log('promise')
  resolve()
}) 
promise.then(() => {
  console.log('resolved')
})
console.log('hi')
// promise 
// hi
// resolved
}

/*
  用Promise对象实现Ajax操作的例子
*/
const getJSON = function(url) {
  const promise = new Promise((resolve, reject) => {
    const client = new XMLHttpRequest()
    const handler = function() {
      if (this.readyState !== 4) return
      if (this.status >= 200 && this.status <= 300) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    client.open('get', url)
    client.onreadystatechange = handler
    client.responseType = 'json'
    client.setRequestHeader('Accept', 'application/json')
    client.send()
  })
  return promise
}
getJSON(url).then(res => {
  console.log('response: ', res)
}, err => {
  console.error(err)
})

// Promise.prototype.then
getJSON('/post/1.json').then(res => {
  return getJSON(res.commentUrl)
}).then(comments => {
  console.log("resolved: ", comments)
}, err => {
  console.log("error: ", err)
})

/*
  一般来说，不要在then()方法里面定义rejected状态的回调函数（即then()方法的第二个参数）
  总是使用catch()方法
*/
promise.then(value => {
  console.log(value)
}).catch(err => {
  console.log(err)
})

// Promise.prototype.finally
promise.then(value => {

}).catch(e => {

}).finally(() => {
  // 不管promise最后的状态 执行完then或catch后 一定会执行
  // finally方法的回调函数不接受任何参数
})

/*
  Promise.all()方法用于将多个Promise实例，包装成一个新的Promise实例
  const p = Promise.all([p1, p2, p3]) 
  接受一个数组作为参数，p1、p2、p3都是promise的实例，如果不是，就会调用Promise.resolve()方法将参数转为Promise实例
  p的状态有两种情况
  （1）只有p1、p2、p3的状态都变为fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数
  （2）只要p1、p2、p3之中有一个被rejected，p的状态才会变成rejected，此时第一个被jeject的实例的返回值，回传给p的回调函数
*/
const promises = [2,3,5,7,11,13].map((id) => {
  return getJSON('/post/' + id + '.json')
})
Promise.all(promises).then((posts) =>{
  // ..
}).catch(e => {
  // ..
})

/*
  Promise.race()方法同样是将多个Promise实例，包装成一个新的Promise实例
  const p = Promise.race([p1, p2, p3]) 
  上面代码中，只要p1、p2、p3之中有一个率先改变状态，p的状态就跟着改变。那个率先改变的Promise实例的值，就传给p的回调函数
  下面一个例子，如果指定时间内没有获得结果，就将Promise的状态转为reject。
*/ 
var p = Promise.race([
  fetch(url),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('request timeout'))
    }, 3000)
  })
])
p.then(data => {
  console.log(data) // 拿到数据
}).catch(e => {
  console.log(e) // request timeout
})

// Promise.resolve() 有时需要将现有对象转为Promise对象，Promise.resolve()就起到了这个作用
const jsPromise = Promise.resolve($.ajax('/whatever.json'))
/*
  (1)参数是一个promise实例，那么将不会做任何修改、原封不动的返回这个实例
  (2)参数是一个thenable对象，Promise.resolve()方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then()方法。
  (3)参数是一个原始值，或者是一个不具有then()方法的对象，则Promise.resolve()方法返回一个新的 Promise 对象，状态为resolved
  (4)参数为空，直接返回一个resolve状态的promise对象
    所以，如果希望得到一个Promise对象，比较方便的方法就是调用Promise.resolve()
*/ 

// Promise.reject(reason) 方法也会返回一个新的Promise实例，该实例的状态为rejected
var p = Promise.race([
  fetch(url),
  setTimeout(() => {
    Promise.reject(new Error('request timeout'))
  }, 3000)  
])