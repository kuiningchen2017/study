let number = 1234567890
function mounyFormat(number) {
  let numberArr = String(number).split('')
  let arrayNew = []
  let numStr = ''
  let count = 0
  for(var i = numberArr.length - 1; i >= 0; i--) {
    count++
    numStr = numStr + numberArr[i]
    // 每隔三位数push进一个','号
    if (!(count % 3)) {
      arrayNew.push(numStr)
      arrayNew.push(',')
      numStr = ''
      count = 0
    }
    if (i === 0 && count < 3) {
      arrayNew.push(numStr)
    }
  }
  return arrayNew.reverse().join('')
}

console.log(mounyFormat(number))