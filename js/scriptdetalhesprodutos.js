document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.querySelector('.add-cart');

    addToCartButton.addEventListener('click', function () {
        const selectedSize = document.querySelector('input[name="size"]:checked').value;
        const selectedColor = document.querySelector('input[name="color"]:checked').value;

        const product = {
            id: '1',
            name: 'CHEETAH GLAM HOODIE',
            price: '79,99€',
            image: 'img/img-1.webp',
            size: selectedSize,
            color: selectedColor,
            uniqueId: `1-${selectedSize}-${selectedColor}` // Unique ID based on id, size, and color
        };

        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.push(product);
        localStorage.setItem('cart', JSON.stringify(cartItems));

        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = 'Adicionado ao Carrinho';
        document.body.appendChild(toast);
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            document.body.removeChild(toast);
        }, 3000);
    });
});