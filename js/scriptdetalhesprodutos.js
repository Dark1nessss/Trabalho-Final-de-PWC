document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const addToCartButton = document.querySelector('.add-cart');

    function fetchProductDetails() {
        fetch(`/api/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('product-image').src = product.image;
                document.getElementById('product-name').textContent = product.name;
                document.getElementById('product-name-breadcrumb').textContent = product.name;
                document.getElementById('product-price').textContent = `€${product.price}`;
                document.getElementById('product-sale-price').textContent = `€${product.sale_price}`;
                document.getElementById('product-description').textContent = product.description;
                
                // Render stars
                const starsContainer = document.getElementById('product-stars');
                starsContainer.innerHTML = '';
                for (let i = 0; i < 5; i++) {
                    const star = document.createElement('span');
                    star.className = 'bx';
                    if (i < product.stars) {
                        star.classList.add('bxs-star');
                    } else {
                        star.classList.add('bx-star');
                    }
                    starsContainer.appendChild(star);
                }

                // Assuming the product images are stored as image paths in the database
                document.getElementById('thumbnail-1').src = product.thumbnail1;
                document.getElementById('thumbnail-2').src = product.thumbnail2;
                document.getElementById('thumbnail-3').src = product.thumbnail3;
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    }

    addToCartButton.addEventListener('click', function () {
        const selectedSize = document.querySelector('input[name="size"]:checked');
        const selectedColor = document.querySelector('input[name="color"]:checked');

        if (!selectedSize || !selectedColor) {
            showToast('Por favor, selecione tamanho e cor');
            return;
        }

        fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id: productId, size: selectedSize.value, color: selectedColor.value, quantity: 1 })
        })
        .then(response => response.json())
        .then(() => {
            showToast('Adicionado ao Carrinho');
        });
    });

    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        document.body.appendChild(toast);
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            document.body.removeChild(toast);
        }, 3000);
    }

    fetchProductDetails();
});
