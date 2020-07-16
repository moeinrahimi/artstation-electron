//TODO: select one and set as bg
//TODO: select multiple and create slideshow
//TODO: download full image size
//TODO: random images slideshow
const { ipcRenderer, shell } = require('electron');
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

let search = document.querySelector('.searchInput');
const searchWallpaper = debounce(function (e) {
  let query = e.target.value;
  if (!query) return;
  console.log(query);
  ipcRenderer.send('search', query);
  document.querySelector('.loading').classList.add('show');
}, 1000);
search.addEventListener('keyup', searchWallpaper);
ipcRenderer.on('search_result', (event, images) => {
  let items = images
    .map((image) => {
      return `<div class="item" >
      <div class="overlay" data-artwork="${image.artwork}">
        <button class="artstationPage">artstation page</button>
        <button class="setBG">set as background</button>
        </div>
      <img src="${image.thumbnail}" />
      </div>`;
    })
    .join('');
  document.querySelector('.loading').classList.remove('show');
  document.querySelector('.results').innerHTML = items;
  function getWallpaper(e) {
    ipcRenderer.send('getArtwork', e.currentTarget.parentElement.dataset.artwork);
    document.querySelector('.loading').classList.add('show');
    ipcRenderer.on('artwork_result', (event, artworks) => {
      document.querySelector('.loading').classList.remove('show');
      let slideshowHTML = artworks
        .map((artwork) => {
          return `
        <div class="item">
          <img src="${artwork}"/>
          </div>`;
        })
        .join('');
      document.querySelector('.slideshow').classList.add('active');
      document.querySelector('.slideshow').innerHTML = slideshowHTML;
    });
  }
  let items1 = document.querySelectorAll('.setBG');
  items1.forEach((item) => item.addEventListener('click', getWallpaper));
  let artworkPages = document.querySelectorAll('.artstationPage');
  artworkPages.forEach((item) => item.addEventListener('click', openArtworkPage));
  function openArtworkPage(e) {
    let url = e.currentTarget.parentElement.dataset.artwork;
    shell.openExternal(url);
  }
});
