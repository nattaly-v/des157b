// ===================== SCREEN NAVIGATION =====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
        window.scrollTo(0, 0);
    }
    if (window.responsiveVoice) responsiveVoice.cancel();
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
    screen.querySelectorAll('h1, h2, h3, h4, p, li').forEach(el => {
        text += el.innerText.trim() + '. ';
    });
    const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
    responsiveVoice.speak(text, voice);
}


// ===================== CAROUSEL =====================
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
    document.getElementById('slide-' + index).classList.add('active');
    document.querySelectorAll('.dot')[index].classList.add('active');
}


// ===================== LANGUAGE SYSTEM =====================
let translations = {};
let currentLang = 'en';

// loads both json files
async function loadTranslations() {
    try {
        const [en, es] = await Promise.all([
            fetch('en.json').then(r => r.json()),
            fetch('es.json').then(r => r.json())
        ]);
        translations = { en, es };
        applyLanguage('en'); // always start in English
    } catch (err) {
        console.error('Failed to load translations:', err);
    }
}

// swaps all text and voice to the selected language
function applyLanguage(lang) {
    currentLang = lang;

    if (window.responsiveVoice) responsiveVoice.cancel();

    // swap text content for every element with a data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.innerHTML = translations[lang][key];
        }
    });

    // swap placeholder text for inputs
    document.querySelectorAll('[data-key-placeholder]').forEach(el => {
        const key = el.getAttribute('data-key-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // update data-read so hover voice speaks the correct language
    document.querySelectorAll('button[data-key]').forEach(btn => {
        const key = btn.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            btn.setAttribute('data-read', translations[lang][key]);
        }
    });

    // highlight the active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}


// ===================== HOVER TO AUDIO =====================
// reads a button's label aloud when you hover over it
function initHoverVoice() {
    document.querySelectorAll('button[data-read]').forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (!window.responsiveVoice) return;
            responsiveVoice.cancel();
            const phrase = button.getAttribute('data-read');
            const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
            responsiveVoice.speak(phrase, voice);
        });
        button.addEventListener('mouseleave', () => {
            if (window.responsiveVoice) responsiveVoice.cancel();
        });
    });
}


// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations();

    if (window.responsiveVoice && responsiveVoice.speak) {
        initHoverVoice();
    } else {
        window.addEventListener('ResponsiveVoiceReady', initHoverVoice);
    }
});