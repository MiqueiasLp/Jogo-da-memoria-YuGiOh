let jogadas = 0;
let tempo = 0;

function atualizarJogadas() {
  jogadas++;
  document.getElementById(`jogadas`).textContent = `Jogadas: ${jogadas}`;
}

function atualizarTempo() {
  let segundos = 0;
  clearInterval(tempo);
  tempo = setInterval(() => {
    segundos++;
    const min = String(Math.floor(segundos / 60)).padStart(2, `0`);
    const sec = String(segundos % 60).padStart(2, `0`);
    document.getElementById(`tempo`).textContent = `Tempo: ${min}:${sec}`;
  }, 1000);
}
// Seleção dos elementos principais
const board = document.getElementById(`game-board`);
const restartBtn = document.getElementById(`restart`);

// Dados das cartas (pares)
const symbols = [
  `img/yugioh_dragao-branco-de-olhos-azuiz.png`,
  `img/yugioh_dragao-negro-de-olhos-vermelhos.png`,
  `img/yugioh_heroi-neos.png`,
  `img/yugioh_homem-argila.png`,
  `img/yugioh_homem-bolha.png`,
  `img/yugioh_homem-chama-alado.png`,
  `img/yugioh_maga-negra.png`,
  `img/yugioh_mago-negro.png`,
  `img/yugioh_polimerizacao.png`,
  `img/yugioh_reviver-monstro.png`,
];
let cards = [...symbols, ...symbols]; // duplica para formar pares

// Estado do jogo
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedCount = 0;

// Embaralhamento (Fisher–Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Cria o tabuleiro
function createBoard() {
  board.innerHTML = ``;
  matchedCount = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  jogadas = 0;
  document.getElementById(`jogadas`).textContent = `Jogadas: 0`;
  document.getElementById(`tempo`).textContent = `Tempo: 00:00`;
  atualizarTempo();

  shuffle(cards).forEach((symbol) => {
    const card = document.createElement(`button`);
    card.className = `card`;
    card.type = `button`;
    card.dataset.symbol = symbol;

    const face = document.createElement(`img`);
    face.className = `card-face`;
    face.src = `img/yugioh-carta.png`; // inicia oculta

    card.appendChild(face);
    card.addEventListener(`click`, flipCard);
    board.appendChild(card);
  });
}

// Lógica de virar/comparar
function flipCard() {
  if (lockBoard || this.classList.contains(`flipped`)) return;

  this.classList.add(`flipped`);
  this.querySelector(`.card-face`).src = this.dataset.symbol;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  atualizarJogadas();
  checkMatch();
}

// Verifica se formou par
function checkMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    disableMatched();
  } else {
    unflipCards();
  }
}

// Desabilita cartas que formaram par
function disableMatched() {
  firstCard.setAttribute(`aria-disabled`, `true`);
  secondCard.setAttribute(`aria-disabled`, `true`);

  firstCard = null;
  secondCard = null;
  matchedCount += 1;

  if (matchedCount === symbols.length) verificarVitoria();
}

// Desvira cartas que não formaram par
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove(`flipped`);
    secondCard.classList.remove(`flipped`);

    firstCard.querySelector(`.card-face`).src = `img/yugioh-carta.png`;
    secondCard.querySelector(`.card-face`).src = `img/yugioh-carta.png`;

    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }, 800);
}

// Mensagem de vitória simples
function verificarVitoria() {
  if (matchedCount === symbols.length) {
    alert(`Parabéns! Você venceu o jogo em ${jogadas} jogadas!`);
  }
}

// Eventos
restartBtn.addEventListener(`click`, createBoard);

// Inicializa o jogo
createBoard();
