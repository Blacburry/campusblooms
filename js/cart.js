function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId) {
  let cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  showToast("Added to cart ❤️");
}

function loadCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total-price");

  if (!cartContainer) return;

  let cart = getCart();
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
  cartContainer.innerHTML = `
    <div class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Browse beautiful bouquets and surprise someone 💐</p>
      <a href="index.html" class="primary-btn">Go to Shop</a>
    </div>
  `;

  // Hide total section completely
  document.getElementById("total-price").style.display = "none";
  document.querySelector(".checkout-section").style.display = "none";

  return;
}


  let total = 0;

  cart.forEach((item, index) => {
    const product = products.find(p => p.id === item.id);
    total += product.price * item.quantity;

    document.getElementById("total-price").style.display = "block";
    document.querySelector(".checkout-section").style.display = "block";


    const card = document.createElement("div");
    card.className = "cart-item";

    card.innerHTML = `
  <div class="cart-item">
    <img src="${product.image}" class="cart-thumb">

    <div class="cart-details">
      <h3>${product.name}</h3>
      <p class="price">₹${product.price}</p>

      <div class="quantity-controls">
        <button onclick="changeQuantity(${index}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)">+</button>
      </div>

      <p class="subtotal">Subtotal: ₹${product.price * item.quantity}</p>
    </div>
  </div>
`;



    cartContainer.appendChild(card);
  });

  totalDisplay.innerText = "Total: ₹" + total;
}

function changeQuantity(index, delta) {
  let cart = getCart();

  cart[index].quantity += delta;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  loadCart();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById("cart-count");
  if (badge) badge.innerText = count;
}

function goToCheckout() {
  window.location.href = "checkout.html";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

updateCartCount();
loadCart();
