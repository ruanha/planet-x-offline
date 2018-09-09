'use strict'

const messages = {
  intro: 'starship has crashed on a strange planet',
  intro2: 'all systems are offline',
  resources: 'not enough resources',
  dead: 'explorer is lost, it\'s a harsh new world',
}
const enemyLvl1 = {
  health: 5,
  damage: 1,
  delay: 1500,
  weaponIcon: '-',
  icon: '@enemy',
  loot: { rare: 2, energy: 5 },
}
const base = {
  y: 21, // 21
  x: 46, // 46
  symbol: 'S',
  energy: 0,
  metals: 0,
  rare: 0,
  droids: { idle: 0, reactor: 0, extractor: 0 },
}
const explorer = {
  alive: false,
  y: 21,
  x: 46,
  symbol: '@',
  active: false,
  energy: 0,
  energyMax: 15,
  shield: 0,
  shieldMax: 0,
  droids: 0,
  cargo: 0,
  cargoMax: 20,
  health: 10,
  healthMax: 10,
}
const markers = {
  S: [[base.y, base.x]],
  H: [[32, 33], [27, 34], [25, 36], [20, 62], [22, 64], [26, 61], [21, 68],
    [16, 70], [26, 69], [26, 76], [29, 76], [22, 78], [28, 81], [26, 85],
    [33, 88], [36, 90], [39, 92], [37, 94], [38, 100], [38, 103], [33, 106],
    [29, 108], [27, 110], [24, 114], [28, 117], [39, 110], [26, 105], [23, 104],
    [18, 75], [42, 107], [55, 120], [53, 70], [51, 74], [44, 78], [39, 64],
    [36, 57], [32, 58], [31, 26], [35, 29], [39, 33], [39, 41], [54, 43], [30, 21],
    [27, 17], [47, 34], [56, 35], [58, 40]],
  E: [[19, 51], [28, 24], [15, 61]],
  R: [[27, 47], [11, 44], [26, 21], [47, 37]],
  M: [[51, 37]],
  B: [[7, 47], [33, 24], [38, 70]],
}

function typeWritter(txt, t = 0) {
  let tw = t
  if (tw < txt.length) {
    document.getElementById('messages').innerHTML += txt.charAt(tw)
    tw += 1
    setTimeout(typeWritter, 50, txt, tw)
  } else { document.getElementById('messages').innerHTML += '<br>' }
}

typeWritter(messages.intro)
setTimeout(typeWritter, 2500, messages.intro2)

function getById(Element) {
  return document.getElementById(Element)
}

function showBtn(btnId) {
  document.getElementById(btnId).style.visibility = 'visible'
}

/* ALL BUTTONS ARE DECLARED HERE */
const rrBtn = getById('restart-reactor')
const reBtn = getById('restart-extractor')
const dfBtn = getById('droid-factory')
const wrBtn = getById('work-reactor')
const weBtn = getById('work-extractor')
const bdBtn = getById('work-droid')
const drBtn = getById('droid-reactor')
const deBtn = getById('droid-extractor')
const ubBtn = getById('upgrade-battery')
const usBtn = getById('upgrade-shield')
const uwBtn = getById('upgrade-weapon')
const beBtn = getById('build-explorer')
const deployBtn = getById('deploy')
const eexBtn = getById('load-energy')
const dexBtn = getById('load-droids')

/* world map */
const planet = getById('planet-x')
const map = []

for (let i = 0; i < planetRLE.length; i += 1) {
  /* eslint-disable no-undef */
  map.push([])
  let flag = false
  let index = 0
  planetRLE[i].unshift(0)
  planetRLE[i].push(135)
  for (let j = 0; j < planetRLE[i][planetRLE[i].length - 1]; j += 1) {
    if (planetRLE[i][index] === j) {
      flag = !flag
      index += 1
    }
    map[i].push((flag) ? { symbol: '\u00A0' } : { symbol: '·' })
    map[i][j].y = i
    map[i][j].x = j
    map[i][j].connected = false
  }
}
function insertMarkers() {
  // loop throughmarkers object and input them in map[y][x]
  Object.entries(markers).forEach((entry) => {
    const key = entry[0]
    const coords = entry[1]
    coords.forEach((coord) => {
      map[coord[0]][coord[1]].symbol = key
    })
  })
}
insertMarkers()

function validY(y) {
  return (y >= map.length || y < 0) ? false : y
}
function validX(x) {
  if (x >= map[0].length) {
    return x - map[0].length
  }
  if (x < 0) {
    return x + map[0].length - 1
  }
  return x
}
function drawMap() {
  for (let lat = 0; lat < map.length; lat += 1) {
    const row = document.createElement('p')
    row.setAttribute('class', 'latitude')
    row.setAttribute('id', lat)
    for (let lon = 0; lon < map[0].length; lon += 1) {
      row.innerHTML += map[lat][lon].symbol
    }
    planet.appendChild(row)
  }
}

