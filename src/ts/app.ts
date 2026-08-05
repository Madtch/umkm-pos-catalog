// Ambil variabel 'products' dari file data.js
// import { products } from "./data.ts";
import { Product, CartItem, Coupon } from "./types.ts";

// Tes datanya berhasil masuk atau engga
// console.log("--- Data Produk Berhasil Di-import ---");
// console.log(products);

const newCoupon: Coupon = {
  code: "Promo",
  discountPercentage: 60,
  isActive: true,
};

// State Aplikasi
let allProducts: Product[] = [];
let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
let appliedDiscount: number = 0;
let couponMessageText: string = "";

// DOM Elements
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const container = document.querySelector(".container") as HTMLElement;
const cartContainer = document.getElementById("cartContainer") as HTMLElement;

function renderProduct(dataArray: Product[]) {
  let htmlContent = "";
  if (dataArray.length === 0) {
    htmlContent += `<p class="empty-state">Produk tidak ditemukan, coba kata kunci lain.</p>.`;
  } else {
    dataArray.forEach((produk) => {
      htmlContent += `
      <div class="card bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
      <img class="h-48 object-contain mx-auto mb-4" src="${produk.image}" alt="${produk.name}">
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

// Event Search
searchInput.addEventListener("input", (e) => {
  // const target = e.target as HTMLInputElement;
  // 1. Ambil teks ketikan user:
  const target = e.target as HTMLInputElement;
  const keyword = target.value.toLocaleLowerCase();

  // 2. Filter array 'products' berdasarkan 'keyword':
  const filteredProducts = allProducts.filter((produk) => {
    return produk.name.toLowerCase().includes(keyword);
  });
  // 3. Render ulang UI dengan data yang sudah difilter:
  // console.log(e.target.value);
  renderProduct(filteredProducts);
});

// Event tambah keranjang
container.addEventListener("click", (e) => {
  // console.log(e.target);
  // console.log(e.target.dataset.id);
  const target = e.target as HTMLElement;
  const idString = target.dataset.id;
  if (idString) {
    // console.log(e.target.dataset.id + "Tes");
    const productID = Number(idString);
    const targetProduct = allProducts.find((item) => item.id === productID);
    const itemInCart = cart.find((item) => item.id === productID);
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      if (targetProduct) {
        cart.push({ ...targetProduct, quantity: 1 });
      }
    }
  }
  console.log(cart);
  renderCart();
});

// Event Delegation Keranjang, Aksi + Kupon
cartContainer.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  // Penanganan Fitur Kupon
  if (target.id === "apply-coupon-btn") {
    const couponInput = document.getElementById(
      "coupon-input",
    ) as HTMLInputElement;
    const inputCode = couponInput ? couponInput.value.trim() : "";

    if (
      inputCode.toLowerCase() === newCoupon.code.toLowerCase() &&
      newCoupon.isActive
    ) {
      appliedDiscount = newCoupon.discountPercentage;
      couponMessageText = `Kupon berhasil digunakan! Diskon ${appliedDiscount}%`;
    } else {
      appliedDiscount = 0;
      couponMessageText = "Kode kupon tidak valid atau sudah tidak aktif.";
    }
    renderCart();
    return;
  }

  // Penanganan Aksi Item (Increase, Decrease, Delete)
  const action = target.dataset.action;
  const id = Number(target.dataset.id);

  if (!action || isNaN(id)) return;

  const item = cart.find((item) => {
    return item.id === id;
  });

  if (!item) {
    return;
  }

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

  renderCart();
});

// Render Keranjang Belanja
function renderCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  let htmlCart = "";

  // (Keranjang Kosong)
  if (cart.length === 0) {
    appliedDiscount = 0;
    couponMessageText = "";
    cartContainer.innerHTML = `
    <h2 class="text-xl font-bold mb-4 border-b pb-2">Keranjang Belanja</h2>
    <p class="text-gray-400 text-center py-8">Keranjang masih kosong</p>
    `;
    return; // Berhenti
  }

  // Jika Keranjang Ada Isinya
  htmlCart = `<h2 class="text-xl font-bold mb-4 border-b pb-2">Keranjang Belanja</h2>`;
  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity; // Hitung total DI DALAM loop
    htmlCart += `
    <div class="flex justify-between items-center border-b pb-3 mb-3">
        <div>
          <h4 class="font-bold text-gray-800">${item.name}</h4>
          <p class="text-sm text-gray-500">Rp ${item.price.toLocaleString("id-ID")} x ${item.quantity}</p>
          <div class="flex gap-2 mt-2 items-center">
            <button data-id="${item.id}" data-action="decrease" class="bg-gray-200 px-2 rounded font-bold hover:bg-gray-300">-</button>
            <span class="text-sm font-medium">${item.quantity}</span>
            <button data-id="${item.id}" data-action="increase" class="bg-gray-200 px-2 rounded font-bold hover:bg-gray-300">+</button>
            <button data-id="${item.id}" data-action="delete" class="text-red-500 text-xs ml-2 hover:underline">Hapus</button>
          </div>
        </div>
        <span class="font-bold text-blue-600">Rp ${(item.price * item.quantity).toLocaleString("id-ID")}</span>
      </div>
    `;
  });

  // Hitung Diskon & Total Akhir
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const grandTotal = subtotal - discountAmount;

  // Form Kupon + Total + Checkout
  htmlCart += `
      <div class="mt-4 pt-2">
      <div class="flex gap-2 mb-2">
        <input
          type="text"
          id="coupon-input"
          class="border px-3 py-1.5 rounded-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Masukkan kode kupon (misal: Promo)"
        />
        <button id="apply-coupon-btn" class="bg-gray-800 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-900 transition-colors">
          Gunakan
        </button>
      </div>
      ${couponMessageText ? `<p class="text-xs ${appliedDiscount > 0 ? "text-green-600" : "text-red-500"} mb-3">${couponMessageText}</p>` : ""}
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
      <div class="flex justify-between items-center text-sm text-gray-600">
        <span>Subtotal:</span>
        <span>Rp ${subtotal.toLocaleString("id-ID")}</span>
      </div>
      ${
        appliedDiscount > 0
          ? `
      <div class="flex justify-between items-center text-sm text-green-600 font-medium">
        <span>Diskon (${appliedDiscount}%):</span>
        <span>- Rp ${discountAmount.toLocaleString("id-ID")}</span>
      </div>`
          : ""
      }
      <div class="flex justify-between items-center text-lg font-bold pt-2 border-t">
        <span>Total:</span>
        <span class="text-blue-600">Rp ${grandTotal.toLocaleString("id-ID")}</span>
      </div>
      <button class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
        Checkout / Bayar
      </button>
    </div>
  `;

  // Render ke DOM
  cartContainer.innerHTML = htmlCart;
}

// Fetch Data dari API
async function fetchProductsFromAPI() {
  try {
    container.innerHTML = `<p class="text-center py-10">Memuat produk...</p>`;
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    allProducts = data.map((item: any) => {
      return {
        ...item,
        name: item.title,
      };
    });

    renderProduct(allProducts);
  } catch (error) {
    container.innerHTML = `<p class="text-center col-span-3 text-red-500 py-10">Gagal memuat produk. Periksa koneksi internetmu.</p>`;
  }
}

// // Inisialisasi Aplikasi
renderCart();
fetchProductsFromAPI();
