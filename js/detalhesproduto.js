document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const addToCartButton = document.querySelector('.add-cart');

    function fetchProductDetails() {
        fetch(`/api/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                document.querySelector('.img-produto-principal img').src = product.image;
                document.querySelector('.titulo h2').textContent = product.name;
                document.querySelector('.offer-price').textContent = `€${product.price}`;
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
