"use strict"
const GAMES_URL = "https://raw.githubusercontent.com/cederdorff/race/refs/heads/master/data/games.json"
let allGames = [];

const gameList = document.querySelector("#game-list");
const genreSelect = document.querySelector("#genre-select");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const gameCount = document.querySelector("#game-count");

fetchGames();

