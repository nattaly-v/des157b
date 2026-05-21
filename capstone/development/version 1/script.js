// -------------------------- SCREEN NAVIGATION -------------------------- // 

// runs when a button is clicked, takes the screen id as input
function showScreen(screenId) {
    // grabs every element with the class "screen"
    const screens = document.querySelectorAll('.screen');
    // loops through all screens and removes "active" so they all hide
    screens.forEach(screen => screen.classList.remove('active'));

    // finds the specific screen we want to show by its id
    const target = document.getElementById(screenId);
    if (target) {
        // adds "active" to that screen so CSS makes it visible
        target.classList.add('active');
        // scrolls the page back to the top when switching screens
        window.scrollTo(0, 0);
    }
}

// -------------------------- CAROUSEL (My Rights) --------------------------

// tracks which slide we are currently on
let currentSlide = 0;
// total number of slides in the carousel
const totalSlides = 3;

// runs when the left or right arrow is clicked, direction is -1 or 1
function changeSlide(direction) {
    // moves forward or backward by adding the direction to current
    currentSlide += direction;
    // if we go past the first slide, wrap around to the last
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    // if we go past the last slide, wrap around to the first
    if (currentSlide >= totalSlides) currentSlide = 0;
    // calls goToSlide to actually update what's visible
    goToSlide(currentSlide);
}

function goToSlide(index) {
    // updates currentSlide to match the target index
    currentSlide = index;

    // hides all slides by removing "active" from each one
    document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
    // resets all dots to inactive
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

    // finds the slide we want by its id and shows it
    const activeSlide = document.getElementById('slide-' + index);
    if (activeSlide) activeSlide.classList.add('active');

    // finds the matching dot and highlights it
    const dots = document.querySelectorAll('.dot');
    if (dots[index]) dots[index].classList.add('active');
}