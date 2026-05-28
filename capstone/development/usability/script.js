// ===================== SCREEN NAVIGATION =====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
        window.scrollTo(0, 0);
    }
    if (window.responsiveVoice) {
        responsiveVoice.cancel();
    }
}

// ===================== TEXT TO SPEECH =====================
function speak(screenId) {
    if (!window.responsiveVoice) return;

    if (responsiveVoice.isPlaying()) {
        responsiveVoice.cancel();
        return;
    }
    const screen = document.getElementById(screenId);
    let text = '';

    // Collects all headers, paragraphs, and list items dynamically
    screen.querySelectorAll('h1, h2, h3, h4, p, li').forEach(el => {
        text += el.innerText.trim() + '. ';
    });
    responsiveVoice.speak(text, 'US English Female');
}

// ===================== CAROUSEL =====================
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

// ===================== HOVER TO AUDIO =====================
document.addEventListener('DOMContentLoaded', () => {

    // This setup sets up the dynamic listeners safely
    function initHoverVoice() {
        document.querySelectorAll('button[data-read]').forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (window.responsiveVoice && typeof responsiveVoice.speak === 'function') {
                    responsiveVoice.cancel();
                    const phrase = button.getAttribute('data-read');
                    responsiveVoice.speak(phrase, 'US English Female');
                }
            });

            button.addEventListener('mouseleave', () => {
                if (window.responsiveVoice) {
                    responsiveVoice.cancel();
                }
            });
        });
    }

    // Checks if ResponsiveVoice loaded synchronously, otherwise waits for SDK ready
    if (window.responsiveVoice && responsiveVoice.speak) {
        initHoverVoice();
    } else {
        window.addEventListener('ResponsiveVoiceReady', initHoverVoice);
    }
});