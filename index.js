const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

const movies = []
let filteredMovies = []

const MOVIES_PER_PAGE = 12 


function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ``

  for (page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

function addToFavorite (id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  alert('已將此電影收在收藏清單中！')
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

paginator.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {

    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  // if (!keyword.length) {
  //   return alert('Please enter a valid keyword')
  // }

  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push((movie))
  //   }
  // }

  filteredMovies = movies.filter((movie) => 
    movie.title.toLowerCase().includes(keyword)
)
  console.log(filteredMovies)

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }

  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
  searchForm.reset()
})

function showMovieModal (id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL+ id).then((response) => {
    console.log(response)
    const data = response.data.results
    modalTitle.textContent = data.title
    modalDate.textContent = 'Release date:' + data.release_date
    modalDescription.textContent = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function renderMovieList (data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
				<div class="mb-2">
					<div class="card">
						<img
							src="${POSTER_URL + item.image}"
							class="card-img-top" alt="Movie Poster"/>
						<div class="card-body">
							<h5 class="card-title">${item.title}</h5>
						</div>
						<div class="card-footer">
							<button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
							<button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
						</div>
					</div>
				</div>
			</div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

axios.get(INDEX_URL)
  .then((response) =>{
    for (const movie of response.data.results) {
      movies.push(movie)
    }
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((error) => console.log(error))

// axios.get(INDEX_URL).then((response) => {
//   movies.push(...response.data.results)
//   console.log(movies)
// }).catch((err) => console.log(err))

