const fs = require('fs');
const path = require('path');
var request = require('request');
const wallpaper = require('wallpaper');
let iterateNumber = 0;
let timer;

async function startWallpaperSlider(images = []) {
  if (images.length == 0) return false;
  let downloads = images.map((artwork) => {
    return downloadImage(artwork);
  });
  let result = await Promise.all(downloads);
  console.log(result);
  if (timer) clearInterval(timer);
  iterateNumber = 0;
  timer = setInterval(setWallpaper, 3000, result);
}

function setWallpaper(files) {
  let limit = files.length;
  if (iterateNumber == limit) iterateNumber = 0;
  wallpaper.set(files[iterateNumber]);
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
  const fpath = path.resolve(
    path.dirname(require.main.filename || process.mainModule.filename),
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
