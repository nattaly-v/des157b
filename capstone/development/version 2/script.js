// SCREEN NAVIGATION
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }

    // Stop speaking when changing screens
    speechSynthesis.cancel();
}

// TEXT TO SPEECH
function speak(screenId) {
    // If already speaking, stop
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        return;
    }

    const screen = document.getElementById(screenId);
    const elements = screen.querySelectorAll('h1, h2, h3, p');
    let text = '';
    elements.forEach(el => {
        text += el.innerText.trim() + '. ';
    });

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices[0];

    speechSynthesis.speak(utterance);
}

// CAROUSEL
let currentSlide = 0;
const totalSlides = 3;

function changeSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    goToSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;

    document.querySelectorAll('.carousel-slide').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

    const activeSlide = document.getElementById('slide-' + index);
    if (activeSlide) activeSlide.classList.add('active');

    const dots = document.querySelectorAll('.dot');
    if (dots[index]) dots[index].classList.add('active');
}