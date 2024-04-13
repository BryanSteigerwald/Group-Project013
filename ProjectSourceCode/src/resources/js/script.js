// {{!-- Get the cart modal and the cart button --}}
var modal = document.getElementById("cartModal");
var cartButton = document.getElementById("cartButton");

// {{!-- When the user clicks on the cart button, open the modal --}}
cartButton.onclick = function() {
  modal.style.display = "block";
}

// {{!-- When the user clicks on <span> (x), close the modal --}}
document.getElementsByClassName("close")[0].onclick = function() {
  modal.style.display = "none";
}

// {{!-- When the user clicks anywhere outside of the modal, close it --}}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}