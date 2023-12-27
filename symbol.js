/**
  ES5的对象属性名都是字符串，这容易造成属性名的冲突。
  比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin模式）
  新的方法名字就有可能与现有方法产生冲突。
  如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突
  这就是es6引入Symbol的原因
*/
// ES6引入了一种新的原始数据类型Symbol，表示独一无二的值。
// Symbol值通过Symbol()函数生成
let s = Symbol()
typeof s // 'symbol'
// typeof 表明变量s是Symbol数据类型，而不是字符串之类的其他数据类型
/*
  注意：Symbol()函数前不能使用new命令，否则会报错
  这是因为生成的Symbol是一个原始类型的值，不是对象，所以不能使用new命令来调用
  另外 由于Symbol值不是对象，所以也不能添加属性。
  它是一种类似于字符串的数据类型
*/
// Symbol()函数可以接受一个字符串作为参数，表示对Symbol值的描述
// 主要用来区分多个Symbol值
let s1 = Symbol('foo')
let s2 = Symbol('bar')

s1 // Symbol('foo')
s2 // Symbol('bar')
// 上面代码中，如果不加参数，他们在控制台的输出都是 Symbol() 不利于区分
// 有了参数，就等于为他们加上了描述，输出的时候就能够分清，到底是哪一个值
let s3 = Symbol('bar')
s2 === s3 // false
// 注意 Symbol()函数的参数只是对当前Symbol值的描述，因此相同的参数的Symbol函数的返回值是不相等的

let s4 = Symbol()
let s5 = Symbol()
s4 === s5 // false
// 即是参数相同(或不传参数)，它们都是不相等的
// 如果调用100次Symbol()，会得到100个互不相等的值

// Symbol值不能与其他类型的值进行运算，会报错
consol.log('hello' + s1) // TypeError: can't convert symbol to string
console.log(`hello ${s1}`) // TypeError: can't convert symbol to string

// 但是 Symbol值可以显式的转为字符串
String(s1) // Symbol('foo')
s2.toString() // Symbol('bar')

// 另外，Symbol值可以转为布尔值，但是不能转为数值
Boolean(s1) // true
Number(s1) // TypeError

// Symbol.prototype.description
// ES2019提供了一个Symbol值的实例属性description，直接返回了Symbol值的描述
s1.description // 'foo'

/*
  作为对象属性名的Symbol
  由于每一个Symbol值都是不相等的，这意味着只要Symbol值作为标识符，
  用于对象的属性名，就能保证不会出现同名的属性
  这对于一个对象由多个模块构成的情况非常有用
  能防止某一个键被不小心改写或覆盖
*/ 
let mySymbol = Symbol()
let fooSymbol = Symbol('foo')
let a = {
  [mySymbol]: 'hello'
}
Object.defineProperty(a, fooSymbol, {
  value: 'world'
})
a[mySymbol] // 'hello'
a[fooSymbol] // 'world'
// 注意 Symbol值作为对象属性名时，不能用点运算符
a.mySymbol = 'hi'
a[mySymbol] // 'hello'
a[mySymbol] = 'hi'
a[mySymbol] // 'hi'

let s6 = Symbol()
let obj = {
  [s6]: function(arg) {}
}
// 可以简写为
obj = {
  [s6](arg) {}
}

