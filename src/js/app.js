// Ambil variabel 'products' dari file data.js
import { products } from "./data.js";

// Tes datanya berhasil masuk atau engga
// console.log("--- Data Produk Berhasil Di-import ---");
// console.log(products);

let cart = [];
const searchInput = document.getElementById("searchInput");
const container = document.querySelector(".container");
const cartContainer = document.getElementById("cartContainer");

function renderProduct(dataArray) {
  let htmlContent = "";
  if (dataArray.length === 0) {
    htmlContent += `<p class="empty-state">Produk tidak ditemukan, coba kata kunci lain.</p>.`;
  } else {
    dataArray.forEach((produk) => {
      htmlContent += `
      <div class="card bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
      <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">${produk.category}</span>
      <h3 class="text-lg font-bold text-gray-800 my-1">${produk.name}</h3>
      <p class="text-gray-600 font-medium mb-4">Harga: Rp ${produk.price}</p>
      <button class="bg-blue-600 text-white font-medium w-full py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" data-id="${produk.id}">Tambah ke Keranjang</button> 
      </div>
      `;
    });
  }
  container.innerHTML = htmlContent;
}

renderProduct(products);

searchInput.addEventListener("input", (e) => {
  // 1. Ambil teks ketikan user:
  const keyword = e.target.value.toLowerCase();

  // 2. Filter array 'products' berdasarkan 'keyword':
  const filteredProducts = products.filter((produk) => {
    return produk.name.toLowerCase().includes(keyword);
  });
  // 3. Render ulang UI dengan data yang sudah difilter:
  // console.log(e.target.value);
  renderProduct(filteredProducts);
});

container.addEventListener("click", (e) => {
  // console.log(e.target);
  // console.log(e.target.dataset.id);
  const ID = e.target.dataset.id;
  if (e.target.dataset.id) {
    // console.log(e.target.dataset.id + "Tes");
    const productID = Number(ID);
    const targetProduct = products.find((item) => item.id === productID);
    const itemInCart = cart.find((item) => item.id === productID);
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      cart.push({ ...targetProduct, quantity: 1 });
    }
  }
  console.log(cart);
  renderCart();
});

cartContainer.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  const id = Number(e.target.dataset.id);

  if (!action) return;

  const item = cart.find((item) => {
    return item.id === id;
  });

  // if (action === "increase") {
  //   item.quantity += 1;
  // } else if (action === "decrease") {
  //   if (item.quantity > 1) {
  //     item.quantity -= 1;
  //   } else item.quantity === 1;
  //   cart = cart.filter((cartItem) => {
  //     cartItem.id !== id;
  //   });
  // } else if (action === "delete")
  //   cart = cart.filter((cartItem) => cartItem.id !== id);

  switch (action) {
    case "increase":
      item.quantity += 1;
      break;
    case "decrease":
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart = cart.filter((cartItem) => cartItem.id !== id);
      }
      break;
    case "delete":
      cart = cart.filter((cartItem) => cartItem.id !== id);
      break;
  }

  renderCart();
});

function renderCart() {
  let htmlCart = "";

  // (Keranjang Kosong)
  if (cart.length === 0) {
    cartContainer.innerHTML = `
    <h2 class="text-xl font-bold mb-4 border-b pb-2">Keranjang Belanja</h2>
    <p class="text-gray-400 text-center py-8">Keranjang masih kosong</p>
    `;
    return; // Berhenti
  }

  // Jika Keranjang Ada Isinya
  htmlCart = `<h2 class="text-xl font-bold mb-4 border-b pb-2">Keranjang Belanja</h2>`;
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity; // Hitung total DI DALAM loop
    htmlCart += `
    <div class="flex justify-between items-center border-b pb-3 mb-3">
    <div>
    <button data-id="${item.id}" data-action="decrease">-</button>
    <span>${item.quantity}</span>
    <button data-id="${item.id}" data-action="increase">+</button>
    <button data-id="${item.id}" data-action="delete">Hapus</button>
    <h4 class="font-bold text-gray-800">${item.name}</h4>
    <p class="text-sm text-gray-500">Rp ${item.price} x ${item.quantity}</p>
    </div>
    <span class="font-bold text-blue-600">Rp ${item.price * item.quantity}</span>
    </div>
    `;
  });

  // Tambahkan Total & Tombol Checkout
  htmlCart += `
  <div class="mt-6 pt-4 border-t border-gray-200">
    <div class="flex justify-between items-center text-lg font-bold mb-4">
      <span>Total:</span>
      <span class="text-blue-600">Rp ${total}</span>
    </div>
    <button class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
      Checkout / Bayar
    </button>
  </div>
`;

  // Render ke DOM
  cartContainer.innerHTML = htmlCart;
}

renderCart();
