// import {setMovieCardHtml, removeMovieFromWatchlist} from './index.js'

const moviesContainer = document.getElementById('movies-container')

if (JSON.parse(localStorage.getItem('watchlist')).length == 0) {
    setPlaceholder()
} else {
    const savedMoviesFromLocalStorage = JSON.parse(localStorage.getItem('watchlist'))
    displayMovies()
}

function addFunctionToBtn(){
    const btns = document.getElementsByClassName('watchlist-btn')
    for (const btn of btns) {
        btn.children[0].src = 'img/remove-icon.png'
        btn.addEventListener("click", () => {
            removeMovieFromWatchlist(btn)
        })
    }
}

async function displayMovies() { //main function, calls all other
    moviesContainer.innerHTML = ''
    const movieObjectsAll = new Array
    const allMovies = JSON.parse(localStorage.getItem('watchlist'))
    for (const movie of allMovies)
        movieObjectsAll.push( await getMovieObject(movie))
    const moviesHtml = movieObjectsAll.map( movie => setMovieCardHtml(movie)).join('')
    moviesContainer.innerHTML = moviesHtml
    addFunctionToBtn()
}

async function getMovieObject(movieID){
    const res = await fetch(`https://www.omdbapi.com/?apikey=fa50c2e8&i=${movieID}`)
    const data = await res.json()
    return data
}

function setPlaceholder(){
    moviesContainer.innerHTML = `
        <p class="placeholder-w-text">Your watchlist is looking a little empty...</p>
        <a class="placeholder-w-link" href="index.html">
            <img class="watchlist-icon" alt="add to watchlist" src="img/add-icon.png">
            <p>Let's add some movies!</p>
        </a>
    `
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

function removeMovieFromWatchlist(btn) {
    const allMovies = JSON.parse(localStorage.getItem('watchlist'))
    const newMovies = new Array

    if (allMovies.length == 1){
        setPlaceholder()
        localStorage.clear()
        localStorage.setItem('watchlist', JSON.stringify([]))
        return
    }

    for (const id of allMovies){
        if (id != btn.id)
            newMovies.push(id)
    }

    localStorage.clear()
    localStorage.setItem('watchlist', JSON.stringify(newMovies))
    displayMovies()
}

/*
{
    const moviesContainer = document.getElementById('movies-container')
    let savedMovies = JSON.parse(localStorage.getItem('watchlistMovies'))

    if (savedMovies != null) { savedMovies.map(movie => fetchMovie(movie)) }
    else { setPlaceholder() }

    function removeMovie(id) {
        const newMovies = savedMovies.filter(movie => {
            if (movie != id)
                return movie
        })
        savedMovies = newMovies
        localStorage.setItem('watchlistMovies', JSON.stringify(newMovies))
        if (savedMovies.length > 0) { savedMovies.map( movie => fetchMovie(movie) ) }
        else { setPlaceholder() }
    }

    function setPlaceholder(){
        moviesContainer.innerHTML = `
            <p class="placeholder-w-text">Your watchlist is looking a little empty...</p>
            <a class="placeholder-w-link" href="index.html">
                <img class="watchlist-icon" alt="add to watchlist" src="img/add-icon.png">
                <p>Let's add some movies!</p>
            </a>
        `
    }

    function fetchMovie(movieID) {
        moviesContainer.innerHTML = ''
        fetch(`https://www.omdbapi.com/?apikey=fa50c2e8&i=${movieID}`)
        .then(res => res.json())
        .then(movie => {
            displayMovies()
        })
    }

    function displayMovies() {
        moviesContainer.innerHTML += `
            <div class="movie-card">
                <img class="movie-poster" alt="" src="${movie.Poster}">
                <div class="movie-body">
                    <div class="movie-name">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <div class="movie-rating-container">
                            <img alt="" src="img/star-icon.png" class="rating-icon">
                            <p class="movie-rating">${movie.imdbRating}</p>
                        </div>
                    </div>
                    <div class="movie-dets-container">
                        <p class="movie-dets length">${movie.Runtime}</p>
                        <p class="movie-dets genre">${movie.Genre}</p>
                        <button id="${movie.imdbID}" class="watchlist-rem-btn">
                            <img class="watchlist-icon" alt="remove from watchlist" src="img/remove-icon.png">
                            <p>Watchlist</p>
                        </button>
                    </div>
                    <p class="movie-plot">${movie.Plot}</p>
                </div>
            </div>
        `
        const addMovieBtns = document.getElementsByClassName('watchlist-rem-btn')
        for (const btn of addMovieBtns) {
            btn.addEventListener("click", () => {
                removeMovie(btn.id)
            })
        }
    }
}
*/

// console.log(localStorage.getItem('watchlist') == '[]')