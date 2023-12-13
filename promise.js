/*
  Promise是异步编程的解决方案，比传统的解决方案 ——回调函数和事件—— 更合理更强大
*/
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
  xhr.open('get', 'https://jsonplaceholder.typicode.com/todos')
  xhr.setRequestHeader('myNewHeader', 'MyNewHeaderValue')
  xhr.send(null)
}

