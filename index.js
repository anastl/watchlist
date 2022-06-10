const moviesContainer = document.getElementById('movies-container')
const searchMovieBtn = document.getElementById('search-movie-btn')
const searchBar = document.getElementById('search-bar')

if (JSON.parse(localStorage.getItem('watchlist')) != null ) {
    let savedMoviesFromLocalStorage = JSON.parse(localStorage.getItem('watchlist'))
    let moviesArray = new Array
    moviesArray.push(savedMoviesFromLocalStorage.map(movie => movie))
}

// localStorage.clear()

function removeMovieFromWatchlist(del) {
    const allMovies = JSON.parse(localStorage.getItem('watchlist'))
    moviesArray = new Array

    for (const id of allMovies){
        if (id != del)
            moviesArray.push(id)
    }
    localStorage.clear()
    localStorage.setItem('watchlist', JSON.stringify(moviesArray))
}

function addMovie2Watchlist(id) {
    let savedMovies = new Array
    savedMovies = JSON.parse(localStorage.getItem('watchlist'))
    if (savedMovies == null) {
        savedMovies = new Array
    }
    savedMovies.push(id)
    let uniqueMovies = [...new Set(savedMovies)]
    localStorage.clear()
    localStorage.setItem('watchlist', JSON.stringify(uniqueMovies))

    console.log(uniqueMovies)
}

function changeToDel (btn) {
    btn.children[0].src = 'img/remove-icon.png'
    addMovie2Watchlist(btn.id)
}

function changeToAdd (btn) {
    btn.children[0].src = 'img/add-icon.png'
    removeMovieFromWatchlist(btn.id)
}

function determineBtnState(btn) {
    const imgSrc = btn.children[0].src
    if (imgSrc.includes('add-icon')) {
        changeToDel(btn)
    } else {
        changeToAdd(btn)
    }
}

function addFunctionToBtn(){
    const btns = document.getElementsByClassName('watchlist-btn')
    for (const btn of btns) {
        btn.addEventListener("click", () => {
            determineBtnState(btn)
        })
    }
}

async function displayMovies(movieNameSearch) { //main function, calls all other
    moviesContainer.innerHTML = ''
    const listOfMovies = await searchAPI(movieNameSearch)
    const movieObjectsAll = new Array
    for (const movie of listOfMovies)
        movieObjectsAll.push( await getMovieObject(movie.imdbID))
    const moviesHtmlDisp = movieObjectsAll.map( movie => setMovieCardHtml(movie)).join('')
    moviesContainer.innerHTML = moviesHtmlDisp
    addFunctionToBtn()
}

function setMovieCardHtml(movieObject) {
    return `<div class="movie-card">
                <img class="movie-poster" alt="" src="${movieObject.Poster}">
                <div class="movie-body">
                    <div class="movie-name">
                        <h2 class="movie-title">${movieObject.Title}</h2>
                        <div class="movie-rating-container">
                            <img alt="" src="img/star-icon.png" class="rating-icon">
                            <p class="movie-rating">${movieObject.imdbRating}</p>
                        </div>
                    </div>
                    <div class="movie-dets-container">
                        <p class="movie-dets length">${movieObject.Runtime}</p>
                        <p class="movie-dets genre">${movieObject.Genre}</p>
                        <button id="${movieObject.imdbID}" class="watchlist-btn">
                            <img id="watchlist-icon-${movieObject.imdbID}" class="watchlist-icon" alt="add to watchlist" src="img/add-icon.png">
                            <p>Watchlist</p>
                        </button>
                    </div>
                    <p class="movie-plot">${movieObject.Plot}</p>
                </div>
            </div>`
}

async function getMovieObject(movieID){
    const res = await fetch(`https://www.omdbapi.com/?apikey=fa50c2e8&i=${movieID}`)
    const data = await res.json()
    return data
}

async function searchAPI(movieName) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=fa50c2e8&s=${movieName}&type=movie`)
    const data = await res.json()
    return data.Search
}

searchBar.addEventListener("keypress", (e) => {
    if (e.key === 'Enter'){
        displayMovies(searchBar.value)
    }
})
searchMovieBtn.addEventListener("click", () => {
    displayMovies(searchBar.value)
})


// export {setMovieCardHtml, removeMovieFromWatchlist}