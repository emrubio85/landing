"use strict";
import { fetchProduct, fetchCategories } from "./functions";
import { saveVote, getVotes } from "./firebase";

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

/**
 * RENDER SINCRONICO
 */
const renderProducts = () => {
    fetchProduct('https://data-dawm.github.io/datum/reseller/products.json')
    .then(result => {
        if (result.success) {
            const container = document.getElementById('products-container');
            container.innerHTML = '';

            const products = result.body.slice(0, 6);

            products.forEach(product => {
                let productHTML = `
                    <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                        <img
                            class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                            src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
                        <h3
                            class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
                            $[PRODUCT.PRICE]
                        </h3>

                        <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
                            <div class="space-y-2">
                                <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                                    Ver en Amazon
                                </a>
                                <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
                            </div>
                        </div>
                    </div>`;

                productHTML = productHTML.replaceAll('[PRODUCT.IMGURL]', product.imgUrl);
                productHTML = productHTML.replaceAll('[PRODUCT.TITLE]', product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title);
                productHTML = productHTML.replaceAll('[PRODUCT.PRICE]', product.price);
                productHTML = productHTML.replaceAll('[PRODUCT.PRODUCTURL]', product.productURL);
                productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id);
                
                container.innerHTML += productHTML;
            });
        } else {
            alert('Error: '+ result.message);
        }
    });
};

/**
 * RENDER ASINCRONICO
 */
const renderCategories = async () => {
  try {
    const result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml');

    if (result.success) {
      const container = document.getElementById('categories');
      container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;

      const categoriesXML = result.body;
      const categories = categoriesXML.getElementsByTagName('category');

      for (let category of categories) {
        let categoryHTML = `<option value="[ID]">[NAME]</option>`;

        const id = category.getElementsByTagName('id')[0].textContent;
        const name = category.getElementsByTagName('name')[0].textContent;

        categoryHTML = categoryHTML.replace('[ID]', id);
        categoryHTML = categoryHTML.replace('[NAME]', name);

        container.innerHTML += categoryHTML;
      }
    } else {
      alert('Error: ' + result.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

const enableForm = () => {
  const form = document.getElementById('form_voting');

  form.addEventListener('voto', async (event) => {
    event.preventDefault();

    const select = document.getElementById('select_product');
    const productID = select.value;

    try {
      const result = await saveVote(productID);
      alert(result.message);
    } catch (error) {
      alert('Error inesperado: ' + error.message);
    }
  });
};

const displayVotes = async () => {
  const result = await getVotes();

  const container = document.getElementById('results');
  container.innerHTML = ''; // Limpiar contenido previo

  if (result.status == 'success') {
    const votes = result.data;

    // Contar votos por productID
    const voteCounts = {};
    for (let key in votes) {
      const productID = votes[key].productID;
      voteCounts[productID] = (voteCounts[productID] || 0) + 1;
    }

    // Crear tabla HTML
    let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Total de Votos</th>
          </tr>
        </thead>
        <tbody>
    `;

    for (let productID in voteCounts) {
      tableHTML += `
        <tr>
          <td>${productID}</td>
          <td>${voteCounts[productID]}</td>
        </tr>
      `;
    }

    tableHTML += `
        </tbody>
      </table>
    `;

    container.innerHTML = tableHTML;
  } else {
    container.innerHTML = `<p>${result.message}</p>`;
  }
};

(() => {
    showToast();
    showVideo();
    renderProducts();
    renderCategories();
    enableForm();
    displayVotes();
})();