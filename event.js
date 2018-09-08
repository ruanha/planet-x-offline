const eventMan = {

  activePanel:undefined,

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
}
