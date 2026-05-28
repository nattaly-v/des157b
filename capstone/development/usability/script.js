// ----------------- SCREEN NAVIGATION -----------------
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
        window.scrollTo(0, 0);
    }
    responsiveVoice.cancel();
}


// ----------------- TEXT TO SPEECH -----------------
function speak(screenId) {
    if (responsiveVoice.isPlaying()) {
        responsiveVoice.cancel();
        return;
    }
    const screen = document.getElementById(screenId);
    let text = '';
    screen.querySelectorAll('h1, h2, h3, p').forEach(el => {
        text += el.innerText.trim() + '. ';
    });
    responsiveVoice.speak(text, 'US English Female');
}


// ----------------- CAROUSEL -----------------
let currentSlide = 0;
const totalSlides = 3;

// moves left or right
function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    goToSlide(currentSlide);
}

// jumps to a specific slide and updates the dots
function goToSlide(index) {
    currentSlide = index;
    document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
    document.getElementById('slide-' + index).classList.add('active');
    document.querySelectorAll('.dot')[index].classList.add('active');
}