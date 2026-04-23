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

  // Fix 1: "allgames" → "allGames"
  for (const game of allGames) {
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

  // Fix 2: "filteredMovies" → "filteredGames"
  let filteredGames = allGames.filter(function (game) {
    const matchesGenre =
      selectedGenre === "all" || game.genre.includes(selectedGenre);
    const matchesSearch = game.title.toLowerCase().includes(searchValue);

    return matchesGenre && matchesSearch;
  });

  if (sortOption === "title") {
    filteredGames.sort(function (gameA, gameB) {
      return gameA.title.localeCompare(gameB.title);
    });
  } else if (sortOption === "year") {
    filteredGames.sort(function (gameA, gameB) {
      return gameB.year - gameA.year;
    });
  }

  showGames(filteredGames);
}

function showGames(games) {
  gameList.innerHTML = "";
  // Fix 4: "game.length" → "games.length"
  gameCount.textContent = `Viser ${games.length} ud af ${allGames.length} spil`;

  if (games.length === 0) {
    gameList.innerHTML =
      '<p class="empty">Ingen spil matcher din søgning eller genre.</p>';
    return;
  }

  for (const game of games) {
    // Fix 3: was calling showGames(game) recursively — now calls showGame (singular)
    showGame(game);
  }
}

// Fix 3: renamed from showGames to showGame to avoid duplicate function name
function showGame(game) {
  const html = /* html */ `
    <article class="game-card" tabindex="0">
      <img src="${game.image}" alt="Poster af ${game.title}" class="game-poster" />
      <div class="game-info">
        <div class="title-row">
          <h2>${game.title}</h2>
          <span class="year-badge">(${game.year})</span>
        </div>
        <p class="genre">${game.genre.join(", ")}</p>
        <p class="players">${game.players.join(", ")}</p>
      </div>
    </article>
  `;

  gameList.insertAdjacentHTML("beforeend", html);
  const newCard = gameList.lastElementChild;
  newCard.addEventListener("click", function () {
    showGameDialog(game);
  });
  newCard.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      showGameDialog(game);
    }
  });
}

genreSelect.addEventListener("change", applyFiltersAndSort);
searchInput.addEventListener("input", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);