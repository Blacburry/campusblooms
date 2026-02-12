function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.id === productId);

  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart ❤️");
}

function loadCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total-price");

  if (!cartContainer) return; // Only run on cart page

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <button onclick="removeItem(${index})">Remove ❌</button>
    `;

    cartContainer.appendChild(card);
  });

  totalDisplay.innerText = "Total: ₹" + total;
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function goToCheckout() {
  window.location.href = "checkout.html";
}

loadCart();
