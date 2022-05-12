"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS =  1000;
let matches = [];
let score = 0;
let highScore = Infinity;
let numCards = {easy:5, medium:10, hard:15}

function createColors(difficulty) {
  let COLORS = [];

  for(let i = 0; i < numCards[difficulty]; i++) {
    let color = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
    COLORS.push(color);
  }

 return COLORS.concat(COLORS);
}

let colors = shuffle(createColors('easy'));

createCards(colors);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  let cardCount = 0;
  for (let color of colors) {
    cardCount++;
    gameBoard.insertAdjacentHTML("beforeend", "<button id='" + cardCount + "' onclick='handleCardClick(this)' value='" + color + "'></div>");
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.style.backgroundColor = card.value;
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.style.backgroundColor = '#FAF9F6';
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(card) {
  if(matches.length % 2 == 0 && card.style.backgroundColor != card.value) {
    if(matches.length == 0 || card.id != matches[matches.length - 1].id) {
      console.log('frst')
      matches.push(card);
      flipCard(card);
    }
  } else if(card.id != matches[matches.length - 1].id && card.style.backgroundColor != card.value) {
    incrementScore();
    updateScore();
    matches.push(card);
    flipCard(card);
    
    let thisCard = matches[matches.length - 1];
    let lastCard = matches[matches.length - 2];

    if(thisCard.value != lastCard.value) {
      setTimeout((() => unFlipCard(thisCard)), FOUND_MATCH_WAIT_MSECS);
      setTimeout((() => unFlipCard(lastCard)), FOUND_MATCH_WAIT_MSECS);

      let cards = document.querySelectorAll('div button');
      toggleCards(true, cards);
      setTimeout((() => toggleCards(false, cards)), FOUND_MATCH_WAIT_MSECS);

      matches.splice(matches.length - 2, 2);
    }

    if(matches.length === colors.length) victoryScreen();
  }
}

function toggleCards(trueFalse, cards) {
  for(let card of cards) {
    card.disabled = trueFalse;
  }
}

function startGame(difficulty) {
  const gameBoard = document.getElementById("game");
  colors = shuffle(createColors(difficulty));
  matches = [];
  score = 0;
  updateScore();
  gameBoard.innerHTML = '';
  document.getElementById('title').innerHTML = 'Memory Game!';
  document.getElementById('title').style = "visibility:visible";
  document.getElementById('game-board').style = "white"; 
  createCards(colors);
  gameBoard.style = "visibility:visible;"
  document.getElementById('startButton').style = "visibility:hidden";
}

function incrementScore() {
  score++;
}

function updateScore() {
  document.getElementById('score').innerHTML = "Your score: " + score; 
}

function updateHighScore() {
  if(highScore > score) {
    highScore = score;
    document.getElementById('highScore').innerHTML = "Top Score: " + highScore;
  }
}

function victoryScreen() {
  document.getElementById('title').innerHTML = 'YOU WIN!';
  updateHighScore();
  document.getElementById('title').style = "color:#d4af37; animation: hinge 4s ease-in-out forwards";
  setTimeout((() => document.getElementById('title').style = "visibility:hidden"), FOUND_MATCH_WAIT_MSECS * 3.5);
  document.getElementById('game-board').style = "background-color:#c0c0c0;";
  document.querySelector('form button').innerHTML = 'Play Again!';
  setTimeout((() => document.getElementById('startButton').style = 'visibility: visible'), FOUND_MATCH_WAIT_MSECS * 4);
}