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
}

// Function to remove class from cart
function removeFromCart(classId) {
  classCart = classCart.filter(item => item.classId !== classId);
}

// // Event listener for Add to Cart buttons
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      const classId = this.dataset.classId;
      const className = this.dataset.name;
      console.log(classId);
      console.log(className);
      addToCart(classId, className);
      this.innerText = 'Already Added';
      this.disabled = true;
      this.style.backgroundColor = '#444';
      this.style.color = '#fff';
      console.log(classCart);
    });
  });
});

// document.addEventListener('DOMContentLoaded', function() {
//   document.getElementById('cartButton').addEventListener('click', function() {
//     // Assuming you have a modal with id "cartModal"
//     const modal = document.getElementById('cart');
//     const modalContent = modal.querySelector('.modal-content');
    
//     // Clear previous content
//     modalContent.innerHTML = '';

//     // Iterate over cart array and display class names with remove buttons
//     classCart.forEach(item => {
//       const classItem = document.createElement('div');
//       classItem.classList.add('class-item');
      
//       const className = document.createElement('p');
//       className.textContent = item.className;
      
//       const removeButton = document.createElement('button');
//       removeButton.textContent = 'Remove';
//       removeButton.dataset.classid = item.classId;
//       removeButton.classList.add('removeButton');
//       removeButton.addEventListener('click', function() {
//         const classId = this.dataset.classid;
//         removeFromCart(classId);
//         // Update modal display
//         // For simplicity, you may just close the modal and reopen it to reflect changes
//         modal.style.display = 'none';
//         document.getElementById('cartButton').click(); // Reopen modal
//       });

//       classItem.appendChild(className);
//       classItem.appendChild(removeButton);
//       modalContent.appendChild(classItem);
//     });

//     // Show the modal
//     // modal.style.display = 'block';
//   });
// });

document.addEventListener('DOMContentLoaded', function() {
  // Select the cart button
  const cartButton = document.getElementById('cartButton');

  // Add an event listener to the cart button
  cartButton.addEventListener('click', function() {
    // Get the modal element
    const modal = document.getElementById('cart');

    // Display the modal
    // This line isn't necessary if you're using Bootstrap, as Bootstrap handles modal display
    // modal.style.display = 'block';
  });
});