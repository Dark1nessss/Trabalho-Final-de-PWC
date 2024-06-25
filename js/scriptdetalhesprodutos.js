// const sliderMainImage = document.getElementById("product-main-image");
// const sliderImageList = document.getElementsByClassName("image-list");
// console.log(sliderImageList);

// sliderImageList[0].onclick = function(){
//     sliderMainImage.src = sliderImageList[0].src;
//     console.log(sliderMainImage.src);
// };

// sliderImageList[1].onclick = function(){
//     sliderMainImage.src = sliderImageList[1].src;
//     console.log(sliderMainImage.src);
// };

// sliderImageList[2].onclick = function(){
//     sliderMainImage.src = sliderImageList[2].src;
//     console.log(sliderMainImage.src);
// };

// sliderImageList[3].onclick = function(){
//     sliderMainImage.src = sliderImageList[3].src;
//     console.log(sliderMainImage.src);
// };


document.addEventListener('DOMContentLoaded', function () {
    const addToCartButton = document.querySelector('.add-cart');

    addToCartButton.addEventListener('click', function () {
        const product = {
            id: '1',
            name: 'CHEETAH GLAM HOODIE',
            price: '79,99€',
            image: 'img/img-1.webp',
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