const center = { x: 33, y: 33 }
function display(dx = 0) {
  const radius = 33 // 37
  const lats = planet.getElementsByTagName('p')
  for (let i = 0; i < map.length; i += 1) {
    let rowHTML = ''
    for (let j = 0; j < map.length; j += 1) {
      if (((i - center.x) ** 2) + ((j - center.y) ** 2) <= radius ** 2) {
        let x = explorer.x + dx - center.x + j
        let y = i
        x = validX(x)
        y = validY(y)
        // let symbol = ( map[y][x].visible )?  map[y][x].symbol:String.fromCharCode(178);
        let symbol = (true) ? map[y][x].symbol : String.fromCharCode(178)
        symbol = (map[y][x].exp) ? explorer.symbol : symbol
        rowHTML += symbol
      } else {
        rowHTML += '\u00A0'
      }
    }
    lats[i].innerHTML = `${rowHTML}</span>`
  }
}
function explorerUpdate() {
  getById('explorer-energy').innerHTML = `energy: ${explorer.energy}/${explorer.energyMax}`
  getById('explorer-droids').innerHTML = `droids: ${explorer.droids}/${explorer.cargoMax}`
}
function canMove() {
  if (explorer.energy > 0) {
    return true
  }
  return false
}
function initExplorer() {
  explorer.x = base.x
  explorer.y = base.y
  explorer.health = explorer.healthMax
  explorer.energy = 0
  explorer.droids = 0
  explorer.torpedos = 0
  explorer.active = false
}
function deadByEnergy() {
  map[explorer.y][explorer.x].exp = false
  planet.classList.toggle('fade')
  typeWritter(messages.dead)
  initExplorer()
}
const network = { [`${base.y} ${base.x}`]: base }

function addToNetwork(tile) {
  network[`${tile.y} ${tile.x}`] = tile
}
function getNearestHub(tile) {
  let smallestDist
  let nearest = ''
  const keys = Object.keys(network)
  console.log(keys)
  keys.forEach((key) => {
    if (network.hasOwnProperty(key)) {
      console.log(key)
      const dist = Math.sqrt(((network[key].x - tile.x) ** 2) + ((network[key].y - tile.y) ** 2))
      if (!smallestDist) {
        smallestDist = dist
        nearest = key
      } else {
        if (dist < smallestDist) {
          smallestDist = dist
          nearest = key
        }
      }
    }
  })
  // console.log(smallestDist, network[nearest])
  return nearest
}
function connectToBase(tile, hub) {
  if ((tile.y === hub.y && tile.x === hub.x) || tile.symbol === '-'
    || tile.symbol === '|') {
    return true
  }
  if (tile.y < hub.y) {
    tile.symbol = (tile.symbol === '·' || tile.symbol === '\u00A0') ? '|' : tile.symbol
    return connectToBase(map[tile.y + 1][tile.x], hub)
  }
  if (tile.y > hub.y) {
    tile.symbol = (tile.symbol === '·' || tile.symbol === '\u00A0') ? '|' : tile.symbol
    return connectToBase(map[tile.y - 1][tile.x], hub)
  }
  if (tile.x < hub.x) {
    tile.symbol = (tile.symbol === '·' || tile.symbol === '\u00A0') ? '-' : tile.symbol
    return connectToBase(map[tile.y][tile.x + 1], hub)
  }
  if (tile.x > hub.x) {
    tile.symbol = (tile.symbol === '·' || tile.symbol === '\u00A0') ? '-' : tile.symbol
    return connectToBase(map[tile.y][tile.x - 1], hub)
  }
}
function hiveDefated(tile) {
  // tile is a reference to the active map-tile at map[y][x]
  const hub = network[getNearestHub(tile)]
  tile.symbol = 'X'
  connectToBase(tile, hub)
  addToNetwork(tile)
  display()
}
function energyMineEstablished(tile) {
  const hub = network[getNearestHub(tile)]
  connectToBase(tile, hub)
  addToNetwork(tile)
  display()
}
function energyMine(tile) {
  if (!tile.connected) {
    eventMan.establishMine(tile, explorer, 'Energy', energyMineEstablished)
  }
}
function rareMineEstablished(tile) {
  const hub = network[getNearestHub(tile)]
  connectToBase(tile, hub)
  addToNetwork(tile)
  display()
}
function rareMine(tile) {
  if (!tile.connected) {
    eventMan.establishMine(tile, explorer, 'Rare', rareMineEstablished)
  }
}
function youWin() {
  // reveal map
  game.pause()
  setInterval(() => {
    explorer.x = validX(explorer.x - 1)
    for (let i = 0; i < map.length; i += 1) {
      if (map[i][explorer.x].symbol === 'H') {
        const tile = map[i][explorer.x]
        tile.symbol = '\u00A0'
        setTimeout(() => {
          tile.symbol = 'X'
          display(0)
        }, 50, tile)
      }
    }
    display(0)
  }, 500)
  eventMan.gameOver()
}
const beaconIndex = []
function initBeacon(tile) {
  const beaconNumber = beaconIndex.length
  if (beaconNumber <= 2) {
    const beacon = document.getElementById(`beacon${beaconNumber + 1}`)
    beacon.textContent = 'online'
    beacon.classList.add('active')
    beaconIndex.push(beacon)
    connectToBase(tile, base)
    tile.symbol = 'O'
    display()
  }
  if (beaconNumber === 2) {
    youWin()
  }
}
function hiveFight(tile) {
  hiveDefated(tile)
}

