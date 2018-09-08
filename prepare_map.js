// this script loads the ASCII map and transforms it to something small/useful for the game

const fs = require('fs')

fs.readFile('map.txt', 'utf8', (err, data) => {
  const map = [[]]
  if (err) throw err
  let enter = 0
  let exit = 0
  let flag = false
  let j = 0
  let column = 0
  for (let i = 0; i < data.length; i += 1) {
    if (data[i] === '\n') {
      map[j].push(['\n'])
      j += 1
      map.push([])
      flag = false
      column = -1
    } else if (data[i] !== ' ' && flag === false) {
      enter = column
      flag = true
    } else if (data[i] === ' ' && flag === true) {
      exit = column
      map[j].push([enter, exit])
      flag = false
    }
    column += 1
  }

  let output = 'const planetRLE = ['
  for (let i = 0; i<map.length; i += 1) {
    output += '[' + map[i].toString() + '],'
  }
  output += ']'
  fs.writeFile('planet2.txt', output)
  // fs.writeFile('planet2.txt', `const planetRLE = ${map.toString()}`)
})
