const API_URL = "https://interveiw-mock-api.vercel.app/api/getProducts";
const loadButton = document.getElementById("loadButton");
const emptyState = document.getElementById("emptyState");
const productGrid = document.getElementById("productGrid");
const list = document.getElementById("list");
const proCount = document.getElementById("proCount");
const mainContent = document.querySelector(".main");
const loaderScreen = document.getElementById("loader-wrapper");


let products = [];
window.addEventListener("load", () => {
  setTimeout(() => {
    loaderScreen.style.display = "none";      // Hiding loader
    mainContent.style.display = "block";      // Show main content
  }, 3000); 
});

// Fetching API
loadButton.addEventListener("click", async () => {
  loadButton.classList.add("loading");
  try {
    const res = await fetch(API_URL);
    const result = await res.json();

    // Map the products
    products = result.data.map((item) => {
      const p = item.product;
      return {
        title: p.title,
        price: parseFloat(p.variants[0].price),
        image: p.image?.src,
        description: p.product_type || p.tags || "Snowboard",
      };
    });

    renderProducts(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    productGrid.innerHTML = "<p style='color:red;'>Failed to load products.</p>";
  }
});

// Sorting Products based on Price
list.addEventListener("change", () => {
  if (!products.length) return;

  const sorted = [...products];
  if (list.value === "low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (list.value === "high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  renderProducts(sorted);
});

// Pushing to HTML 
function renderProducts(productList) {
  productGrid.innerHTML = "";
  proCount.innerText = `${productList.length} Products`;

  if (productList.length === 0) {
    productGrid.appendChild(emptyState);
    return;
  }

  productList.forEach((product, index) => {
    const delay = index * 100;

    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${delay}ms`;

    card.innerHTML = `
  <img src="${product.image}" alt="${product.title}" />
  <h3>${product.title}</h3>
  <div class="price">Rs. ${product.price.toFixed(2)}</div>
  <button class="add-btn">ADD TO CART</button>
`;
    productGrid.appendChild(card);
  });
}
