"use strict";

const GAMES_URL =
  "https://raw.githubusercontent.com/cederdorff/race/master/data/games.json";

let allGames = [];

const gameList = document.querySelector("#game-list");
const genreSelect = document.querySelector("#genre-select");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const gameCount = document.querySelector("#game-count");

fetchGames();

async function fetchGames() {
  try {
    const response = await fetch(GAMES_URL);
    const data = await response.json();

    console.log(data); // debug

    allGames = data;

    populateGenreSelect();
    applyFiltersAndSort();
  } catch (error) {
    console.error("Fejl ved hentning:", error);
  }
}

function populateGenreSelect() {
  const genres = new Set();

  for (const game of allGames) {
    // håndter både string og array
    if (Array.isArray(game.genre)) {
      for (const genre of game.genre) {
        genres.add(genre);
      }
    } else {
      genres.add(game.genre);
    }
  }

  const sortedGenres = [...genres].sort((a, b) =>
    a.localeCompare(b)
  );

  for (const genre of sortedGenres) {
    genreSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${genre}">${genre}</option>`
    );
  }
}

function applyFiltersAndSort() {
  const selectedGenre = genreSelect.value;
  const searchValue = searchInput.value.trim().toLowerCase();
  const sortOption = sortSelect.value;

  let filteredGames = allGames.filter(function (game) {
    const genres = Array.isArray(game.genre)
      ? game.genre
      : [game.genre];

    const matchesGenre =
      selectedGenre === "all" || genres.includes(selectedGenre);

    const matchesSearch = game.title
      .toLowerCase()
      .includes(searchValue);

    return matchesGenre && matchesSearch;
  });

  if (sortOption === "title") {
    filteredGames.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sortOption === "year") {
    filteredGames.sort((a, b) => b.year - a.year);
  }

  showGames(filteredGames);
}

function showGames(games) {
  gameList.innerHTML = "";

  gameCount.textContent = `Viser ${games.length} ud af ${allGames.length} spil`;

  if (games.length === 0) {
    gameList.innerHTML =
      '<p class="empty">Ingen spil matcher din søgning eller genre.</p>';
    return;
  }

  for (const game of games) {
    showGame(game);
  }
}

function showGame(game) {
  const genres = Array.isArray(game.genre)
    ? game.genre.join(", ")
    : game.genre;

  const players = Array.isArray(game.players)
    ? game.players.join(", ")
    : game.players;

  const html = `
    <article class="game-card" tabindex="0">
      <img src="${game.image}" alt="Poster af ${game.title}" class="game-poster" />
      <div class="game-info">
        <div class="title-row">
          <h2>${game.title}</h2>
          <span class="year-badge">(${game.year})</span>
        </div>
        <p class="genre">${genres}</p>
        <p class="players">${players}</p>
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

function showGameDialog(game) {
  const dialog = document.querySelector("#game-dialog");
  const content = document.querySelector("#dialog-content");

  const genres = Array.isArray(game.genre)
    ? game.genre.join(", ")
    : game.genre;

  const players = Array.isArray(game.players)
    ? game.players.join(", ")
    : game.players;

  content.innerHTML = `
    <h2>${game.title}</h2>
    <p><strong>År:</strong> ${game.year}</p>
    <p><strong>Genre:</strong> ${genres}</p>
    <p><strong>Spillere:</strong> ${players}</p>
    <img src="${game.image}" alt="${game.title}" style="width:100%;">
  `;

  dialog.showModal();
}

// luk dialog
document
  .querySelector("#close-dialog")
  .addEventListener("click", function () {
    document.querySelector("#game-dialog").close();
  });

// events
genreSelect.addEventListener("change", applyFiltersAndSort);
searchInput.addEventListener("input", applyFiltersAndSort);
sortSelect.addEventListener("change", applyFiltersAndSort);