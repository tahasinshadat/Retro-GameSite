const infoDiv = document.getElementById('infoBox');
const btn = document.getElementById('button');

btn.addEventListener('click', function() {
    infoDiv.classList.add('zoom-fade-out');
  setTimeout(function() {
    window.location.href = "game.html"; // Replace with your desired URL
  }, 1000); // Adjust the duration of the animation (in milliseconds) to match the CSS transition duration
});

window.addEventListener("DOMContentLoaded", function () {
    const infoBox = document.getElementById("infoBox");
    infoBox.addEventListener("animationend", function () {
      infoBox.classList.remove("zoom-in");
    });
});