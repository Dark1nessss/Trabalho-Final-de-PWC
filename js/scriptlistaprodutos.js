document.addEventListener('DOMContentLoaded', function () {
    const productList = document.querySelector('.product-list');

    function fetchProducts() {
        fetch('/api/products')
            .then(response => response.json())
            .then(products => {
                productList.innerHTML = '';
                products.forEach(product => {
                    const productElement = document.createElement('div');
                    productElement.classList.add('produto');

                    productElement.innerHTML = `
                        <div class="img-produto">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <h3>${product.name}</h3>
                        <p>Preço: €${product.price}</p>
                        <a href="detalhesproduto.html?id=${product.id}" class="btn">Detalhes</a>
                    `;

                    productList.appendChild(productElement);
                });
            });
    }

    fetchProducts();
});