function tileAction(tile) {
  if (canMove()) {
    console.log(tile.y, tile.x)
    //explorer.energy -= 1
    explorerUpdate()
    switch (tile.symbol) {
      case 'S':
        explorer.active = false
        map[base.y][base.x].symbol = base.symbol
        map[explorer.y][explorer.x].exp = false
        explorer.health = explorer.healthMax
        break
      case 'H':
        hiveFight(tile)
        break
      case 'E':
        energyMine(tile)
        break
      case 'R':
        rareMine(tile)
        break
      case '-':
        explorer.energy += 1
        break
      case '|':
        explorer.energy += 1
        break
      case 'B':
        initBeacon(tile)
        break
      default:
        break
    }
  } else {
    deadByEnergy()
  }
}

document.onkeypress = (e) => {
  if (explorer.active) {
    map[explorer.y][explorer.x].exp = false
    let dx = 0
    switch (e.keyCode) {
      case 38:
        explorer.y = validY(explorer.y - 1) || explorer.y
        break
      case 40:
        explorer.y = validY(explorer.y + 1) || explorer.y
        break
      case 37:
        explorer.x = validX(explorer.x - 1)
        dx -= 1
        break
      case 39:
        explorer.x = validX(explorer.x + 1)
        dx += 1
        break
      default:
        break
    }
    // console.log(explorer.y, explorer.x)
    map[explorer.y][explorer.x].exp = true
    tileAction(map[explorer.y][explorer.x])
    display(dx)
  }
}

const game = {
  on: true,
  pause() {
    game.on = false
    explorer.active = false
  },

  resume() {
    game.on = true
    explorer.active = true
  },
}

function updateAllPanels() {
  getById('resource-droids').innerHTML = `avaiable droids: ${base.droids.idle}`
  getById('resource-metals').innerHTML = `metals: ${base.metals}`
  getById('resource-energy').innerHTML = `energy: ${base.energy}`
  getById('resource-rare').innerHTML = `rare: ${base.rare}`
  getById('explorer-droids').innerHTML = `droids: ${explorer.droids}/${explorer.cargoMax}`
  getById('explorer-energy').innerHTML = `energy: ${explorer.energy}/${explorer.energyMax}`
}
function offbase() {
  Object.keys(network).forEach((key) => {
    if (network[key].symbol === 'E') {
      base.energy += 1
    } else if (network[key].symbol === 'R') {
      base.rare += 1
    } else if (network[key].symbol === 'M') {
      base.metals += 1
    }
  })
  updateAllPanels()
}
updateAllPanels()
setInterval(() => {
  offbase()
}, 10000)
setInterval(() => {
  if (game.on) {
    if (base.droids.reactor) { wrBtn.click() }
    if (base.droids.extractor) { weBtn.click() }
  }
}, 10)

