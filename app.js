const { app, BrowserWindow, ipcMain } = require('electron');
const artstation = require('./artstation');
const wallpaper = require('./helpers/wallpaper');
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('search', async (event, q) => {
  let res = await artstation.search(q);
  event.reply('search_result', res);
});
ipcMain.on('getArtwork', async (event, artworkPage) => {
  let res = await artstation.getArtwork(artworkPage);
  wallpaper.startWallpaperSlider(res);
  event.reply('artwork_result', res);
});
