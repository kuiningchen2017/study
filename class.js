// 在JavaScript中，生成实例对象的传统方法是通过构造函数
function Point(x, y) {
  this.x = x
  this.y = y
}
Point.prototype.toString = function() {
  return [this.x, this.y]
}
var p = new Point(1, 2)
/*
  上面这种写法跟传统的面向对象语言（C++和Java）差异很大，很容易让新学习这门语言的程序员感到困惑
  所以ES6提供了更接近传统语言的写法，引入了Class（类）这个概念，作为对象的模板。
  通过关键字class，可以定义类。
  基本上，ES6的class可以看作是一个语法糖，它的绝大部分功能，ES5都可以做到
  新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
*/
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  toString() {
    return [this.x, this.y]
  }
}
// ES6的类，完全可以看作构造函数的另一种写法
typeof Point // 'function'
Point === Point.prototype.constructor // true
// 使用的时候，也是直接对类使用new命令，跟构造函数的用法完全一致
var point = new Point(3, 4)

// 构造函数的prototype属性，在ES6的‘类’上面继续存在。
// 类的所有方法都定义在类的prototype属性上面
class Point {
  constructor() {
    // ...
  }
  toString() {}
  toValue() {}
}
// 等同于
let testText = '测试'
Point.prototype = {
  testText,
  constructor() {},
  toString() {},
  toValue() {}
}
/*
  ES6 允许在大括号里面 直接写入变量和函数，作为对象的属性和方法。
  这样的书写更加简洁
  等同于
  point.prototype = {
    testText: testText,
    constructor: function() {},
    toString: function() {},
    toValue: function() {}
  }
*/
// Object.assign(targetObj, sourceObj)静态方法将一个或多个源对象中所有可枚举的自有属性复制到目标对象
// assign方法可以很方便的一次向类添加多个方法
Object.assign(Point.prototype, {
  toString() {},
  toValue() {}
})
/*
  另外，class类的内部所有定义的方法，都是不可枚举的（non-enumberable）
  这一点，与ES5的构造函数行为不一致，构造函数定义到原型对象上的方法是可枚举的(enumberable)
*/

/*
  constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法
  一个类必须有constructor()方法，如果没有显示定义
  一个空的constructor()方法会被默认添加
  class Point {

  }
  等同于
  class Point {
    constructor() {}
  }
*/
// constructor方法默认返回实例对象（即this）
// 当然我们完全可以指定返回另外一个对象
class Foo {
  constructor() {
    // Object.create()静态方法以一个现有对象作为原型，创建一个新对象
    return Object.create(null)
  }
}
new Foo instanceof Foo // false
// 上面代码，constructor函数返回一个全新的对象，结果导致实例对象不是Foo类的实例
/*
  类class必须使用new调用，否则会报错
  这是它跟构造函数的一个主要区别，构造函数可以选择不用new调用。
*/

// es2022 为类的实例属性 规定了一种新写法
class IncreasingCounter {
  constructor() {
    this._count = 0
  }
  get value() {
    return this._count
  }
  increment() {
    this._count++
  }
}
class IncreasingCounter2022 {
  _count = 0
  get value() {
    return this._count
  }
  increment() {
    this._count++
  }
}
// 新写法定义的属性是实例自身的属性，而不是定义在实例对象的原型上面

// 取值函数（getter） 和 存值函数（setter）
class MyClass {
  constructor() {}
  get prop() {
    return 'getter prop'
  }
  set prop(value) {
    console.log('setter: ', value)
  }
}
let instance = new MyClass()
instance.prop = 123 // setter: 123
console.log(instance.prop) // 'getter prop'
// 上面代码 赋值和取值行为都被自定义了
// 存值函数和取值函数是设置在属性的Descriptor对象上的（访问器描述符：访问器描述符是由 getter/setter 函数对描述的属性）
// 这和ES5也是完全一致的
var descptior = Object.getOwnPropertyDescriptor(MyClass.prototype, 'prop')
console.log(descptior) // get set 都在这个对象上面

