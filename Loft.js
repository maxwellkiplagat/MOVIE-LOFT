document.addEventListener('DOMContentLoaded',  function(){
//adding my DOM element and put the in variable
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const showAllButton = document.getElementById('show-all-button');
    const genreDropdown = document.getElementById('genre-dropdown');
    const moviesContainer = document.getElementById('movies-container');
    const movieTemplate = document.getElementById('movie-template');
    const myform = document.getElementById('dataForm')
    const trailerButton = moviediv.querySelector('.movie-trailer');
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
            alert('Please enter a movie title to search');
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
    //to display all the movie
    function displayAllMovies() {
        moviesContainer.innerHTML = '';
        searchInput.value = '';
        if (allMovies.length === 0) {
        
            return;
        } else {
            allMovies.forEach(movie => {
                displayMovie(movie);
            });
        }
    }
    function filteringTheGenre() {
        const selectedGenre = genreDropdown.value.toLowerCase();
        moviesContainer.innerHTML = '';
        if (!selectedGenre) {
            displayAllMovies();
            return;
        }
        const filteredMovies = allMovies.filter(movie => 
            movie.Genre.toLowerCase().includes(selectedGenre)
        );
        if (filteredMovies.length > 0) {
            filteredMovies.forEach(movie => displayMovie(movie));
        } else {
            alert( `No ${selectedGenre} movies found.`);
        }
    }
    function displayMovie(movie) {
        const moviediv = movieTemplate.cloneNode(true);
        moviediv.style.display = 'grid';
        //to prevent clash due to the clone id which must be unique
        moviediv.removeAttribute('id'); 
        //taking the movie info
        moviediv.querySelector('.movie-poster').src = movie.Poster || 'https://via.placeholder.com/300x450?text=No+Poster';
        moviediv.querySelector('.movie-poster').alt = movie.Title;
        moviediv.querySelector('.movie-title').textContent = movie.Title;
        moviediv.querySelector('.movie-year').textContent = `(${movie.Year})`;
        moviediv.querySelector('.movie-genre').textContent = movie.Genre;
        moviediv.querySelector('.movie-plot').textContent = movie.Plot;
        //the trailer button
        trailerButton.textContent = 'Play Trailer';
        trailerButton.href = '#';
        trailerButton.onclick = (e) => {
            e.preventDefault();
            previewTrailer(movie.trailer || movie.Title);
        };
        moviesContainer.appendChild(moviediv);
    }
    function previewTrailer(trailerId) {
        // creatinf a div
        const gatsby = document.createElement('div');
        gatsby.className = 'tubeBox';
        
        const Content = document.createElement('div');
        Content.className = 'main-content';
        
        const closeButton = document.createElement('span');
        closeButton.className = 'close-sign';
        closeButton.innertext = 'X';
        
        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        
        // youtube  video source
        if (trailerId.length === 11) { 
            iframe.src = `https://www.youtube.com/embed/${trailerId}?autoplay=1`;
        }
        Content.appendChild(closeButton);
        Content.appendChild(iframe);
        gatsby.appendChild(Content);
        document.body.appendChild(gatsby);
        
        // Close functionality
        closeButton.onclick = () => gatsby.remove();
        gatsby.onclick = (e) => {
            if (e.target === gatsby) gatsby.remove();
        };
    }
    myform.addEventListener('submit',(e)=>{
        e.preventDefault();
        const formData = {
            Title: document.getElementById('oleTitle').value,
            Genre: document.getElementById('oleGenre').value,
            Year: document.getElementById('oleYear').value,
            Plot: document.getElementById('olePlot').value,
            trailer: document.getElementById('oleMovie').value,
            Poster: document.getElementById('olePoster').value
        }
        fetch('http://localhost:3000/movies',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        })
        myform.reset()
    })
    function toggleForm() {
        const form = document.getElementById('dataForm');
        const currentOpacity = window.getComputedStyle(form).opacity;
        
        form.style.opacity = currentOpacity === '0' ? '1' : '0';
        form.style.visibility = currentOpacity === '0' ? 'visible' : 'hidden';
        form.style.pointerEvents = currentOpacity === '0' ? 'auto' : 'none';   
    }
    document.getElementById('addMovie').addEventListener('click', toggleForm);    showAllButton.addEventListener('click', displayAllMovies);
    genreDropdown.addEventListener('change', filteringTheGenre);
    searchButton.addEventListener('click', userTypedMovie);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') userTypedMovie();
    });
   


})