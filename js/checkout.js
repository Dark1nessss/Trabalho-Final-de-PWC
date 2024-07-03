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

    function renderOrderItems() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
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
                    <p>Cor: ${item.color}</p>
                    <p>Preço: ${item.price}</p>
                </div>
            `;

            orderItemsContainer.appendChild(orderItem);

            const price = parseFloat(item.price.replace('€', '').replace(',', '.'));
            subtotal += price;
        });

        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
        totalElement.textContent = `${(subtotal + 5).toFixed(2)}€`;
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

    toReviewButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (validatePaymentForm(paymentSection)) {
            step3.classList.add('active');
            showConfirmation();
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
            return Array.from(cardDetails.querySelectorAll('input[required]')).every(input => input.value.trim() !== '');
        } else if (document.getElementById('mb-way').checked) {
            return document.getElementById('mb-way-number').value.trim() !== '';
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
