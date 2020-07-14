const { app, BrowserWindow,ipcMain  } = require('electron')
const artstation = require('./artstation')
function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

ipcMain.on('search', async (event, q) => {
  // console.log(q) // prints "ping"
  let res = await artstation.run(q)
  event.reply('search_result', res)
})