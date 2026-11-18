const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return [];
    const parsed = JSON.parse(basket);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return [];
  }
}

function addToBasket(product) {
  const basket = getBasket();
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}

function spinAndAddRandomFruit() {
  const slotFruit = document.getElementById("slotFruit");
  const spinButton = document.getElementById("spinAndAdd");
  const slotStatus = document.getElementById("slotStatus");
  if (!slotFruit || !spinButton || !slotStatus || spinButton.disabled) return;

  const fruitKeys = Object.keys(PRODUCTS);
  let spinIndex = 0;
  spinButton.disabled = true;
  slotStatus.textContent = "Spinning...";

  const spinInterval = window.setInterval(() => {
    const fruit = PRODUCTS[fruitKeys[spinIndex % fruitKeys.length]];
    slotFruit.textContent = fruit.emoji;
    slotFruit.setAttribute("aria-label", `${fruit.name} spinning`);
    spinIndex += 1;
  }, 100);

  window.setTimeout(() => {
    window.clearInterval(spinInterval);
    const selectedFruit = fruitKeys[Math.floor(Math.random() * fruitKeys.length)];
    const fruit = PRODUCTS[selectedFruit];
    slotFruit.textContent = fruit.emoji;
    slotFruit.setAttribute("aria-label", `${fruit.name} selected`);
    addToBasket(selectedFruit);
    slotStatus.textContent = `${fruit.name} added to your basket!`;
    spinButton.disabled = false;
  }, 1200);
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((product) => {
    const item = PRODUCTS[product];
    if (item) {
      const li = document.createElement("li");
      li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${item.name}</span>`;
      basketList.appendChild(li);
    }
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
