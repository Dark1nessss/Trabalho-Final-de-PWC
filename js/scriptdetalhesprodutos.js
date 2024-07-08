document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.querySelector('.add-cart');

    addToCartButton.addEventListener('click', function () {
        const selectedSize = document.querySelector('input[name="size"]:checked');
        const selectedColor = document.querySelector('input[name="color"]:checked');

        if (!selectedSize || !selectedColor) {
            showToast('Por favor, selecione tamanho e cor');
            return;
        }

        const product = {
            product_id: 1, // Assuming the product ID is 1, you might want to dynamically set this value
            size: selectedSize.value,
            color: selectedColor.value,
            quantity: 1
        };

        fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            showToast(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
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
});
