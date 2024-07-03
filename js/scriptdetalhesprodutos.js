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
            id: '1',
            name: 'CHEETAH GLAM HOODIE',
            price: '79,99€',
            image: 'img/img-1.webp',
            size: selectedSize.value,
            color: selectedColor.value,
            uniqueId: `1-${selectedSize.value}-${selectedColor.value}-${Date.now()}`
        };

        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.push(product);
        localStorage.setItem('cart', JSON.stringify(cartItems));

        showToast('Adicionado ao Carrinho');
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
