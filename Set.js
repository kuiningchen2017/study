/*
  ES6提供了新的数据结构Set
  它类似于数组，但是成员的值都是唯一的，没有重复的值
*/ 
// Set本身是一个构造函数，用来生成Set数据结构
const s = new Set()
[2,3,5,4,5,2,2].forEach(element => {
  s.add(element)
});
for (let i of s) {
  console.log(i) // 2,3,5,4
}
// 上面代码通过add()方法向Set结构加入成员，结果表明Set结构不会添加重复的值

/*
  iterable可迭代 是数组set/map专有的，专门把本身的value遍历一遍 for..of就是专门遍历可迭代value的
  enumberable可枚举的 是对象每个key的一个属性 for..in就是专门遍历可枚举key的，缺点是会遍历到原型链上

  Set函数可以接受一个数组（或者具有iterable可迭代的接口的其他数据结构）作为参数，用来初始化
*/ 
let set = new Set([1,2,3,4,4])
console.log([...set]) // [1,2,3,4]

const items = new Set([1,2,3,4,5,5,5,5])
items.size // 5

const setDiv = new Set(document.querySelectorAll('div'))
setDiv.size // 56
// 类似于
const setDivs = new Set()
document.querySelectorAll('div').forEach(div => {
  setDivs.add(div)
})
setDivs.size // 56

// 数组去重
console.log([...new Set([1,2,3,2,1,3,4])])
// 字符串去重
console.log([...new Set('asdasdaasasfvsd')].join(''))

/*
  Set实例的属性和方法
*/
// Set结构的实例有一下属性
Set.prototype.constructor // 构造函数，默认就是Set函数
Set.prototype.size // 返回Set实例的成员总数量

/*
 Set实例的方法分为两大类：
   操作方法（用于操作数据）
   遍历方法（用于遍历成员）
*/
// 四个操作方法
Set.prototype.add // 添加某个值
Set.prototype.delete // 删除某个值
Set.prototype.has // 是否包括某个值
Set.prototype.clear // 清除所有成员
// 四个遍历方法
Set.prototype.keys // 返回键名的遍历器
Set.prototype.values // 返回键值的遍历器
Set.prototype.entries // 返回键值对的遍历器
Set.prototype.forEach // 使用回调函数遍历每个成员
/*
  需要特别指出的是，Set的遍历顺序就是插入顺序
  这个特性有时非常有用
  比如使用Set保存一个回调函数列表
  调用时就能保证按照添加顺序调用
*/ 
set = new Set(['red', 'green', 'blue'])
// 由于Set结构键名和键值是同一个值 所以keys和values方法的行为完全一致
for(let item of set.keys()) {
  console.log(item)
   // red 
   // green
   // blue
}
for(let item of set.values()) {
  console.log(item)
   // red 
   // green
   // blue
}
// entries方法返回的遍历器，同时包括键名和键值，所以每次输出一个数组，它的两个成员完全相等
for(let item of set.entries()) {
  console.log(item)
   // ['red', 'red'] 
   // ['green', 'green']
   // ['blue', 'blue']
}
// Set结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法
Set.prototype[Symbol.iterator] === Set.prototype.values // true
// 所以 可以直接用for..of循环遍历Set
for(let x of set) {
  console.log(x)
  // red 
  // green
  // blue  
}

/*
  forEach
  Set结构的实例与数组一样 也拥有forEach方法，用于对每个成员执行某种操作，没有返回值
*/ 
set.forEach((value, key) => {
  console.log(key + ' : ' + value)
  // red : red
  // green : green
  // blue : blue
})


let a = new Set([1, 2, 3])
let b = new Set([2, 3, 4])

// 并集
let union  = new Set([...a, ...b])
// 交集
let intersect = new Set([...a].filter(x => b.has(x)))
// 差集
let difference = new Set([...a].filter(x => !b.has(x)))

// WeakSet
// 与Set结构类似，但是有两个区别
// 首先 WeakSet的成员只能是对象和Symbol的值，不能是其他类型的值
// WeakSet中的对象都是弱引用