// Shopify Storefront API client
// Replace these with your actual values from Shopify Admin > Settings > Apps > Develop apps
const SHOPIFY_DOMAIN = 'under-design-shop.myshopify.com';
const STOREFRONT_TOKEN = 'b6401a2b2ce8bef08562615388c7d7af';

const STOREFRONT_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

async function shopifyFetch(query) {
  const res = await fetch(STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  return json.data;
}

async function getProducts() {
  const data = await shopifyFetch(`{
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }`);
  return data.products.edges.map(e => e.node);
}

async function buyNow(variantId) {
  const data = await shopifyFetch(`mutation {
    cartCreate(input: {
      lines: [{ merchandiseId: "${variantId}", quantity: 1 }]
    }) {
      cart {
        checkoutUrl
      }
    }
  }`);
  window.location.href = data.cartCreate.cart.checkoutUrl;
}

// Web component
class UnderStore extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = '<p>loading...</p>';
    try {
      const products = await getProducts();
      if (!products.length) {
        this.innerHTML = '<p>no products yet</p>';
        return;
      }
      this.innerHTML = products.map(p => {
        const img = p.images.edges[0]?.node;
        const price = p.priceRange.minVariantPrice;
        const variantId = p.variants.edges[0]?.node.id;
        return `
          <div class="product-card column gap-s">
            ${img ? `<img src="${img.url}" alt="${img.altText || p.title}">` : ''}
            <span class="text-l">${p.title}</span>
            <span>${price.amount} ${price.currencyCode}</span>
            <button class="buy-btn" data-variant="${variantId}">buy</button>
          </div>
        `;
      }).join('');

      this.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', () => buyNow(btn.dataset.variant));
      });
    } catch (err) {
      this.innerHTML = '<p>could not load products</p>';
      console.error(err);
    }
  }
}

customElements.define('under-store', UnderStore);
