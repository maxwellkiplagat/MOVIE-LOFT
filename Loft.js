document.addEventListener('DOMContentLoaded',  function(){
//adding my DOM element and put the in variable
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const showAllButton = document.getElementById('show-all-button');
    const genreDropdown = document.getElementById('genre-dropdown');
    const moviesContainer = document.getElementById('movies-container');
    const movieTemplate = document.getElementById('movie-template');
    const myform = document.getElementById('dataForm')
    //varible to keep movie array after fetching
    let allMovies = [];
    //function to fetch the data from the url and siplaying the first movie in the db
    function loadFirstMovies() {
        fetch('http://localhost:3000/movies')
            .then(response => response.json())
            .then(data => {
                allMovies = data;
                
                if (allMovies.length > 0) {
                    displayMovie(allMovies[0]);
                } else {
                    alert('No movies available');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    function userTypedMovie() {
        const searchTerm = searchInput.value.trim();
        
        if (!searchTerm) {
            moviesContainer.innerHTML = '<p>Please enter a movie title to search</p>';
            return;
        }

        const matchedMovie = allMovies.find(movie => 
            movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        moviesContainer.innerHTML = '';

        if (matchedMovie) {
            displayMovie(matchedMovie);
        } else {
             alert(`I can't find "${searchTerm}" please try another movie 😊`);
        }
        searchInput.value = '';
    }


})