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



// ????????????????????????????????????
// function removeFromFavorite(id) {
//   if (!movies || !movies.length) return
//   //?????? id ???????????????????????? index
//   const movieIndex = movies.findIndex((movie) => movie.id === id)
//   if (movieIndex === -1) return
//   //??????????????????
//   movies.splice(movieIndex, 1)
//   //?????? local storage
//   localStorage.setItem('favoriteMovies', JSON.stringify(movies))
//   //????????????
//   renderMovieList(movies)
// }

// function ???????????? return ?????????????????????????????????????????????????????????
// function ?????? return ???????????????????????????????????????????????????????????????????????????????????? undefined???

// ????????????????????????????????? if else ???????????????????????? code ??????????????????????????????????????????????????????????????? ugly
// function removeFromFavorite(id) {
//   // ?????? movies ??????, ????????????????????????
//   if (movies && movies.length) {
//     const movieIndex = movies.findIndex((movie) => movie.id === id)

//     // ?????? movieIndex ?????? -1 ?????????
//     if (movieIndex !== -1) {
//       // action
//     }
//   }
// }

// ??????????????????????????? return ????????? function ??????????????? if ????????????????????????????????????????????????????????????????????????????????????????????? return ??????
// function removeFromFavorite(id) {
//   if (!movies || !movies.length) return

//   //?????? id ???????????????????????? index
//   const movieIndex = movies.findIndex((movie) => movie.id === id)
//   if (movieIndex === -1) return
//   // action
// }

// ?????? coding style ??????????????????????????????????????????????????? return ????????????????????????????????????
// return   // ??????????????????????????
// vs
// return;  // ????????????, ???????????? return ?????????

// ??????????????????????????????????????????????????????????????????????????????
// return false
// or
// return void 0  // undefined ?????????