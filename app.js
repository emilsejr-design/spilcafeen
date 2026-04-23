"use strict"
const GAMES_URL = "https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json"
let allGames = [];

const gameList = document.querySelector("#game-list");
const genreSelect = document.querySelector("#genre-select");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const gameCount = document.querySelector("#game-count");

fetchGames();

async function fetchGames() {
  const response = await fetch(GAMES_URL);
  allGames = await response.json();

  populateGenreSelect();
  applyFiltersAndSort();
}

function populateGenreSelect() {
  const genres = new Set();

  for (const game of allgames) {
    for (const genre of game.genre) {
      genres.add(genre);
    }
  }

  const sortedGenres = [...genres].sort((a, b) => a.localeCompare(b));

  for (const genre of sortedGenres) {
    genreSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${genre}">${genre}</option>`,
    );
  }
}

function applyFiltersAndSort() {
  const selectedGenre = genreSelect.value;
  const searchValue = searchInput.value.trim().toLowerCase();
  const sortOption = sortSelect.value;

  let filteredMovies = allGames.filter(function (game) {
    const matchesGenre =
      selectedGenre === "all" || game.genre.includes(selectedGenre);
    const matchesSearch = game.title.toLowerCase().includes(searchValue);

    return matchesGenre && matchesSearch;
  });

  if (sortOption === "title") {
    filteredMovies.sort(function (gameA, gameB) {
      return gameA.title.localeCompare(gameB.title);
    });
  } else if (sortOption === "year") {
    filteredMovies.sort(function (gameA, gameB) {
      return gameB.year - gameA.year;
    });
  } 

  showGames(filteredGames);
}

function showGames(games) {
  gameList.innerHTML = "";
  gameCount.textContent = `Viser ${game.length} ud af ${allGames.length} spil`;

  if (games.length === 0) {
    gameList.innerHTML =
      '<p class="empty">Ingen spil matcher din søgning eller genre.</p>';
    return;
  }

  for (const game of games) {
    showGames(game);
  }
}