document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');

    function renderCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
            return;
        }

        cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Preço: ${item.price}</p>
                </div>
                <div class="btn remove" data-id="${item.id}">Remover</div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.remove').forEach(button => {
            button.addEventListener('click', removeCartItem);
        });
    }

    function removeCartItem(event) {
        const itemId = event.target.getAttribute('data-id');
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        renderCartItems();

        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = 'Removido do Carrinho';
        document.body.appendChild(toast);
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            document.body.removeChild(toast);
        }, 3000);
    }

    renderCartItems();


});
