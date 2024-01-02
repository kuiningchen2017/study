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
/*
  ES6规定Promise是一个构造函数，用来生成promise实例
  promise接受一个函数作为参数，该函数的两个参数分别是两个函数，resolve和reject
*/
var promise = new Promise((resolve, reject) => {
  // ... some code
  if (true) { /* 异步操作成功 */
    // resolve函数的作用 将Promise对象的状态从'未完成'变成'成功'
    // 然后它是在异步操作成功时调用，并将异步操作的结果作为参数传递出去
    resolve('success') 
  } else {
    // reject函数的作用是 将Promise对象的状态从'未完成'变成'失败'
    // 然后它是在异步操作失败时调用，并将异步操作报出的错误作为参数传递出去
    reject('fail')
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

// 异步加载图片的例子
function loadImageAsync(url) {
  return new Promise((resolve, reject) => {
    /*
      var myImage = new Image(100, 200);
      myImage.src = "picture.jpg";
      document.body.appendChild(myImage);
    */
    const image = new Image()
    // onload 加载完成的回调函数
    image.onload = function() {
      resolve(image)
    }
    image.onerror = function() {
      reject(new Error('Could not load image at ' + url))
    }
    image.src = url
  })
}
loadImageAsync('https://p7.itc.cn/images01/20201104/87d0aa991d454770813dcb01260c2ed0.jpeg')
  .then(response => {
    // response <img src='https://p7.itc.cn/images01/20201104/87d0aa991d454770813dcb01260c2ed0.jpeg'>
    console.log('response: ', response)
  }).catch(error => {
    console.log('error: ', error)
  })

// reject函数的参数通常是Error对象的实例
/*
  一般来说，调用resolve或reject后，Promise的使命就完成了，后继操作应该放到then方法里面，而不应该直接卸载resolve或reject后面
  所以，最好在他们前面加上return语句 return resolve(xxx)
*/
new Promise((resolve, reject) => {
  resolve(1)
  console.log(2)
}).then(res => {
  console.log(res)
})
// 2
// 1


/*
  用Promise对象实现Ajax操作的例子
  getJSON是对 XMLHttpRequest 对象的封装
  用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个Promise对象
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
  const promise2 = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url)
    xhr.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status <= 300) {
          resolve(this.responese)
        } else {
          reject(new Error(this.statusText))
        }
      }
    }
    xhr.responseType = 'json'
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.send()
  })
  return promise
}
getJSON(url).then(res => {
  console.log('response: ', res)
}, err => {
  console.error(err)
})


// Promise.prototype.then()
/*
  Promise的实例具有then方法，也就是说，then方法定义在原型对象Promise.prototype上的
  它的作用是为Promise实例添加状态改变时的回调函数。
*/
// 采用链式调用then 第一个then方法指定的回调函数返回的又是一个Promise对象
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
  理由是 这种写法可以捕获前面then方法执行中的错误，也更接近同步的写法（try/catch）
*/
promise.then(value => {
  console.log(value)
}).catch(err => {
  console.log(err)
})

/*
  下面这个函数产生的Promise对象，内部有语法错误，浏览器运行到这一行，会打印出错误
  ReferenceError：x is not defined
  但是不会退出进程、终止脚本执行，2秒之后还是会输出123
  这就是说Promise内部的错误不会影响到Promise外部的代码
  通俗的说法就是‘Promise会吃掉错误’
*/
const someAsyncThing = function() {
  return new Promise((resolve, reject) => {
    resolve(x + 2) // 这一行会报错 因为x is not defined没有声明
  })
}
someAsyncThing().then(() => {
  console.log('everything is great')
}).catch(err => {
  console.log('error: ', err) // ReferenceError: x is not defined
})
setTimeout(() => {console.log(123), 2000})


// Promise.prototype.finally
/*
  finally方法的回调函数不接受任何参数,这意味着没有办法知道
  前面的Promise状态到底是fulfilled还是rejected
  这表明，finally方法里面的操作，应该是与状态无关的，不依赖于Promise的执行结果
*/
server.listen(port)
.then(() => {
  // ... 最后使用finally关闭服务器
}).finally(server.stop)

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
  （2）只要p1、p2、p3之中有一个被rejected，p的状态就会变成rejected，此时第一个被jeject的实例的返回值，回传给p的回调函数
*/
const promises = [2,3,5,7,11,13].map((id) => {
  return getJSON('/post/' + id + '.json')
})
// 只有6个promise的状态都变为fullfiled或者其中一个变为rejected，才会调用all后面的回调函数
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