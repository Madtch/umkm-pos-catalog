// Ambil variabel 'products' dari file data.js
import { products } from "./data.js";

// Tes apakah datanya berhasil masuk
console.log("--- Data Produk Berhasil Di-import ---");
console.log(products);

const container = document.querySelector(".container");
let htmlContent = "";

function renderProduct(dataArray) {
  dataArray.forEach((produk) => {
    htmlContent += `
  <div class="card">
    <h3>${produk.name}</h3>
    <p>Harga: Rp ${produk.price}</p>
  </div>
`;
  });
  container.innerHTML = htmlContent;
}

renderProduct(products);
