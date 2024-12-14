const products = [
    { title: "The Petite", description: "Fine White Vase + The Plastic Blossom", price: "₱300", imageSrc: "Assets/product/petite.jpg", featured: true },
    { title: "Eggshell", description: "White Leather Chair + Narrow Wood Legs", price: "₱1000", imageSrc: "Assets/product/whiteChair.jpg", featured: false },
    { title: "Morning Happiness", description: "White Alarm Clock + 3 Tuning Tone Options", price: "₱700", imageSrc: "Assets/product/alarmClock.png", featured: true },
    { title: "La Mug", description: "Ultimate Minimalist Mug", price: "₱400", imageSrc: "Assets/product/whiteMug.jpg", featured: false },
    { title: "See Through", description: "Plastic Plant + Glass Vase", price: "₱1000", imageSrc: "Assets/product/glassPlantWhiteBG.jpg", featured: false },
    { title: "Grey Smoothness", description: "Cotton Grey Chair", price: "₱3000", imageSrc: "Assets/product/greyChair.png", featured: false },
    { title: "Papara", description: "Paper Flower + Wood Vase", price: "₱200", imageSrc: "Assets/product/brownPlant.png", featured: true },
    { title: "Urban Sofa", description: "Modern Sofa + Relaxed Cotton Upholstery", price: "₱2500", imageSrc: "Assets/product/cozyChairMat.jpg", featured: true }
];


document.addEventListener('DOMContentLoaded', () => {
    displayAllProducts();
    document.getElementById('submit-review').addEventListener('click', function () {
        console.log("bomba");
        const name = document.getElementById('review-name').value.trim();
        const text = document.getElementById('review-text').value.trim();
        const rating = document.querySelectorAll('.star.selected').length;
    
        if (name && text && rating > 0) {
            // Create a new review card
            const reviewCard = document.createElement('div');
            reviewCard.classList.add('review-card');
    
            // Add content to the review card
            reviewCard.innerHTML = `
                <h3>${name}</h3>
                <p>"${text}"</p>
                <div class="stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
            `;
    
            // Append the review card to the reviews container
            document.getElementById('reviews-container').appendChild(reviewCard);
    
            // Clear input fields and reset rating
            document.getElementById('review-name').value = '';
            document.getElementById('review-text').value = '';
            document.querySelectorAll('.star').forEach(star => star.classList.remove('selected'));
        } else {
            alert('Please fill out all fields and select a rating!');
        }
    });

    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function () {
            // Deselect all stars
            document.querySelectorAll('.star').forEach(s => s.classList.remove('selected'));
            // Select the clicked star and all stars before it
            for (let i = 0; i < this.getAttribute('data-value'); i++) {
                document.querySelectorAll('.star')[i].classList.add('selected');
            }
        });
    });
    
    
});

function openModal(imageSrc) {
    const modal = document.getElementById('product-modal');
    const modalImage = document.getElementById('modal-image');
    modal.style.display = 'flex'; // Show the modal
    modalImage.src = imageSrc; // Set the image source to the clicked product's image
}

// Function to close the modal
document.getElementById('close-modal').addEventListener('click', function() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none'; // Hide the modal
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        modal.style.display = 'none'; // Hide modal if clicked outside
    }
});


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

        // Add click event to open the modal when the image is clicked
        const image = card.querySelector('.product-image');
        image.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent the card click event from triggering
            openModal(product.imageSrc);
        });
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


// Function to get a random response from the array
function getRandomResponse() {
    return responses[Math.floor(Math.random() * responses.length)];
}

const productPhrases = [
    "Check out our [product]! It’s only [price], an excellent addition to your collection.",
    "Don’t miss out on the [product]! Priced at just [price], it’s perfect for your space.",
    "Take a look at the [product]! It’s only [price] — a great deal for something so stylish.",
    "Introducing the [product] — yours for only [price]. It’s the ideal choice for any home.",
    "Discover the [product]! At just [price], it's the perfect item to complement your decor.",
    "How about the [product]? For only [price], it’s a must-have for any minimalist.",
    "Upgrade your home with the [product]! It’s available now for just [price].",
    "The [product] is here! And it's only [price] — what a steal!",
    "Take home the [product] today! Priced at just [price], it's a perfect fit for any space.",
    "Looking for something new? Check out the [product], available for just [price]."
];

// Function to get a random product pitch from the array
function getProductInfo() {
    const product = products[Math.floor(Math.random() * products.length)];

    // Pick a random pitch template and replace placeholders
    const randomPitch = productPhrases[Math.floor(Math.random() * productPhrases.length)];
    return randomPitch.replace("[product]", product.title).replace("[price]", product.price);
}

// Open chat box when clicking the chat button
document.getElementById('chat-button').addEventListener('click', function() {
    console.log("chat");
    document.getElementById('chat-box').classList.remove('hidden');

    // Simulate an automatic bot greeting when the chat box is opened
    setTimeout(() => {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.classList.add('bot-message');
        botMessageDiv.textContent = "Hello! Welcome to Minimalism Folks. How can I assist you today?";
        document.querySelector('.chat-messages').appendChild(botMessageDiv);
        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
    }, 500); // Delay the bot greeting by 0.5 seconds after opening the chat
});


// Close chat box
document.getElementById('close-chat').addEventListener('click', function() {
    document.getElementById('chat-box').classList.add('hidden');
});

// Function to handle sending the message
function sendMessage() {
    const message = document.getElementById('chat-input').value;

    if (message.trim()) {
        // Display the user's message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('user-message');
        userMessageDiv.textContent = message;
        document.querySelector('.chat-messages').appendChild(userMessageDiv);

        // Clear input and scroll to the bottom
        document.getElementById('chat-input').value = '';
        document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;

        // Simulate a bot response
        setTimeout(() => {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('bot-message');

            // Always respond with a product pitch
            botMessageDiv.textContent = getProductInfo();

            // Append product details to the chat window
            document.querySelector('.chat-messages').appendChild(botMessageDiv);
            document.querySelector('.chat-messages').scrollTop = document.querySelector('.chat-messages').scrollHeight;
        }, 1000); // Delay the bot response by 1 second
    }
}

// Handle message send when user presses "Enter"
document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();  // Call the function to send the message
    }
});

// Handle message send when user clicks the send button
document.getElementById('send-message').addEventListener('click', function() {
    sendMessage();  // Call the function to send the message
});

