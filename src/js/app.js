// Ambil variabel 'products' dari file data.js
import { products } from "./data.js";

// Tes datanya berhasil masuk atau engga
// console.log("--- Data Produk Berhasil Di-import ---");
// console.log(products);

const searchInput = document.getElementById("searchInput");
const container = document.querySelector(".container");

function renderProduct(dataArray) {
  let htmlContent = "";
  if (dataArray.length === 0) {
    htmlContent += `<p class="empty-state">Produk tidak ditemukan, coba kata kunci lain.</p>.`;
  } else {
    dataArray.forEach((produk) => {
      htmlContent += `
      <div class="card bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
      <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">${produk.category}</span
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
  console.log(e.target.value);
  renderProduct(filteredProducts);
});

container.addEventListener("click", (e) => {
  console.log(e.target);
  console.log(e.target.dataset.id);
});
