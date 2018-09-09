const NUMBER_OF_CELLS = 6

const enemy = {
  health: 5,
  damage: 3,
  delay: 1500,
  weaponIcon: '-',
  icon: '@enemy',
  loot: { rare: 2, energy: 5 },
}


const eventMan = {

  activePanel: undefined,

  gameOver() {
    const panels = document.getElementsByClassName('hideit')
    for (let i = 0; i < panels.length; i += 1) {
      console.log(panels[i])
      panels[i].style.visibility = 'hidden'
    }
    const eventPanel = document.createElement('div')
    eventPanel.setAttribute('id', 'event')
    eventPanel.setAttribute('data-legend', '')
    document.getElementById('container').appendChild(eventPanel)

    const title = 'All systems online!'
    const text = 'Another alien world conquered.'
      + 'With the beacons online this world quickly falls.'

    const box = document.getElementById('event')
    box.textContent = text
    box.setAttribute('data-legend', title)

    eventMan.activePanel = eventPanel
  },

  closeButton() {
    if (!eventMan.hasOwnProperty('closeBtn')) {
      eventMan.closeBtn = document.createElement('div')
      eventMan.closeBtn.setAttribute('id', 'close-button')
      eventMan.closeBtn.setAttribute('class', 'btn active')
      eventMan.closeBtn.textContent = 'close'
      eventMan.closeBtn.addEventListener('click', eventMan.closePanel)
    }
  },

  closePanel() {
    if (eventMan.closeBtn.className === 'btn active') {
      eventMan.activePanel.parentNode.removeChild(eventMan.activePanel)
      game.resume()
    }
  },

  establishMine(tile, explorer, type, callback) {
    game.pause()
    const eventPanel = document.createElement('div')
    eventPanel.setAttribute('id', 'event')
    eventPanel.setAttribute('data-legend', '')
    document.getElementById('container').appendChild(eventPanel)


    const title = `Found a source of ${type}!`
    const text = `You have found a source of ${type}. You can set up a mining
      operation by unloading droids from the explorer`

    const box = document.getElementById('event')
    box.textContent = text
    box.setAttribute('data-legend', title)

    const midPanel = document.createElement('div')
    midPanel.setAttribute('id', 'event-mid-panel')

    const unload = document.createElement('div')
    unload.setAttribute('class', 'btn')
    unload.textContent = 'unload droid'
    unload.addEventListener('click', () => {
      if (unload.className === 'btn active' && explorer.droids > 0) {
        explorer.droids -= 1
        callback(tile)
        unload.className = 'btn'
      }
    })
    if (explorer.droids > 0) {
      unload.classList.add('active')
    }
    midPanel.appendChild(unload)

    const bottomPanel = document.createElement('div')
    bottomPanel.setAttribute('id', 'event-bottom-panel')
    eventMan.closeButton()
    bottomPanel.appendChild(eventMan.closeBtn)

    box.appendChild(midPanel)
    box.appendChild(bottomPanel)

    eventMan.activePanel = eventPanel
  },

  displayFight(panel) {
    const explorerHealthBar = document.createElement('div')
    explorerHealthBar.setAttribute('id', 'explorer-health-bar')
    explorerHealthBar.textContent = `health ${explorer.health} / ${explorer.healthMax}`

    const enemyHealthBar = document.createElement('div')
    enemyHealthBar.setAttribute('id', 'enemy-health-bar')
    enemyHealthBar.textContent = `health ${enemy.health}`

    let explorerShield = document.createElement('div')
    explorerShield.setAttribute('id', 'explorer-shield')
    explorerShield.textContent = `shield ${explorer.shield} / ${explorer.shieldMax}`

    // TABLE IT
    const table = document.createElement('table')
    table.setAttribute('id', 'fight-table')
    const row = document.createElement('tr')
    const cellExplorer = document.createElement('td')
    cellExplorer.setAttribute('id', 'battle-player-icon')
    cellExplorer.textContent = `@explorer ${explorer.displayShield()}`

    row.appendChild(cellExplorer)

    for (let i = 0; i < NUMBER_OF_CELLS; i += 1) {
      const cell = document.createElement('td')
      cell.setAttribute('id', `cell-${i}`)
      cell.setAttribute('class', 'ground-cells')
      row.appendChild(cell)
    }

    const cellEnemy = document.createElement('td')
    cellEnemy.setAttribute('id', 'battle-enemy-icon')
    cellEnemy.textContent = '@enemy'

    row.appendChild(cellEnemy)

    table.appendChild(row)
    panel.appendChild(explorerHealthBar)
    panel.appendChild(enemyHealthBar)
    panel.appendChild(explorerShield)
    panel.appendChild(table)
    return panel
  },

  battleButtons(panel) {
    weapon = document.createElement('div')
    weapon.textContent = fire

    const availableBattleButtons = []

    if (explorer.maxShield) {
      availableBattleButtons.push(chargeShield)
    }
    if (fireWeapon) {
      availableBattleButtons.push(fireWeapon)
    }
    if (explorer.plasma) {
      availableBattleButtons.push(plasmaWeapon)
    }
    if (explorer.slowdown) {
      availableBattleButtons.push(slowdown)
    }

    for (let i = 0; i < availableBattleButtons.length; i += 1) {
      panel.appendChild(availableBattleButtons[i])
    }    

    return panel
  },

  fight(tile, explorer, callback) {
    game.pause()
    const title = 'A hive full of hideous aliens'
    const text = 'You enter a hive. Millions of alien creatures reside here. Get ready to fight'

    const eventPanel = document.createElement('div')
    eventPanel.setAttribute('id', 'event')
    eventPanel.setAttribute('data-legend', title)
    eventPanel.textContent = text

    let topPanel = document.createElement('div')
    topPanel.setAttribute('id', 'event-top-panel')
    topPanel = eventMan.displayFight(topPanel)

    let midPanel = document.createElement('div')
    midPanel.setAttribute('id', 'event-mid-panel')

    let bottomPanel = document.createElement('div')
    bottomPanel.setAttribute('id', 'event-bottom-panel')
    eventMan.closeButton()
    eventMan.closeBtn.setAttribute('class', 'btn')
    bottomPanel.appendChild(eventMan.closeBtn)

    eventPanel.appendChild(topPanel)
    eventPanel.appendChild(midPanel)
    eventPanel.appendChild(bottomPanel)

    eventMan.activePanel = eventPanel
    document.getElementById('container').appendChild(eventPanel)
  },

  animation(icon, shooter, speed) {
    let cellIndex = (shooter === '@explorer') ? 0 : NUMBER_OF_CELLS - 1
    function recursive() {
      /* eslint-disable no-else-return */
      if (shooter === '@explorer') {
        // end recursive condition for @explorer
        if (cellIndex === NUMBER_OF_CELLS) {
          // end animation, assert damage, dead?
          eventMan.clearCell(cellIndex - 1, icon)
          return true
        } else {
          if (cellIndex > 0) {
            eventMan.clearCell(cellIndex - 1, icon)
          }

          let cell = document.getElementById(`cell-${cellIndex}`)
          cell.textContent = icon
          setTimeout(recursive, speed, icon, shooter, cellIndex + 1, speed)
        }
      } else {
        cellIndex -= 1
        // end recursive condition for @enemy
        if (cellIndex === 0) {
          // end animation, assert damage, dead?
          eventMan.clearCell(cellIndex + 1, icon)
          return true
        } else {
          if (cellIndex < NUMBER_OF_CELLS - 1) {
            eventMan.clearCell(cellIndex + 1, icon)
          }
          let cell = document.getElementById(`cell-${cellIndex}`)
          cell.textContent = icon
          setTimeout(recursive, speed, icon, shooter, cellIndex, speed)
        }
      }
    }
    recursive(icon, shooter, cellIndex, speed)
  },

  enemyAttack() {
    eventMan.animation(enemy.weaponIcon, enemy.icon, 200)
    setTimeout(() => {
      if (explorer.shield > 0) {
        explorer.shield -= enemy.damage
        document.getElementById('explorer-shield').textContent = `shield ${explorer.shield}/${explorer.shieldMax}`
        document.getElementById('battle-player-icon').textContent = `@explorer ${explorer.displayShield()}`
      } else {
        explorer.health -= enemy.damage
        console.log(explorer.health, enemy.damage)
        document.getElementById('explorer-health-bar').textContent = `health ${explorer.health}/${explorer.healthMax}`
      }
      // Is dead?
      if (explorer.health <= 0) {
        clearInterval(enemy.interval)
        eventMan.closeBtn.className = 'btn active'
        eventMan.closePanel()
        playerDead()
      }
    }, 200 * 6)
  },

  playerAttack(damage) {
    if (damage === 'slow') {
      enemy.delay = Math.round(enemy.delay * 3)
      clearInterval(enemy.interval)
      enemy.interval = setInterval(eventMan.enemyAttack, enemy.delay)
    } else {
      enemy.hitPoints -= damage
      if (enemy.hitPoints <= 0) {
        eventMan.enemyDead()
      } else {
        document.getElementById('enemy-health-bar').textContent = `health ${enemy.hitPoints}`
      }
    }
  },

  clearCell(cellIndex, icon) {
    const cell = document.getElementById(`cell-${cellIndex}`)
    const content = cell.textContent
    cell.textContent = (content === icon) ? '' : content
  },
}
