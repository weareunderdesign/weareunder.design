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

// Routing
function getHandle() {
  const parts = location.pathname.replace(/\/$/, '').split('/');
  // /store/some-handle → parts = ['', 'store', 'some-handle']
  return parts.length >= 3 && parts[2] ? parts[2] : null;
}

function navigate(handle) {
  const path = handle ? `/store/${handle}` : '/store/';
  history.pushState({}, '', path);
  initStore();
}

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
  if (b) { b.textContent = c.totalQuantity || ''; b.style.display = c.totalQuantity ? 'flex' : 'none'; }
}

// Cart UI
function renderCart(c) {
  const d = document.getElementById('cart-drawer');
  if (!d) return;
  const lines = n(c.lines.edges);
  const close = `<div class="row justify-stretch align-center padding-l"><span class="text-l">cart</span><span style="cursor:pointer" onclick="closeCart()">&times;</span></div>`;

  if (!lines.length) { d.innerHTML = `${close}<p class="padding-l">empty</p>`; return; }

  d.innerHTML = `${close}
    <div class="column gap-m padding-l" style="flex:1;overflow:auto">${lines.map(l => {
      const m = l.merchandise;
      return `<div class="row gap-s">
        ${m.image ? `<img src="${m.image.url}" style="width:64px;height:64px;object-fit:cover;flex-shrink:0">` : ''}
        <div class="column gap-xs" style="flex:1">
          <a href="/store/${m.product.handle}">${m.product.title}</a>
          ${m.title !== 'Default Title' ? `<span class="text-s">${m.title}</span>` : ''}
          <span>${m.price.amount} ${m.price.currencyCode}</span>
          <div class="row gap-s align-center">
            <button style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid currentColor;background:none;cursor:pointer;font:inherit" onclick="updateLine('${l.id}',${l.quantity - 1})">&minus;</button>
            <span>${l.quantity}</span>
            <button style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid currentColor;background:none;cursor:pointer;font:inherit" onclick="updateLine('${l.id}',${l.quantity + 1})">+</button>
          </div>
        </div>
      </div>`;
    }).join('')}</div>
    <div class="column gap-s padding-l border-top">
      <div class="row justify-stretch"><span class="text-l">total</span><span class="text-l">${c.cost.totalAmount.amount} ${c.cost.totalAmount.currencyCode}</span></div>
      <button style="width:100%;text-align:center;border:1px solid currentColor;background:none;color:inherit;padding:calc(var(--base-size)*2) calc(var(--base-size)*3);cursor:pointer;font:inherit" onclick="location.href='${c.checkoutUrl}'">checkout</button>
    </div>`;
}

function openCart() { document.getElementById('cart-drawer')?.classList.add('open'); document.getElementById('cart-overlay')?.classList.add('open'); }
function closeCart() { document.getElementById('cart-drawer')?.classList.remove('open'); document.getElementById('cart-overlay')?.classList.remove('open'); }

// Products
function renderGrid(products, el) {
  el.innerHTML = products.map(p => {
    const img = p.images.edges[0]?.node;
    const pr = p.priceRange.minVariantPrice;
    return `<a class="column gap-s" href="/store/${p.handle}" onclick="event.preventDefault();navigate('${p.handle}')" style="text-decoration:none;color:inherit">
      ${img ? `<img src="${img.url}" alt="${img.altText || p.title}" style="width:100%;aspect-ratio:1;object-fit:cover">` : ''}
      <span class="text-l">${p.title}</span><span>${pr.amount} ${pr.currencyCode}</span>
    </a>`;
  }).join('');
}

function renderProduct(p, el) {
  const images = n(p.images.edges), variants = n(p.variants.edges);
  const multi = variants.length > 1 && variants[0].title !== 'Default Title';
  const v = variants[0];

  el.innerHTML = `<div class="product-detail">
    <div class="row gap-xl">
      <div class="column gap-s box">${images.map(i => `<img src="${i.url}" alt="${i.altText || p.title}" style="width:100%">`).join('')}</div>
      <div class="column gap-m box" style="position:sticky;top:120px;align-self:start">
        <h1 class="text-xl">${p.title}</h1>
        <span class="text-l">${v.price.amount} ${v.price.currencyCode}</span>
        ${multi ? `<select style="border:1px solid currentColor;background:none;color:inherit;padding:calc(var(--base-size)*2) calc(var(--base-size)*3);cursor:pointer;font:inherit" onchange="this.parentNode.querySelector('.add-btn').dataset.variant=this.value">${variants.map(x => `<option value="${x.id}" ${!x.availableForSale ? 'disabled' : ''}>${x.title}</option>`).join('')}</select>` : ''}
        <button class="add-btn" data-variant="${v.id}" onclick="addToCart(this.dataset.variant)" ${!v.availableForSale ? 'disabled' : ''} style="width:fit-content;border:1px solid currentColor;background:none;color:inherit;padding:calc(var(--base-size)*2) calc(var(--base-size)*3);cursor:pointer;font:inherit;${!v.availableForSale ? 'opacity:0.4;cursor:not-allowed' : ''}">${v.availableForSale ? 'add to cart' : 'sold out'}</button>
        <div>${p.descriptionHtml}</div>
      </div>
    </div>
  </div>`;
}

// Init
async function initStore() {
  const el = document.querySelector('under-store');
  if (!el) return;
  el.innerHTML = '<p>loading...</p>';
  const handle = getHandle();
  try {
    if (handle) {
      const d = await q(`{ product(handle:"${handle}") { ${PRODUCT} } }`);
      d.product ? renderProduct(d.product, el) : el.innerHTML = '<p>not found</p>';
    } else {
      const d = await q(`{ products(first:20) { edges { node { ${PRODUCT} } } } }`);
      const p = n(d.products.edges);
      p.length ? renderGrid(p, el) : el.innerHTML = '<p>no products yet</p>';
    }
  } catch(e) { el.innerHTML = '<p>could not load</p>'; console.error(e); }
}

class UnderStore extends HTMLElement {
  connectedCallback() { initStore(); }
}
customElements.define('under-store', UnderStore);

window.addEventListener('popstate', initStore);

// Cart drawer setup
document.body.insertAdjacentHTML('beforeend', '<div id="cart-overlay" onclick="closeCart()"></div><div id="cart-drawer"></div>');
cart().then(sync);
