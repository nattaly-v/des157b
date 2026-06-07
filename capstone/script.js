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
    if (!window.responsiveVoice || isMuted) return;
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


// ===================== HOVER / LONG PRESS TO AUDIO =====================
function initHoverVoice() {
    let longPressTimer = null;

    document.querySelectorAll('button[data-read]').forEach(button => {

        // DESKTOP — mouse hover
        button.addEventListener('mouseenter', () => {
            if (!window.responsiveVoice || isMuted) return;
            responsiveVoice.cancel();
            const phrase = button.getAttribute('data-read');
            const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
            responsiveVoice.speak(phrase, voice);
        });

        button.addEventListener('mouseleave', () => {
            if (window.responsiveVoice) responsiveVoice.cancel();
        });

        // MOBILE — long press (hold for 600ms)
        button.addEventListener('touchstart', () => {
            longPressTimer = setTimeout(() => {
                if (!window.responsiveVoice || isMuted) return;
                responsiveVoice.cancel();
                const phrase = button.getAttribute('data-read');
                const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
                responsiveVoice.speak(phrase, voice);
            }, 600);
        }, { passive: true });

        button.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
        }, { passive: true });

        button.addEventListener('touchmove', () => {
            clearTimeout(longPressTimer);
        }, { passive: true });
    });
}


// ===================== USABILITY OVERLAY =====================
function closeOverlay() {
    const overlay = document.getElementById('usability-overlay');
    if (overlay) overlay.classList.add('hidden');
}


// ===================== MUTE =====================
let isMuted = false;

function toggleMute() {
    isMuted = !isMuted;
    if (window.responsiveVoice) responsiveVoice.cancel();
    const icon = document.getElementById('mute-icon');
    if (icon) {
        icon.className = isMuted
            ? 'fa-solid fa-volume-xmark'
            : 'fa-solid fa-volume-high';
    }
}


// ===================== BOTTOM NAV =====================
function injectBottomNav() {
    const navHTML = `
        <nav class="bottom-nav">
            <button class="bnav-btn" onclick="showScreen('screen-home')">
                <i class="fa-solid fa-house"></i>
            </button>
            <button class="bnav-btn" onclick="showScreen('screen-learn')">
                <i class="fa-solid fa-book-open"></i>
            </button>
            <button class="bnav-btn bnav-center" onclick="showScreen('screen-emergency')">
                <i class="fa-solid fa-bell"></i>
            </button>
            <button class="bnav-btn" onclick="showScreen('screen-offices')">
                <i class="fa-solid fa-location-dot"></i>
            </button>
            <button class="bnav-btn" onclick="toggleMute()">
                <i class="fa-solid fa-volume-high" id="mute-icon"></i>
            </button>
        </nav>
    `;
    document.querySelectorAll('.screen').forEach(screen => {
        screen.insertAdjacentHTML('beforeend', navHTML);
    });
}

// ===================== INJECT LANG TOGGLE =====================
function injectLangToggle() {
    const toggleHTML = `
        <div class="lang-toggle-wrap">
            <button class="lang-btn active" data-lang="en" onclick="applyLanguage('en')">EN</button>
            <span class="lang-divider">|</span>
            <button class="lang-btn" data-lang="es" onclick="applyLanguage('es')">ES</button>
        </div>
    `;
    document.querySelectorAll('.screen .phone-header').forEach(header => {
        header.insertAdjacentHTML('beforeend', toggleHTML);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    injectBottomNav();
    injectLangToggle();
    loadTranslations();

    if (window.responsiveVoice && responsiveVoice.speak) {
        initHoverVoice();
    } else {
        window.addEventListener('ResponsiveVoiceReady', initHoverVoice);
    }
});