const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []


function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id ="${item.id}">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id ="${item.id}">X</button>
        </div>
      </div>
    </div>
  </div>
  `
  });

  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios
    .get(INDEX_URL + id)
    .then(response => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid"></img>`
    })
}


function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  // console.log(movieIndex)
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)



// 教材的另一種條件式設定法
// function removeFromFavorite(id) {
//   if (!movies || !movies.length) return
//   //透過 id 找到要刪除電影的 index
//   const movieIndex = movies.findIndex((movie) => movie.id === id)
//   if (movieIndex === -1) return
//   //刪除該筆電影
//   movies.splice(movieIndex, 1)
//   //存回 local storage
//   localStorage.setItem('favoriteMovies', JSON.stringify(movies))
//   //更新頁面
//   renderMovieList(movies)
// }

// function 裡面使用 return 關鍵字，顧名思義就是回傳一個東西出去。
// function 碰到 return 就會終止，並回傳後面指定的內容，如果沒有放內容，就會回傳 undefined。

// 利用這個特性，可以優化 if else 的巢狀建構，原本 code 應該是長這樣的，可以看到出現了雙層巢狀，很 ugly
// function removeFromFavorite(id) {
//   // 如果 movies 存在, 且有長度時才繼續
//   if (movies && movies.length) {
//     const movieIndex = movies.findIndex((movie) => movie.id === id)

//     // 如果 movieIndex 不是 -1 才繼續
//     if (movieIndex !== -1) {
//       // action
//     }
//   }
// }

// 這種請況就可以透過 return 會終止 function 的特性，將 if 的條件反轉，進而拆除巢狀結構。形成一種「關卡」的概念，不滿足就 return 掉。
// function removeFromFavorite(id) {
//   if (!movies || !movies.length) return

//   //透過 id 找到要刪除電影的 index
//   const movieIndex = movies.findIndex((movie) => movie.id === id)
//   if (movieIndex === -1) return
//   // action
// }

// 如果 coding style 是採用不加分號的，那有些工程師會為 return 後面是空的產生不安全感。
// return   // 程式到底結束了沒??
// vs
// return;  // 透過分號, 顯示聲明 return 空內容

// 因此不加分號的流派有些人會習慣寫成這樣，都是可以的。
// return false
// or
// return void 0  // undefined 的意思