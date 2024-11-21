document.addEventListener("DOMContentLoaded", function () {
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const carousel = document.querySelector(".product-carousel");

  let scrollAmount = 0;

  // Event listener for left button
  leftBtn.addEventListener("click", function () {
      if (scrollAmount > 0) {
          scrollAmount -= 1;  // Move left by one card
          carousel.style.transform = `translateX(-${scrollAmount * (carousel.offsetWidth / 3)}px)`; // Adjust the translation based on the width
      }
  });

  // Event listener for right button
  rightBtn.addEventListener("click", function () {
      if (scrollAmount < (carousel.children.length - 3)) {  // Ensures that only 3 items are shown at a time
          scrollAmount += 1;  // Move right by one card
          carousel.style.transform = `translateX(-${scrollAmount * (carousel.offsetWidth / 3)}px)`; // Adjust the translation based on the width
      }
  });
});
