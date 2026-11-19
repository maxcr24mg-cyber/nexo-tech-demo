const products = [
  { id: 1, name: "Nova Pro 12 256GB", category: "Celulares", price: 899, rating: 4.9, reviews: 128, badge: "Nuevo", art: "phone" },
  { id: 2, name: "Auriculares Pulse ANC", category: "Audífonos", price: 249, rating: 4.8, reviews: 94, badge: "Top", art: "headphone" },
  { id: 3, name: "Smart TV Nexo 55” 4K", category: "Televisores", price: 649, rating: 4.7, reviews: 76, badge: "-15%", art: "tv" },
  { id: 4, name: "Laptop AirBook S14", category: "Laptops", price: 1099, rating: 4.9, reviews: 61, badge: "Nuevo", art: "laptop" },
  { id: 5, name: "Reloj Connect X2", category: "Accesorios", price: 179, rating: 4.6, reviews: 88, badge: "Popular", art: "watch" },
  { id: 6, name: "Altavoz Mini Home", category: "Hogar inteligente", price: 129, rating: 4.7, reviews: 53, badge: "Oferta", art: "speaker" },
  { id: 7, name: "OnePhone Lite 128GB", category: "Celulares", price: 499, rating: 4.5, reviews: 102, badge: "", art: "phone" },
  { id: 8, name: "Teclado mecánico Wave", category: "Accesorios", price: 89, rating: 4.8, reviews: 47, badge: "Top", art: "keyboard" }
];

const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const cart = new Map();

function formatPrice(value) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function normalizeText(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function artMarkup(type) {
  if (type === "phone") return '<div class="product-art phone-art"></div>';
  if (type === "headphone") return '<div class="product-art headphone-art"></div>';
  if (type === "watch") return '<div class="product-art watch-art"></div>';
  if (type === "tv") return '<div class="product-art"><svg viewBox="0 0 130 130"><rect x="15" y="24" width="100" height="69" rx="5"/><path d="M52 109h26M65 93v16"/><path d="m45 58 13 13 27-27" opacity=".45"/></svg></div>';
  if (type === "laptop") return '<div class="product-art"><svg viewBox="0 0 130 130"><rect x="25" y="29" width="80" height="53" rx="4"/><path d="m17 92 96 0-8 12H25Z"/><path d="M55 103h20"/></svg></div>';
  if (type === "speaker") return '<div class="product-art"><svg viewBox="0 0 130 130"><rect x="42" y="22" width="46" height="88" rx="23"/><circle cx="65" cy="74" r="15"/><circle cx="65" cy="74" r="5"/><circle cx="65" cy="42" r="4"/></svg></div>';
  return '<div class="product-art"><svg viewBox="0 0 130 130"><rect x="22" y="44" width="86" height="44" rx="8"/><path d="M35 57h5M48 57h5M61 57h5M74 57h5M87 57h5M35 69h5M48 69h34M89 69h5"/><path d="M51 88h28"/></svg></div>';
}

function renderProducts(items) {
  productGrid.innerHTML = items.map(product => `
    <article class="product-card">
      <div class="product-image">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        ${artMarkup(product.art)}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="rating">★★★★★ <span>${product.rating} (${product.reviews})</span></div>
        <div class="product-bottom">
          <strong class="price">${formatPrice(product.price)}</strong>
          <button class="add-button" type="button" data-id="${product.id}" aria-label="Agregar ${product.name} al carrito">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = items.length !== 0;
}

let activeCategory = "Todos";
function applyFilters() {
  const query = normalizeText(searchInput.value.trim());
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch = !query || normalizeText(`${product.name} ${product.category}`).includes(query);
    return matchesCategory && matchesSearch;
  });
  renderProducts(filtered);
}

function setActiveCategory(category) {
  activeCategory = category;
  document.querySelectorAll(".filter").forEach(button => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

document.getElementById("searchForm").addEventListener("submit", event => event.preventDefault());
searchInput.addEventListener("input", applyFilters);

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest(".filter");
  if (!button) return;
  setActiveCategory(button.dataset.category);
  applyFilters();
});

document.getElementById("categoryGrid").addEventListener("click", event => {
  const card = event.target.closest(".category-card");
  if (!card) return;
  setActiveCategory(card.dataset.category);
  applyFilters();
  document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
});

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function updateCart() {
  let count = 0;
  let total = 0;
  const items = [];
  cart.forEach((quantity, id) => {
    const product = products.find(item => item.id === id);
    if (!product) return;
    count += quantity;
    total += product.price * quantity;
    items.push({ product, quantity });
  });

  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = `(${count})`;
  document.getElementById("cartTotal").textContent = formatPrice(total);

  const cartItems = document.getElementById("cartItems");
  document.getElementById("cartFooter").classList.toggle("hidden", items.length === 0);
  if (!items.length) {
    cartItems.innerHTML = `<div class="cart-empty"><svg viewBox="0 0 24 24"><path d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20.5 7H6.2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg><strong>Tu carrito está vacío</strong><span>Agrega productos para comenzar.</span></div>`;
    return;
  }
  cartItems.innerHTML = items.map(({ product, quantity }) => `
    <div class="cart-item">
      <div class="cart-item-image">${product.category === "Celulares" ? "C" : product.category.slice(0, 1)}</div>
      <div class="cart-item-info">
        <h3>${product.name}</h3>
        <strong>${formatPrice(product.price)}</strong>
        <div class="quantity">
          <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Disminuir cantidad">−</button>
          <span>${quantity}</span>
          <button type="button" data-action="increase" data-id="${product.id}" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-action="remove" data-id="${product.id}" aria-label="Eliminar ${product.name}">×</button>
    </div>
  `).join("");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest(".add-button");
  if (!button) return;
  const id = Number(button.dataset.id);
  cart.set(id, (cart.get(id) || 0) + 1);
  updateCart();
  showToast("Producto agregado al carrito");
});

document.getElementById("cartItems").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.dataset.id);
  const quantity = cart.get(id) || 0;
  if (button.dataset.action === "increase") cart.set(id, quantity + 1);
  if (button.dataset.action === "decrease") quantity > 1 ? cart.set(id, quantity - 1) : cart.delete(id);
  if (button.dataset.action === "remove") cart.delete(id);
  updateCart();
});

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
document.getElementById("checkoutButton").addEventListener("click", () => showToast("Esta es una demostración, no se procesará el pago"));

renderProducts(products);
updateCart();
