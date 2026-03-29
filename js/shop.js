const SF = `https://under-design-shop.myshopify.com/api/2024-01/graphql.json`;
const ST = 'b6401a2b2ce8bef08562615388c7d7af';
const q = query => fetch(SF, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': ST }, body: JSON.stringify({ query }) }).then(r => r.json()).then(j => j.data);
const n = edges => edges.map(e => e.node);

const PRODUCT = `id title handle descriptionHtml
  priceRange { minVariantPrice { amount currencyCode } }
  images(first:10) { edges { node { url altText } } }
  variants(first:10) { edges { node { id title availableForSale price { amount currencyCode } } } }`;

const CART = `id checkoutUrl totalQuantity
  lines(first:50) { edges { node { id quantity merchandise { ...on ProductVariant {
    id title product { title handle } image { url } price { amount currencyCode }
  } } } } }
  cost { totalAmount { amount currencyCode } }`;

// Cart
async function cart() {
  const id = localStorage.getItem('cart');
  if (id) { const d = await q(`{ cart(id:"${id}") { ${CART} } }`); if (d.cart) return d.cart; }
  const d = await q(`mutation { cartCreate { cart { ${CART} } } }`);
  localStorage.setItem('cart', d.cartCreate.cart.id);
  return d.cartCreate.cart;
}

async function addToCart(vid) {
  const c = await cart();
  const d = await q(`mutation { cartLinesAdd(cartId:"${c.id}", lines:[{merchandiseId:"${vid}",quantity:1}]) { cart { ${CART} } } }`);
  sync(d.cartLinesAdd.cart);
  openCart();
}

async function updateLine(lid, qty) {
  const id = localStorage.getItem('cart');
  const op = qty ? 'cartLinesUpdate' : 'cartLinesRemove';
  const args = qty ? `lines:[{id:"${lid}",quantity:${qty}}]` : `lineIds:["${lid}"]`;
  const d = await q(`mutation { ${op}(cartId:"${id}", ${args}) { cart { ${CART} } } }`);
  sync(d[op].cart);
}

function sync(c) {
  localStorage.setItem('cart', c.id);
  renderCart(c);
  const b = document.getElementById('cart-count');
  if (b) { b.textContent = c.totalQuantity || ''; b.style.display = c.totalQuantity ? 'inline' : 'none'; }
}

// Cart UI
function renderCart(c) {
  const d = document.getElementById('cart-drawer');
  if (!d) return;
  const lines = n(c.lines.edges);
  const close = `<div style="display:flex;justify-content:space-between;align-items:center"><span class="text-l">cart</span><span style="cursor:pointer" onclick="closeCart()">&times;</span></div>`;

  if (!lines.length) { d.innerHTML = `${close}<p style="margin-top:var(--l)">empty</p>`; return; }

  d.innerHTML = `${close}
    <div class="column gap-m" style="margin-top:var(--l);flex:1;overflow:auto">${lines.map(l => {
      const m = l.merchandise;
      return `<div class="row gap-s" style="align-items:start">
        ${m.image ? `<img src="${m.image.url}" style="width:64px;height:64px;object-fit:cover">` : ''}
        <div class="column gap-xs" style="flex:1">
          <a href="/store/?product=${m.product.handle}" style="color:inherit">${m.product.title}</a>
          ${m.title !== 'Default Title' ? `<span class="text-s">${m.title}</span>` : ''}
          <span>${m.price.amount} ${m.price.currencyCode}</span>
          <div class="row gap-s" style="align-items:center">
            <button class="qty-btn" onclick="updateLine('${l.id}',${l.quantity - 1})">&minus;</button>
            <span>${l.quantity}</span>
            <button class="qty-btn" onclick="updateLine('${l.id}',${l.quantity + 1})">+</button>
          </div>
        </div>
      </div>`;
    }).join('')}</div>
    <div class="column gap-s" style="margin-top:var(--l);border-top:1px solid currentColor;padding-top:var(--m)">
      <div class="row" style="justify-content:space-between"><span class="text-l">total</span><span class="text-l">${c.cost.totalAmount.amount} ${c.cost.totalAmount.currencyCode}</span></div>
      <button class="buy-btn" style="width:100%;text-align:center" onclick="location.href='${c.checkoutUrl}'">checkout</button>
    </div>`;
}

function openCart() { document.getElementById('cart-drawer')?.classList.add('open'); document.getElementById('cart-overlay')?.classList.add('open'); }
function closeCart() { document.getElementById('cart-drawer')?.classList.remove('open'); document.getElementById('cart-overlay')?.classList.remove('open'); }

// Products
function renderGrid(products, el) {
  el.innerHTML = products.map(p => {
    const img = p.images.edges[0]?.node;
    const pr = p.priceRange.minVariantPrice;
    return `<a class="product-card column gap-s" href="?product=${p.handle}">
      ${img ? `<img src="${img.url}" alt="${img.altText || p.title}">` : ''}
      <span class="text-l">${p.title}</span><span>${pr.amount} ${pr.currencyCode}</span>
    </a>`;
  }).join('');
}

function renderProduct(p, el) {
  const images = n(p.images.edges), variants = n(p.variants.edges);
  const multi = variants.length > 1 && variants[0].title !== 'Default Title';
  const v = variants[0];

  el.innerHTML = `<div class="product-detail">
    <a href="/store/" style="display:inline-block;margin-bottom:var(--l)">&larr; back</a>
    <div class="product-layout">
      <div class="column gap-s">${images.map(i => `<img src="${i.url}" alt="${i.altText || p.title}" style="width:100%">`).join('')}</div>
      <div class="product-info column gap-m">
        <h1 class="text-xl">${p.title}</h1>
        <span class="text-l">${v.price.amount} ${v.price.currencyCode}</span>
        ${multi ? `<select class="variant-select" onchange="this.parentNode.querySelector('.add-btn').dataset.variant=this.value">${variants.map(x => `<option value="${x.id}" ${!x.availableForSale ? 'disabled' : ''}>${x.title}</option>`).join('')}</select>` : ''}
        <button class="add-btn buy-btn" data-variant="${v.id}" onclick="addToCart(this.dataset.variant)" ${!v.availableForSale ? 'disabled' : ''}>${v.availableForSale ? 'add to cart' : 'sold out'}</button>
        <div class="text-m">${p.descriptionHtml}</div>
      </div>
    </div>
  </div>`;
}

// Init
class UnderStore extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = '<p>loading...</p>';
    const handle = new URLSearchParams(location.search).get('product');
    try {
      if (handle) {
        const d = await q(`{ product(handle:"${handle}") { ${PRODUCT} } }`);
        d.product ? renderProduct(d.product, this) : this.innerHTML = '<p>not found</p>';
      } else {
        const d = await q(`{ products(first:20) { edges { node { ${PRODUCT} } } } }`);
        const p = n(d.products.edges);
        p.length ? renderGrid(p, this) : this.innerHTML = '<p>no products yet</p>';
      }
    } catch(e) { this.innerHTML = '<p>could not load</p>'; console.error(e); }
  }
}
customElements.define('under-store', UnderStore);

// Cart drawer setup
document.body.insertAdjacentHTML('beforeend', '<div id="cart-overlay" onclick="closeCart()"></div><div id="cart-drawer"></div>');
cart().then(sync);
