const products = [
    { title: "The Petite", description: "Fine White Vase + The Plastic Blossom", price: "₱300", imageSrc: "Assets/product/petite.jpg", featured: true },
    { title: "Eggshell", description: "White Leather Chair + Narrow Wood Legs", price: "₱1000", imageSrc: "Assets/product/whiteChair.jpg", featured: false },
    { title: "Morning Happiness", description: "White Alarm Clock + 3 Tuning Tone Options", price: "₱700", imageSrc: "Assets/product/alarmClock.png", featured: true },
    { title: "La Mug", description: "Ultimate Minimalist Mug", price: "₱400", imageSrc: "Assets/product/whiteMug.jpg", featured: false },
    { title: "Simply Mug", description: "Ultimate Minimalist Mug", price: "₱400", imageSrc: "Assets/product/whiteMug.jpg", featured: true },
    { title: "Urban Sofa", description: "Modern Sofa + Relaxed Cotton Upholstery", price: "₱2500", imageSrc: "Assets/product/cozyChairMat.jpg", featured: true }
];

document.addEventListener('scroll', () => {
    const scrollValue = window.scrollY;
    document.querySelector('.img1').style.transform = `translateY(${scrollValue * 0.1}px) rotate(0deg)`;  // Slight vertical movement
    document.querySelector('.img2').style.transform = `translateY(${scrollValue * 0.15}px) rotate(-1deg)`;
    document.querySelector('.img3').style.transform = `translateY(${scrollValue * 0.12}px) rotate(30deg)`;
    document.querySelector('.img4').style.transform = `translateY(${scrollValue * 0.18}px) rotate(-20deg)`;
    document.querySelector('.img5').style.transform = `translateY(${scrollValue * 0.18}px) rotate(0deg)`;
});

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.product-carousel')) {
        displayCarouselProducts();
        document.getElementById('left-btn').addEventListener('click', moveCarouselLeft);
        document.getElementById('right-btn').addEventListener('click', moveCarouselRight);
    } else if (document.getElementById('product-grid')) {
        displayAllProducts();
    }
});

let currentIndex = 0;
function displayCarouselProducts() {
    const carousel = document.querySelector('.product-carousel');
    carousel.innerHTML = '';  
    const featuredProducts = products.filter(product => product.featured);

    for (let i = 0; i < 3; i++) {
        const productIndex = (currentIndex + i) % featuredProducts.length;
        const product = featuredProducts[productIndex];

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.imageSrc}" alt="${product.title}" class="product-image">
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <p class="price">${product.price}</p>
        `;
        carousel.appendChild(card);

        setTimeout(() => {
            card.classList.add('show');
        }, 10);
    }
}


function moveCarouselLeft() {
    currentIndex = (currentIndex - 1 + products.length) % products.length;
    displayCarouselProducts();
}

function moveCarouselRight() {
    currentIndex = (currentIndex + 1) % products.length;
    displayCarouselProducts();
}

function displayAllProducts() {
    const gridContainer = document.getElementById('product-grid');
    gridContainer.innerHTML = '';  // Clear previous content

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-title', product.title.toLowerCase());  // Add data-title attribute
        card.innerHTML = `
            <img src="${product.imageSrc}" alt="${product.title}" class="product-image">
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <p class="price">${product.price}</p>
            <button class="add-to-cart">
                <img src="Assets/icon/shopping-cart.png" alt="Cart Icon" class="cart-icon">
                Add to Cart
            </button>
        `;
        gridContainer.appendChild(card);
        setTimeout(() => {
            card.classList.add('show');
        }, 10); // Small delay to allow for DOM rendering
    });
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.product-carousel')) {
        displayCarouselProducts();
        document.getElementById('left-btn').addEventListener('click', moveCarouselLeft);
        document.getElementById('right-btn').addEventListener('click', moveCarouselRight);
    } else if (document.getElementById('product-grid')) {
        displayAllProducts();
    }

    // Add event listener to each "Add to Cart" button
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const title = productCard.querySelector('h4').innerText;
            const price = productCard.querySelector('.price').innerText;
            const imageSrc = productCard.querySelector('.product-image').src;

            addToCart({ title, price, imageSrc });
        });
    });

    document.querySelector('.view-cart').addEventListener('click', showCartPopup);
    document.getElementById('close-cart').addEventListener('click', closeCartPopup);
    document.getElementById('buy-btn').addEventListener('click', simulateBuy);
    document.getElementById('overlay').addEventListener('click', closeCartPopup);
});
function addToCart(product) {
    const existingProduct = cart.find(item => item.title === product.title);
    if (existingProduct) {
        existingProduct.quantity++; 
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new product with quantity 1
    }

    // Save the updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartPopup(); // Update the cart popup with the new cart content
    updateTotalPrice(); // Recalculate the total price
    showCartNotification(); // Display the "Added to Cart!" popup
}


// Display "Added to Cart!" popup
function showCartNotification() {
    const notification = document.getElementById('cart-notification');
    notification.classList.add('show'); // Add the 'show' class to make the popup visible
  
    // Hide the popup after 2 seconds
    setTimeout(() => {
      notification.classList.remove('show'); // Remove the 'show' class to hide the popup
    }, 1500); // Hide after 2 seconds
}

function showCartPopup() {
    console.log("Showing Cart Popup...");

    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous content

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.imageSrc}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.price}</p>
                </div>
                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <input type="number" value="${item.quantity}" class="quantity" readonly>
                    <button class="increase">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);

            itemDiv.querySelector('.increase').addEventListener('click', () => changeQuantity(item, 1));
            itemDiv.querySelector('.decrease').addEventListener('click', () => changeQuantity(item, -1));
        });
    }

    updateTotalPrice();

    // Show the overlay and the cart popup
    document.getElementById('overlay').classList.add('show');
    document.getElementById('cart-popup').classList.add('show');
}

function closeCartPopup() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('cart-popup').classList.remove('show');
}
// Function to update the cart display
function updateCartPopup() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';  // Clear previous content

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.imageSrc}" alt="${item.title}">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.price}</p>
                </div>
                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <input type="number" value="${item.quantity}" class="quantity" readonly>
                    <button class="increase">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);

            itemDiv.querySelector('.increase').addEventListener('click', () => changeQuantity(item, 1));
            itemDiv.querySelector('.decrease').addEventListener('click', () => changeQuantity(item, -1));
        });
    }

    updateTotalPrice();  
}
function changeQuantity(item, change) {
    if (item.quantity + change <= 0) {
        // Remove the item if quantity is zero or less
        cart = cart.filter(cartItem => cartItem !== item);
    } else {
        // Update the quantity if it's greater than zero
        item.quantity += change;
    }

    // Save updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartPopup();  
    updateTotalPrice(); 
}

function simulateBuy() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Purchase successful! Thank you for buying from us.");
    cart = []; 
    updateCartPopup(); 
}

function updateTotalPrice() {
    let totalPrice = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace('₱', '').trim());
        totalPrice += price * item.quantity;
    });

    const totalElement = document.getElementById('total-price');
    totalElement.innerText = `Total: ₱${totalPrice.toFixed(2)}`;
}
