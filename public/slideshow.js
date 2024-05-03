document.addEventListener("DOMContentLoaded", function () {
    // Get all images
    var images = document.querySelectorAll('.food-image');
    var currentIndex = 0;

    function showImage(index) {
        // Hide all images
        images.forEach(function (image) {
            image.style.display = 'none';
        });
        // Show the current image
        images[index].style.display = 'block';
    }

    function nextImage() {
        currentIndex++;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        showImage(currentIndex);
    }

    // Show the first image initially
    showImage(currentIndex);

    // Change image every 3 seconds
    setInterval(nextImage, 3000);
});
