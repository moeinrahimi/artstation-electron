const fs = require('fs');
const path = require('path');
var request = require('request');
const wallpaper = require('wallpaper');
const { app } = require('electron');

let iterateNumber = 0;
let timer;

async function startWallpaperSlider(images = []) {
  if (images.length == 0) return false;
  let downloads = images.map((artwork) => {
    return downloadImage(artwork);
  });
  let result = await Promise.all(downloads);
  // console.log(result);
  if (timer) clearInterval(timer);
  iterateNumber = 0;
  timer = setInterval(setWallpaper, 30000, result);
}

function setWallpaper(files) {
  let limit = files.length;
  if (iterateNumber == limit) iterateNumber = 0;
  wallpaper.set(files[iterateNumber],{scale:'fit'});
  iterateNumber += 1;
}

function download(uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

async function downloadImage(url) {
  let random = Math.floor(Math.random(10000) * 1000);
  let imageName = `${random}.jpg`;
  let basePath = path.dirname(require.main.filename || process.mainModule.filename )
  if(app.isPackaged) basePath = process.resourcesPath
  const fpath = path.resolve(
    basePath,
    'images',
    imageName
  );
  return new Promise((resolve, reject) => {
    download(url, fpath, function (res) {
      resolve(fpath);
    });
  });
}

module.exports = {
  startWallpaperSlider,
};
