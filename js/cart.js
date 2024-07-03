document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');

    function renderCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            return;
        }

        cartItemsContainer.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Preço: ${item.price}</p>
                    <p>Tamanho: ${item.size}</p>
                    <p>Cor: ${item.color}</p>
                </div>
                <div class="btn remove" data-index="${index}">Remover</div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.remove').forEach(button => {
            button.addEventListener('click', removeCartItem);
        });
    }

    function removeCartItem(event) {
        const itemIndex = event.target.getAttribute('data-index');
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        cartItems.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCartItems();

        showToast('Removido do Carrinho');
    }

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

    // Add checkout button
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    renderCartItems();
});