// 类的属性名，可以使用表达式
let methodName = 'getArea'
class Square {
  constructor() {}
  [methodName]() {}
}

// 静态方法
/*
  类相当于实例的原型，所有类中定义的方法，都会被实例继承。
  如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用。
  这就称为‘静态方法’
*/
class Foo {
  static classMethod() {
    return 'hello'
  }
}
let foo = new Foo()
foo.classMethod() // TypeError: foo.classMethod is not a function
Foo.classMethod() // hello
// 如果静态方法中包含this关键字，这个this指的是类，而不是实例

// 父类的静态方法，可以被子类继承
class Bar extends Foo {
}
Bar.classMethod() // 'hello'

// 静态属性
/*
  静态属性指的是Class类本身的属性，即Class.propName
  而不是定义在实例对象（this）上的属性
*/
Foo.prop = 1
console.log(Foo.prop) // 1
// 上面的写法为Foo类定义了一个静态属性prop
/*
  目前，只有这种方法可行，因为ES6明确规定，Class内部只有静态方法，没有静态属性
  现在有个提案提供了类的静态属性，写法是在实例属性的前面 加上 ‘static’ 关键字
  等同于以前的老写法
  class MyClass {
    ...
  }
  MyClass.myStaticProp = 100
  写在类的外面 很容易让人忽略这个静态属性，也不符合相关代码应该放在一起的代码组织原则
  另外，写法是显式声明（declarative），而不是赋值处理，语义更好
*/
class MyClass {
  static myStaticProp = 100
  constructor() {}
}

// 私有方法和私有属性
/*
  私有方法和私有属性，是只能在类的内部访问的方法和属性，外部不能访问。
  这是常见的需求，有利于代码的封装。
  但早期的ES6不提供，只能通过变通方法模拟实现
*/
// 一种做法是在命名上加以区别
class Widget {
  // 私有方法 加下划线，表示这是一个只限于内部使用的私有方法
  // 但是在类的外部，还是可以调用这个方法
  _bar(baz) {
    return this.snaf = baz
  }
  // 公有方法
  foo(baz) {
    this._bar(baz)
  }
}
// 另一种方法就是索性将私有方法移出类，因为类内部的所有方法都是对外可见的
class Widget {
  // foo是公开方法
  foo(baz) {
    // 内部调用了bar.call(this, baz) 这使得bar()实际上成为了当前类的私有方法
    bar.call(this, baz)
  }
}
function bar(baz) {
  return this.snaf = baz
}

// 还有一种方法是利用 Symbol值的唯一性，将私有方法的名字命名为一个Symbol值
const bar = Symbol('bar')
const snaf = Symbol('snaf')

class MyClass{
  // 公有方法
  foo(baz) {
    this[bar](baz)
  }
  // 私有方法
  [bar](baz) {
    return this[snaf] = baz
  }
}
/*
  上面代码中，bar和snaf都是Symbol值，一般情况下无法获取到他们
  因此达到了私有方法和私有属性的效果
  但是 Reflect.ownKeys()依然可以拿到他们
*/ 
const ins = new MyClass()
Reflect.ownKeys(MyClass.prototype) // ['constructor', 'foo', Symbol(bar)]

// 私有属性的正式写法 
// ES2022正式为class添加了私有属性，在属性名之前使用 # 表示
class IncreasingCounter2022 {
  // #count 就是私有属性，只能在类内部使用！
  #count = 0
  get value() {
    return this.#count
  }
  increment() {
    this.#count++
  }
}
// 读取一个没有定义的私有属性 会报错 而不是报undefined
// 私有方法也是在方法前面加 #
class Foo {
  #a
  #b
  constructor(a, b) {
    this.#a = a
    this.#b = b
  }
  // 私有方法
  #sum() {
    return this.#a + this.#b
  }
  printSum() {
    console.log(this.#sum)
  }
}