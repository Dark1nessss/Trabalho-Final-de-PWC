document.addEventListener('DOMContentLoaded', function () {
    const toPaymentButton = document.getElementById('to-payment');
    const toReviewButton = document.getElementById('to-review');
    const infoSection = document.getElementById('info-section');
    const paymentSection = document.getElementById('payment-section');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const cardDetails = document.getElementById('card-details');
    const mbWayDetails = document.getElementById('mb-way-details');

    // Initialize Stripe.js
    const stripe = Stripe('pk_test_51PYQ2LHcjAUCTTasOmnmgbKmCZ0HVY3iClEmoQtiyYXuCD3uXrjDcHHXZLn2zYJLiBmNkJR34Mp1uQt3PiKD4ZAJ00p9eN20Aj'); // Use your publishable key here
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');

    function renderOrderItems() {
        fetch('/api/cart')
            .then(response => response.json())
            .then(cartItems => {
                let subtotal = 0;

                orderItemsContainer.innerHTML = '';

                cartItems.forEach(item => {
                    const orderItem = document.createElement('div');
                    orderItem.classList.add('order-item');

                    orderItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <p>${item.name}</p>
                            <p>Tamanho: ${item.size}</p>
                            <div class="color-info">
                                <p>Cor: ${item.color}</p> 
                                <span class="color-box" style="background-color: ${getColorHex(item.color)};"></span>
                            </div>
                            <p>Preço: €${item.price}</p>
                            <p>Quantidade: ${item.quantity}</p>
                        </div>
                    `;

                    orderItemsContainer.appendChild(orderItem);

                    const price = parseFloat(item.price);
                    subtotal += price * item.quantity;
                });

                subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
                totalElement.textContent = `${(subtotal + 5).toFixed(2)}€`;
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

    toPaymentButton.addEventListener('click', function () {
        if (validateInfoForm(infoSection)) {
            infoSection.classList.add('hidden');
            paymentSection.classList.remove('hidden');
            step1.classList.add('active');
            step2.classList.add('active');
        } else {
            showError('Por favor, preencha todos os campos obrigatórios corretamente.');
        }
    });

    toReviewButton.addEventListener('click', async function (event) {
        event.preventDefault();
        if (validatePaymentForm(paymentSection)) {
            if (document.getElementById('card').checked) {
                // Create payment intent and confirm card payment
                const { clientSecret } = await fetch('/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: JSON.parse(localStorage.getItem('cart'))
                    }),
                }).then((r) => r.json());

                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: document.getElementById('email').value,
                        },
                    },
                });

                if (error) {
                    showError(error.message);
                } else if (paymentIntent.status === 'succeeded') {
                    showConfirmation();
                }
            } else if (document.getElementById('mb-way').checked) {
                // Mock MB Way payment confirmation
                showConfirmation();
            }
        } else {
            showError('Por favor, preencha todos os campos obrigatórios corretamente.');
        }
    });

    document.getElementById('card').addEventListener('change', togglePaymentDetails);
    document.getElementById('mb-way').addEventListener('change', togglePaymentDetails);

    function togglePaymentDetails() {
        if (document.getElementById('card').checked) {
            cardDetails.style.display = 'flex';
            mbWayDetails.style.display = 'none';
        } else if (document.getElementById('mb-way').checked) {
            cardDetails.style.display = 'none';
            mbWayDetails.style.display = 'flex';
        }
    }

    function validateInfoForm(form) {
        return Array.from(form.querySelectorAll('input[required]')).every(input => input.value.trim() !== '');
    }

    function validatePaymentForm(form) {
        if (document.getElementById('card').checked) {
            return true;
        } else if (document.getElementById('mb-way').checked) {
            const mbWayNumber = document.getElementById('mb-way-number').value.trim();
            const mbWayPattern = /^\+351 9\d{2} \d{3} \d{3}$/;
            return mbWayPattern.test(mbWayNumber);
        }
        return false;
    }

    function showConfirmation() {
        const confirmationMessage = document.createElement('div');
        confirmationMessage.textContent = 'Pagamento bem-sucedido! Redirecionando...';
        confirmationMessage.className = 'toast';
        document.body.appendChild(confirmationMessage);
        confirmationMessage.classList.add('show');
        setTimeout(() => {
            document.body.removeChild(confirmationMessage);
            window.location.href = 'order-confirmation.html';
        }, 3000);
    }

    function showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = message;
        errorMessage.className = 'toast toast-error';
        document.body.appendChild(errorMessage);
        errorMessage.classList.add('show');
        setTimeout(() => {
            document.body.removeChild(errorMessage);
        }, 3000);
    }

    renderOrderItems();
    togglePaymentDetails();
});
