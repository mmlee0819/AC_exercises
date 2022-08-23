const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []

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
          <button class="btn btn-info btn-add-favorite" data-id ="${item.id}">+</button>
        </div>
      </div>
    </div>
  </div>
  `
  })

  dataPanel.innerHTML = rawHTML
}



// 傳入的參數為電影的總數量
function renderPaginator(amount) {
  //  80 / 12 = 6...8
  //  Math.ceil(12.1) → 13
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
  // console.log(paginator.innerHTML)
}

function getMoviesByPage(page) {
  // page 1 →  0~11
  // page 2 → 12~23
  // page 3 → 24~35
  // ...  
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  // 分頁功能 >> 全部movies時分頁 & 搜尋功能時分頁
  // 以下這行程式碼翻譯：如果搜尋結果有東西，條件判斷為 true，以搜尋後的filteredMovies數量來分頁；如果沒有搜尋，則以全部數量的電影來分頁
  //          filteredMovies.length !== 0 → filteredMovies ; filteredMovies.length = 0 (是空陣列) → movies
  // 用data保存回傳值
  const data = filteredMovies.length ? filteredMovies : movies

  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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


function addToFavorite(id) {
  // console.log(id)
  // function isMovieIdMatched (movie) {
  // return movie.id            ===      id)
  //         └> 此函式參數(movie)的movie   └> 外包函式 addToFavorite(id)的id
  // }
  // 存入資料：  localStorage.setItem('key', 'value')
  // 取出資料 - localStorage.getItem('key')

  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已在收藏清單中')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


paginator.addEventListener('click', function onPaginatorClicked(event) {
  // 若點擊的target元素 其標籤不是 <a></a>，則結束函式
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  // console.log (page)
  renderMovieList(getMoviesByPage(page))
})


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  // if (!keyword.length) {
  //   return alert('Please input valid keyword')
  // }

  // 方法二：filter()
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  // 方法一：使用for of 迴圈
  // for (const movie of movies) {
  //  if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }

  if (filteredMovies.length === 0) {
    return alert('Can not find movies with keyword: ' + keyword)
  }
  // 搜尋時也要重新渲染分頁器
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})


axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))




