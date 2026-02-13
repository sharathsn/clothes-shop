// Product catalog (with emoji placeholders for images)
const products = [
  { id: 1, name: 'Classic White Tee', category: 'Tops', price: 24.99, emoji: '👕' },
  { id: 2, name: 'Oversized Sweater', category: 'Tops', price: 49.99, emoji: '🧥' },
  { id: 3, name: 'Striped Long Sleeve', category: 'Tops', price: 34.99, emoji: '👔' },
  { id: 4, name: 'Crop Top', category: 'Tops', price: 22.99, emoji: '🩱' },
  { id: 5, name: 'Slim Fit Jeans', category: 'Bottoms', price: 59.99, emoji: '👖' },
  { id: 6, name: 'Wide Leg Trousers', category: 'Bottoms', price: 54.99, emoji: '👖' },
  { id: 7, name: 'High Waist Shorts', category: 'Bottoms', price: 32.99, emoji: '🩳' },
  { id: 8, name: 'Midi Skirt', category: 'Bottoms', price: 44.99, emoji: '👗' },
  { id: 9, name: 'Summer Dress', category: 'Dresses', price: 69.99, emoji: '👗' },
  { id: 10, name: 'Knit Dress', category: 'Dresses', price: 64.99, emoji: '👗' },
  { id: 11, name: 'Denim Jacket', category: 'Outerwear', price: 79.99, emoji: '🧥' },
  { id: 12, name: 'Puffer Vest', category: 'Outerwear', price: 89.99, emoji: '🦺' },
  { id: 13, name: 'Teddy Bear', category: 'Toys', price: 19.99, emoji: '🧸' },
  { id: 14, name: 'Building Blocks Set', category: 'Toys', price: 29.99, emoji: '🧱' },
  { id: 15, name: 'Remote Control Car', category: 'Toys', price: 44.99, emoji: '🚗' },
  { id: 16, name: 'Board Game', category: 'Toys', price: 24.99, emoji: '🎲' },
  { id: 17, name: 'Stuffed Bunny', category: 'Toys', price: 14.99, emoji: '🐰' },
  { id: 18, name: 'Toy Car', category: 'Toys', price: 12.99, emoji: '🚙' },
  { id: 19, name: 'Puzzle Set', category: 'Toys', price: 17.99, emoji: '🧩' },
  { id: 20, name: 'Action Figure', category: 'Toys', price: 21.99, emoji: '🦸' },
  { id: 21, name: 'Rubber Duck', category: 'Toys', price: 5.99, emoji: '🦆' },
  { id: 22, name: 'Plush Dinosaur', category: 'Toys', price: 18.99, emoji: '🦕' },
  { id: 23, name: 'Sunflower Bouquet', category: 'Flowers', price: 14.99, emoji: '🌻' },
  { id: 24, name: 'Rose Arrangement', category: 'Flowers', price: 24.99, emoji: '🌹' },
];

let cart = [];
const CART_KEY = 'threads-cart';

// DOM
const productsEl = document.getElementById('products');
const searchInput = document.getElementById('search');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Load cart from storage
function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch (_) {}
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = count;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function renderProducts(list) {
  if (!list.length) {
    productsEl.innerHTML = '<p class="no-results">No items match your search. Try something else.</p>';
    return;
  }
  productsEl.innerHTML = list
    .map(
      (p) => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image">${p.emoji}</div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">$${p.price.toFixed(2)}</p>
        <button type="button" class="add-cart" data-id="${p.id}">Add to cart</button>
      </div>
    </article>
  `
    )
    .join('');

  productsEl.querySelectorAll('.add-cart').forEach((btn) => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  const existing = cart.find((i) => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  // Optional: open cart briefly or show feedback
  cartDrawer.classList.add('is-open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.classList.add('is-open');
  cartOverlay.setAttribute('aria-hidden', 'false');
  renderCartItems();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCartItems();
}

function renderCartItems() {
  if (!cart.length) {
    cartItems.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
    return;
  }
  cartItems.innerHTML = cart
    .map(
      (item) => `
    <li class="cart-item">
      <div class="cart-item-image">${item.emoji}</div>
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)} ${item.qty > 1 ? `(${item.qty}×)` : ''}</p>
        <button type="button" class="cart-item-remove" data-id="${item.id}">Remove</button>
      </div>
    </li>
  `
    )
    .join('');

  cartItems.querySelectorAll('.cart-item-remove').forEach((btn) => {
    btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
  });
}

function openCart() {
  cartDrawer.classList.add('is-open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  cartOverlay.classList.add('is-open');
  cartOverlay.setAttribute('aria-hidden', 'false');
  renderCartItems();
}

function closeCartDrawer() {
  cartDrawer.classList.remove('is-open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartOverlay.classList.remove('is-open');
  cartOverlay.setAttribute('aria-hidden', 'true');
}

function filterProducts() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    renderProducts(products);
    return;
  }
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
  renderProducts(filtered);
}

// Init
loadCart();
updateCartUI();
renderProducts(products);

searchInput.addEventListener('input', filterProducts);
searchInput.addEventListener('search', filterProducts);

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartDrawer);
cartOverlay.addEventListener('click', closeCartDrawer);

checkoutBtn.addEventListener('click', () => {
  if (cart.length) alert('Checkout is for demo only. Thanks for trying the cart!');
});