function cooldown(time, button, btnText, callback) {
  /* eslint-disable no-param-reassign, no-shadow, consistent-return */
  const fullTime = time;
  (function recursive(time, fullTime, button, btnText, callback) {
    if (time <= 0) {
      button.textContent = btnText
      const percentage = 0
      const linearGradient = `linear-gradient(to right, gray, gray ${percentage}%, transparent ${percentage}%)`

      button.style.backgroundImage = linearGradient
      button.style.opacity = '1'
      callback[0](...callback.slice(1))
      return time
    }
    const percentage = (time / fullTime) * 100
    const linearGradient = `linear-gradient(to right, rgba(0, 0, 0, 0.35) ${percentage}%, rgba(0, 0, 0, 0) ${percentage}%)`
    button.style.backgroundImage = linearGradient
    button.style.opacity = '0.5'
    setTimeout(() => recursive(time - 10, fullTime, button, btnText, callback), 10)
  }(time, fullTime, button, btnText, callback))
}
function restartReactor() {
  if (rrBtn.className === 'btn active') {
    rrBtn.classList.remove('active')
    cooldown(5000, rrBtn, 'reactor online', [showBtn, 'work-reactor'])
  }
}
function restartExtractor() {
  if (reBtn.className === 'btn active') {
    reBtn.classList.remove('active')
    cooldown(10000, reBtn, 'extractor online', [showBtn, 'work-extractor'])
  }
}
function restartFactory() {
  if (dfBtn.className === 'btn active') {
    dfBtn.classList.remove('active')
    cooldown(20000, dfBtn, 'factory online', [showBtn, 'work-droid'])
  }
}
function reactivate(btn) {
  btn.classList.add('active')
}
function workReactor() {
  if (wrBtn.className === 'btn active') {
    wrBtn.classList.remove('active')
    cooldown(100, wrBtn, 'extract energy', [reactivate, wrBtn])
    setTimeout(() => {
      base.energy += 1
      updateAllPanels()
    }, 100)
  }
}
function workExtractor() {
  if (weBtn.className === 'btn active') {
    weBtn.className = 'btn'
    cooldown(10000, weBtn, 'extract metals', [reactivate, weBtn])
    setTimeout(() => {
      base.metals += 1
      updateAllPanels()
    }, 10000)
  }
}
function buildDroid() {
  if (bdBtn.className === 'btn active') {
    bdBtn.className = 'btn'
    cooldown(200, bdBtn, 'build droid', [reactivate, bdBtn])
    setTimeout(() => {
      base.droids.idle += 1
      updateAllPanels()
    }, 200)
  }
}
function droidReactor() {
  if (drBtn.className === 'btn active') {
    if (base.droids.idle) {
      drBtn.className = 'btn'
      base.droids.reactor = 1
      base.droids.idle -= 1
      updateAllPanels()
    } else {
      typeWritter(messages.resources)
    }
  }
}
function droidExtractor() {
  if (deBtn.className === 'btn active') {
    if (base.droids.idle) {
      deBtn.className = 'btn'
      base.droids.extractor = 1
      base.droids.idle -= 1
      updateAllPanels()
    } else {
      typeWritter(messages.resources)
    }
  }
}
function buildExplorer() {
  cooldown(30, beBtn, 'build', [() => {
    deployBtn.style.visibility = 'visible'
    explorer.alive = true
    planet.classList.toggle('fade')
  }, beBtn])
}
function deploy() {
  if (explorer.alive) {
    explorer.active = true
  }
}
function upgBattery() {
  if (ubBtn.className === 'btn active') {
    const levels = [15, 30, 100]
    const cooldowns = [10000, 25000, 60000]
    const lvlRoman = ['I', 'II', 'III']
    cooldown(cooldowns[upgBattery.level], ubBtn, `battery ${lvlRoman[upgBattery.level]}`, [() => {
      explorer.energyMax = levels[upgBattery.level]
      upgBattery.level += 1
      if (upgBattery.level === 3) {
        ubBtn.classList.remove('active')
      }
    }, ubBtn])
  }
}
upgBattery.level = 0

function upgShield() {
  if (usBtn.className === 'btn active') {
    const levels = [5, 10, 15]
    const cooldowns = [100, 250, 600]
    const lvlRoman = ['I', 'II', 'III']
    cooldown(cooldowns[upgShield.level], usBtn, `shield ${lvlRoman[upgShield.level]}`, [() => {
      explorer.shieldMax = levels[upgShield.level]
      upgShield.level += 1
      if (upgShield.level === 3) {
        usBtn.classList.remove('active')
      }
    }, usBtn])
  }
}
upgShield.level = 0

function upgWeapon() {
  cooldown(10000, uwBtn, 'weapon II', [() => {
  }, uwBtn])
}
function energyExplorer() {
  if (base.energy && explorer.energy < explorer.energyMax) {
    explorer.energy += 1
    base.energy -= 1
  }
  updateAllPanels()
}
function droidsExplorer() {
  if ((base.droids.idle) && (explorer.cargo < explorer.cargoMax)) {
    explorer.droids += 1
    base.droids.idle -= 1
  }
  updateAllPanels()
}

rrBtn.addEventListener('click', restartReactor)
reBtn.addEventListener('click', restartExtractor)
dfBtn.addEventListener('click', restartFactory)
wrBtn.addEventListener('click', workReactor)
weBtn.addEventListener('click', workExtractor)
bdBtn.addEventListener('click', buildDroid)
drBtn.addEventListener('click', droidReactor)
deBtn.addEventListener('click', droidExtractor)
beBtn.addEventListener('click', buildExplorer)
ubBtn.addEventListener('click', upgBattery)
usBtn.addEventListener('click', upgShield)
uwBtn.addEventListener('click', upgWeapon)
deployBtn.addEventListener('click', deploy)
eexBtn.addEventListener('click', energyExplorer)
dexBtn.addEventListener('click', droidsExplorer)

drawMap()
display()
