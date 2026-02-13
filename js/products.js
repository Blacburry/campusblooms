const products = [
  {
    id: 1,
    name: "Red Rose Bouquet",
    price: 799,
    image: "images/flowers/rose.jpeg"
  },
  {
    id: 2,
    name: "Pink Tulip Bouquet",
    price: 899,
    image: "images/flowers/tulip.jpg"
  },
  {
    id: 3,
    name: "Mixed Valentine Special",
    price: 1099,
    image: "images/flowers/mixed.jpg"
  }
];

const productList = document.getElementById("product-list");

products.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
  <div class="product-image-wrapper">
    <img src="${product.image}" alt="${product.name}">
  </div>

  <h3>${product.name}</h3>
  <p>₹${product.price}</p>
  <button onclick="addToCart(${product.id})">Add to Cart</button>
`;

  productList.appendChild(card);
});
