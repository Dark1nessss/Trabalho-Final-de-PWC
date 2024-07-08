document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');

    function renderCartItems() {
        fetch('/api/cart')
            .then(response => response.json())
            .then(cartItems => {
                if (cartItems.length === 0) {
                    cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
                    return;
                }

                cartItemsContainer.innerHTML = '';
                cartItems.forEach((item) => {
                    const cartItem = document.createElement('div');
                    cartItem.classList.add('cart-item');

                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h3>${item.name}</h3>
                            <p>Preço: €${item.price}</p>
                            <p>Tamanho: ${item.size}</p>
                            <div class="color-info">
                                <p>Cor: ${item.color}</p> 
                                <span class="color-box" style="background-color: ${getColorHex(item.color)};"></span>
                            </div>
                            <p>Quantidade: ${item.quantity}</p>
                        </div>
                        <div class="btn remove" data-id="${item.id}">Remover</div>
                    `;

                    cartItemsContainer.appendChild(cartItem);
                });

                document.querySelectorAll('.remove').forEach(button => {
                    button.addEventListener('click', removeCartItem);
                });
            });
    }

    function getColorHex(colorName) {
        const colors = {
            'Preto': 'black',
            'Vermelho': 'red',
            'Azul': 'blue'
        };
        return colors[colorName] || 'transparent';
    }

    function removeCartItem(event) {
        const itemId = event.target.getAttribute('data-id');

        fetch(`/api/cart/${itemId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            renderCartItems();
            showToast(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
        });
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

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    renderCartItems();
});
