document.addEventListener('DOMContentLoaded', function () {
    const toPaymentButton = document.getElementById('to-payment');
    const toReviewButton = document.getElementById('to-review');
    const infoSection = document.getElementById('info-section');
    const paymentSection = document.getElementById('payment-section');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    // Event listener for moving to payment details
    toPaymentButton.addEventListener('click', function () {
        if (validateInfoForm(infoSection)) {
            infoSection.classList.add('hidden');
            paymentSection.classList.remove('hidden');
            step1.classList.add('active');
            step2.classList.add('active');
        } else {
            showError('Please fill in all required fields correctly.');
        }
    });

    // Event listener for moving to review section
    toReviewButton.addEventListener('click', function (event) {
        event.preventDefault();
        if (validatePaymentForm(paymentSection)) {
            step3.classList.add('active');
            showConfirmation();
        } else {
            showError('Please fill in all required fields correctly.');
        }
    });

    // Validate info form details
    function validateInfoForm(form) {
        return Array.from(form.querySelectorAll('input[required]')).every(input => input.value.trim() !== '');
    }

    // Validate payment form details
    function validatePaymentForm(form) {
        return Array.from(form.querySelectorAll('input[required]')).every(input => input.value.trim() !== '');
    }

    // Show payment confirmation message
    function showConfirmation() {
        const confirmationMessage = document.createElement('div');
        confirmationMessage.textContent = 'Payment successful! Redirecting...';
        confirmationMessage.className = 'toast';
        document.body.appendChild(confirmationMessage);
        confirmationMessage.classList.add('show');
        setTimeout(() => {
            document.body.removeChild(confirmationMessage);
            // Redirect to a confirmation page or update UI
            window.location.href = 'order-confirmation.html';
        }, 3000);
    }

    // Show error message
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
});
