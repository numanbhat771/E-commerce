document.addEventListener("DOMContentLoaded", function() {
    // Function to load cart items from localStorage
    function loadCartItems() {
        return JSON.parse(localStorage.getItem("cartItems")) || [];
    }

    // Function to save cart items to localStorage
    function saveCartItems(items) {
        localStorage.setItem("cartItems", JSON.stringify(items));
    }

    // Function to clear the cart and refresh the page
    function clearCart() {
        localStorage.removeItem("cartItems");
        console.log("Cart cleared"); // Debugging line
        updateCart(); // Ensure UI reflects the cleared cart
    }

    // Function to update the cart display
    function updateCart() {
        const cartItems = loadCartItems();
        const cartItemsContainer = document.getElementById("cart-items");
        const totalAmountElement = document.getElementById("total-amount");
        const shippingMessage = document.getElementById("shipping-message");

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalAmountElement.innerText = "$0.00";
            shippingMessage.innerText = "Shipping: $0.00";
            return;
        }

        let totalAmount = 0;
        cartItemsContainer.innerHTML = ''; // Clear existing items

        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <h3>${item.name}</h3>
                <p>$${item.price} x <span class="item-quantity">${item.quantity}</span> = $<span class="item-total">${itemTotal.toFixed(2)}</span></p>
                <div class="quantity-control">
                    <button class="decrease" data-index="${index}">-</button>
                    <input type="number" value="${item.quantity}" min="1">
                    <button class="increase" data-index="${index}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        updateTotal();
    }

    // Function to update the total amount and shipping costs
    function updateTotal() {
        const cartItems = loadCartItems();
        let totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = totalAmount > 40 ? 0 : 10;
        totalAmount += shipping;

        document.getElementById("total-amount").innerText = "$" + totalAmount.toFixed(2);
        const shippingMessage = document.getElementById("shipping-message");

        if (totalAmount > 40) {
            shippingMessage.innerText = "Shipping: Free";
        } else {
            shippingMessage.innerText = "Shipping: $10.00";
        }
    }

    // Home page functionality
    if (window.location.pathname.includes("index.html")) {
        document.querySelectorAll(".quantity-control button").forEach(button => {
            button.addEventListener("click", function() {
                const input = this.parentElement.querySelector("input");
                let value = parseInt(input.value);

                if (this.classList.contains("increase")) {
                    value++;
                } else if (this.classList.contains("decrease") && value > 1) {
                    value--;
                }

                input.value = value;
            });
        });

        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", function() {
                const product = this.closest(".product");
                const productName = product.querySelector("h3").innerText;
                const productPrice = parseFloat(product.querySelector("p").innerText.substring(1));
                const productImage = product.querySelector("img").src;
                const quantity = parseInt(product.querySelector(".quantity-control input").value);

                let cartItems = loadCartItems();
                const existingProduct = cartItems.find(item => item.name === productName);

                if (existingProduct) {
                    existingProduct.quantity += quantity;
                } else {
                    cartItems.push({ name: productName, price: productPrice, image: productImage, quantity });
                }

                saveCartItems(cartItems);
                alert(productName + " added to cart");
            });
        });
    }

    // Cart page functionality
    if (window.location.pathname.includes("cart.html")) {
        updateCart();

        // Handle quantity buttons on the cart page
        document.querySelectorAll(".quantity-control button").forEach(button => {
            button.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                let cartItems = loadCartItems();
                let quantity = cartItems[index].quantity;

                if (this.classList.contains("increase")) {
                    quantity++;
                } else if (this.classList.contains("decrease") && quantity > 1) {
                    quantity--;
                }

                cartItems[index].quantity = quantity;
                saveCartItems(cartItems);
                updateCartItemDisplay(index, quantity);
                updateTotal();
            });
        });

        // Checkout functionality
        document.getElementById("checkout").addEventListener("click", function() {
            alert("Thank you for your purchase!");
            clearCart();  // This should clear the cart and reload the page
            window.location.href = "index.html";  // Redirect to home page after checkout
        });
    }

    function updateCartItemDisplay(index, quantity) {
        const cartItems = loadCartItems();
        const cartItem = document.querySelectorAll(".cart-item")[index];
        const itemTotal = cartItems[index].price * quantity;
        cartItem.querySelector(".item-quantity").innerText = quantity;
        cartItem.querySelector(".item-total").innerText = itemTotal.toFixed(2);
    }
});
