
console.log("Animations ready. Add sword slashes, power glows here.");
function animateCard(cardEl) {
  gsap.from(cardEl, {
    scale: 0.6,
    opacity: 0,
    y: 50,
    duration: 0.4,
    ease: "power2.out"
  });
}

function highlightCard(cardEl) {
  gsap.to(cardEl, {
    scale: 1.2,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "bounce.out"
  });
}

function shakeEffect(targetId) {
  const el = document.getElementById(targetId);
  if (el) {
    gsap.fromTo(el, {
      x: -5
    }, {
      x: 5,
      repeat: 5,
      yoyo: true,
      duration: 0.1,
      ease: "power1.inOut"
    });
  }
}

function animatePlayerHand() {
  const playerHand = document.getElementById("player-hand");
  if (playerHand) {
    const cards = playerHand.children;
    for (let i = 0; i < cards.length; i++) {
      animateCard(cards[i]);
    }
  }
}