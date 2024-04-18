let classCart = [];

// Function to add class to cart
function addToCart(classId, className) {
  // Check if class is already in cart
  const existingClass = classCart.find(item => item.classId === classId);
  if (existingClass) {
    return; // Class already in cart
  }

  // Add class to cart
  classCart.push({ classId, className });
  updateCartStorage(); // Update local storage
}

// Function to remove class from cart
function removeFromCart(classId) {
  classCart = classCart.filter(item => item.classId !== classId);
  updateCartStorage(); // Update local storage
}

// Function to update cart storage
function updateCartStorage() {
  localStorage.setItem('classCart', JSON.stringify(classCart));
}

// Function to load cart from local storage
function loadCartFromStorage() {
  const storedCart = localStorage.getItem('classCart');
  if (storedCart) {
    classCart = JSON.parse(storedCart);
  }
}

// Load cart from local storage when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
  loadCartFromStorage();
  populateCartModal(); // Populate cart modal with stored cart items
  updateAddToCartButtons(); // Update "Add to cart" buttons based on stored cart items
});

// Event listener for Add to Cart buttons
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const classId = this.dataset.classId;
      const className = this.dataset.name;
      console.log(classId);
      console.log(className);
      addToCart(classId, className);
      this.innerText = 'Added';
      this.disabled = true;
      this.style.backgroundColor = '#444';
      this.style.color = '#fff';
      console.log(classCart);
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const cartButton = document.getElementById('cartButton');

  // Add an event listener to the cart button
  cartButton.addEventListener('click', function() {
    // Get the modal element
    populateCartModal();
  });
});

function populateCartModal() {
  const cartItemsContainer = document.getElementById('cartItems');
  cartItemsContainer.innerHTML = '';

  // Loop through each item in classCart and generate HTML
  classCart.forEach((classItem, index) => {
      const { classId, className } = classItem;
      const itemHTML = `
          <div class="class-item">
              <span>${classId} - ${className}</span>
              <button type="button" class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button>
          </div>
      `;
      cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });

  // Add event listeners to remove buttons
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
      button.addEventListener('click', function() {
          const index = parseInt(button.getAttribute('data-index'));

          // Enable corresponding "Add to cart" button
          const classId = classCart[index].classId;
          const addButton = document.querySelector(`.add-to-cart[data-class-id="${classId}"]`);
          if (addButton) {
              addButton.innerText = 'Add to cart';
              addButton.disabled = false;
              addButton.style.backgroundColor = ''; // Reset background color
              addButton.style.color = ''; // Reset text color
          }

          classCart.splice(index, 1); // Remove item from classCart array
          updateCartStorage(); // Update local storage
          populateCartModal(); // Re-populate modal with updated classCart
      });
  });
}

// Function to enroll classes in the cart
function enrollClasses() {
  // Make AJAX request to enroll all classes in classCart
  $.ajax({
    type: 'POST',
    url: '/classes/add',
    contentType: 'application/json',
    data: JSON.stringify({ classCart: classCart }),
    success: function(response) {
        console.log(response.message); // Log success message
        $('#cart').modal('hide'); // Hide modal after successful enrollment
        classCart = [];
        localStorage.removeItem('classCart'); // Clear cart from local storage
    },
    error: function(xhr, status, error) {
        console.error('Error enrolling classes:', error); // Log error message
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const cartButton = document.getElementById('enrollButton');

  // Add an event listener to the cart button
  cartButton.addEventListener('click', function() {
    enrollClasses();
    console.log("enrolled classes from cart");
  });
});

// Function to update add-to-cart buttons based on user_classes
function updateAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
      const classId = button.dataset.classId;
      
      // Make AJAX request to check if the class is already added
      $.ajax({
          type: 'GET',
          url: '/classes/check',
          data: { classId: classId },
          success: function(response) {
              if (response.exists) {
                  button.innerText = 'Already Added';
                  button.disabled = true;
                  button.style.backgroundColor = '#444';
                  button.style.color = '#fff';
              }
          },
          error: function(xhr, status, error) {
              console.error('Error checking class:', error); // Log error message
          }
      });
  });
}
