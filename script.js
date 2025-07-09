let allCards = [];
let playerDeck = [];
let lastPlayerCard = null;
let playerHP = 100;
let enemyHP = 100;

// Get mode from URL
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");
if (mode) document.getElementById("game-mode").textContent = mode;

fetch("cards_with_modes.json")
  .then(res => res.json())
  .then(data => {
    allCards = data;
    buildDeck();
    drawCards();
  });

function buildDeck() {
  const builder = document.getElementById("deck-builder");
  builder.innerHTML = "";
  allCards.slice(0, 5).forEach(card => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = card.name;
    btn.onclick = () => {
      if (playerDeck.length < 3) {
        playerDeck.push(card);
        drawCards();
      }
    };
    builder.appendChild(btn);
  });
}

function drawCards() {
  const cards = allCards.filter(card => card.mode === mode);
  const playerHand = document.getElementById("player-hand");
  const enemyHand = document.getElementById("enemy-hand");

  playerHand.innerHTML = "";
  enemyHand.innerHTML = "";

  let damageThisTurn = 0;
  playerDeck.forEach(playerCard => {
    const el = createCardElement(playerCard);
    playerHand.appendChild(el);
    if (lastPlayerCard && lastPlayerCard.combo === playerCard.name) {
      damageThisTurn += playerCard.damage * 2;
    } else {
      damageThisTurn += playerCard.damage;
    }
    lastPlayerCard = playerCard;
  });

  let enemyDamage = 0;
  for (let i = 0; i < 3; i++) {
    const card = cards[Math.floor(Math.random() * cards.length)];
    const el = createCardElement(card);
    enemyHand.appendChild(el);
    enemyDamage += card.damage;
  }

  updateHP(damageThisTurn, enemyDamage);
}

function updateHP(playerDmg, enemyDmg) {
  enemyHP -= playerDmg;
  playerHP -= enemyDmg;

  enemyHP = Math.max(0, enemyHP);
  playerHP = Math.max(0, playerHP);

  document.getElementById("enemy-hp").textContent = enemyHP;
  document.getElementById("player-hp").textContent = playerHP;

  // 💥 Shake damaged elements
  if (playerDmg > 0) shakeEffect("enemy-hp");
  if (enemyDmg > 0) shakeEffect("player-hp");
}

function createCardElement(card) {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <h3>${card.name}</h3>
    <p><strong>Type:</strong> ${card.type}</p>
    <p><strong>Power:</strong> ${card.damage}</p>
    <p><strong>Effect:</strong> ${card.effect}</p>`;
  
  // 🔥 Animate new card
  if (typeof animateCard === "function") animateCard(el);

  return el;
}
document.getElementById("play-btn").addEventListener("click", () => {
  if (playerDeck.length < 3) {
    alert("You need at least 3 cards in your deck!");
    return;
  }
  document.getElementById("game-container").style.display = "none";
  document.getElementById("game-play").style.display = "block";
  drawCards();
});
cardElement.onclick = () => {
  highlightCard(cardElement); // 👈 Animate tap or use
};
document.getElementById("back-btn").addEventListener("click", () => {
  document.getElementById("game-container").style.display = "block";
  document.getElementById("game-play").style.display = "none";
});