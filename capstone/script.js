// ===================== SCREEN NAV SECTION MAP =====================
// Maps each screen ID to which bottom nav section it belongs to
const screenSectionMap = {
    'screen-home': 'home',
    'screen-learn': 'learn',
    'screen-visa': 'learn',
    'screen-work-visa': 'learn',
    'screen-student-visa': 'learn',
    'screen-tourist-visa': 'learn',
    'screen-green': 'learn',
    'screen-h1b-details': 'learn',
    'screen-h2a-details': 'learn',
    'screen-l1-details': 'learn',
    'screen-f1-details': 'learn',
    'screen-j1-details': 'learn',
    'screen-m1-details': 'learn',
    'screen-b2-details': 'learn',
    'screen-b1-details': 'learn',
    'screen-esta-details': 'learn',
    'screen-family-green-details': 'learn',
    'screen-work-green-details': 'learn',
    'screen-refugee-details': 'learn',
    'screen-lottery-details': 'learn',
    'screen-emergency': 'emergency',
    'screen-offices': 'offices',
};

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

    // Reset all playing card/page audio buttons
    document.querySelectorAll('.card-audio-btn.playing, .page-audio-btn.playing').forEach(b => {
        b.classList.remove('playing');
        updateAudioIcon(b, false);
    });

    updateNavHighlight(screenId);
}

// ===================== NAV HIGHLIGHT =====================
function updateNavHighlight(screenId) {
    const section = screenSectionMap[screenId] || null;
    document.querySelectorAll('.bnav-btn[data-section]').forEach(btn => {
        const isActive = btn.dataset.section === section;
        btn.classList.toggle('bnav-active', isActive);
    });
}


// ===================== AUDIO ICON HELPER =====================
function updateAudioIcon(btn, isPlaying) {
    const icon = btn.querySelector('i');
    if (!icon) return;
    icon.className = isPlaying ? 'fa-solid fa-circle-stop' : 'fa-solid fa-volume-high';
}


// ===================== SPEAK A CARD =====================
function speakCard(btn) {
    if (!window.responsiveVoice || isMuted) return;

    if (responsiveVoice.isPlaying()) {
        responsiveVoice.cancel();
        if (btn.classList.contains('playing')) {
            btn.classList.remove('playing');
            updateAudioIcon(btn, false);
            return;
        }
    }

    document.querySelectorAll('.card-audio-btn.playing, .page-audio-btn.playing').forEach(b => {
        b.classList.remove('playing');
        updateAudioIcon(b, false);
    });

    const card = btn.closest('.visa-card') || btn.closest('.emergency-card');
    if (!card) return;

    let text = '';
    card.querySelectorAll('h3, p').forEach(el => {
        const t = el.innerText.trim();
        if (t) text += t + '. ';
    });
    if (!text) return;

    btn.classList.add('playing');
    updateAudioIcon(btn, true);

    const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
    responsiveVoice.speak(text, voice, {
        onend: () => { btn.classList.remove('playing'); updateAudioIcon(btn, false); },
        onerror: () => { btn.classList.remove('playing'); updateAudioIcon(btn, false); }
    });
}


// ===================== SPEAK AN INFO PAGE =====================
function speakInfoPage(btn) {
    if (!window.responsiveVoice || isMuted) return;

    if (responsiveVoice.isPlaying()) {
        responsiveVoice.cancel();
        if (btn.classList.contains('playing')) {
            btn.classList.remove('playing');
            updateAudioIcon(btn, false);
            return;
        }
    }

    document.querySelectorAll('.card-audio-btn.playing, .page-audio-btn.playing').forEach(b => {
        b.classList.remove('playing');
        updateAudioIcon(b, false);
    });

    // Read the entire info page: title + all boxes
    const screen = btn.closest('.screen');
    if (!screen) return;

    let text = '';
    screen.querySelectorAll('h2, h4, p, li').forEach(el => {
        // Skip the button's own label text
        if (el.closest('.page-audio-btn')) return;
        const t = el.innerText.trim();
        if (t) text += t + '. ';
    });
    if (!text) return;

    btn.classList.add('playing');
    updateAudioIcon(btn, true);

    const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
    responsiveVoice.speak(text, voice, {
        onend: () => { btn.classList.remove('playing'); updateAudioIcon(btn, false); },
        onerror: () => { btn.classList.remove('playing'); updateAudioIcon(btn, false); }
    });
}


// ===================== LANGUAGE SYSTEM =====================
let translations = {};
let currentLang = 'en';

async function loadTranslations() {
    try {
        const [en, es] = await Promise.all([
            fetch('en.json').then(r => r.json()),
            fetch('es.json').then(r => r.json())
        ]);
        translations = { en, es };
        applyLanguage('en');
    } catch (err) {
        console.error('Failed to load translations:', err);
    }
}

function applyLanguage(lang) {
    currentLang = lang;

    if (window.responsiveVoice) responsiveVoice.cancel();
    document.querySelectorAll('.card-audio-btn.playing, .page-audio-btn.playing').forEach(b => {
        b.classList.remove('playing');
        updateAudioIcon(b, false);
    });

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-key-placeholder]').forEach(el => {
        const key = el.getAttribute('data-key-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    document.querySelectorAll('button[data-key]').forEach(btn => {
        const key = btn.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            btn.setAttribute('data-read', translations[lang][key]);
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}


// ===================== HOVER / LONG PRESS (nav buttons) =====================
function initHoverVoice() {
    let longPressTimer = null;

    document.querySelectorAll('button[data-read]').forEach(button => {
        if (button.classList.contains('card-audio-btn') || button.classList.contains('page-audio-btn')) return;

        button.addEventListener('touchstart', (e) => {
            // Do NOT call e.preventDefault() here — it suppresses the
            // synthetic click on iOS Safari, breaking all button navigation.
            let didLongPress = false;
            longPressTimer = setTimeout(() => {
                didLongPress = true;
                if (!window.responsiveVoice || isMuted) return;
                responsiveVoice.cancel();
                const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
                responsiveVoice.speak(button.getAttribute('data-read'), voice);
            }, 600);
            button._didLongPress = () => didLongPress;
        }, { passive: true });
        button.addEventListener('touchend', () => clearTimeout(longPressTimer), { passive: true });
        button.addEventListener('touchmove', () => clearTimeout(longPressTimer), { passive: true });
    });

    // Card audio buttons — tap to speak
    document.querySelectorAll('.card-audio-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); speakCard(btn); });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); speakCard(btn); }, { passive: false });
    });

    // Info page audio buttons — tap to speak
    document.querySelectorAll('.page-audio-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.stopPropagation(); speakInfoPage(btn); });
        btn.addEventListener('touchend', (e) => { e.preventDefault(); e.stopPropagation(); speakInfoPage(btn); }, { passive: false });
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

    document.querySelectorAll('.card-audio-btn.playing, .page-audio-btn.playing').forEach(b => {
        b.classList.remove('playing');
        updateAudioIcon(b, false);
    });

    const muteBtn = document.getElementById('mute-btn');
    const icon = document.getElementById('mute-icon');
    const label = document.getElementById('mute-label');

    if (icon) icon.className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    if (label) label.textContent = isMuted ? 'Audio Off' : 'Audio On';
    if (muteBtn) muteBtn.classList.toggle('muted', isMuted);
}


// ===================== INJECT INFO PAGE AUDIO BUTTONS =====================
function injectInfoPageAudioButtons() {
    document.querySelectorAll('.screen.info-page').forEach(page => {
        const hero = page.querySelector('.info-hero');
        if (!hero) return;
        const btn = document.createElement('button');
        btn.className = 'page-audio-btn';
        btn.setAttribute('aria-label', 'Listen to this page');
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i><span class="page-audio-label">Listen</span>';
        hero.appendChild(btn);
    });
}


// ===================== BOTTOM NAV =====================
function injectBottomNav() {
    const navHTML = `
        <nav class="bottom-nav">
            <button class="bnav-btn" data-section="home" onclick="showScreen('screen-home')" aria-label="Home">
                <i class="fa-solid fa-house"></i>
            </button>
            <button class="bnav-btn" data-section="learn" onclick="showScreen('screen-learn')" aria-label="Learn">
                <i class="fa-solid fa-book-open"></i>
            </button>
            <button class="bnav-btn bnav-center" data-section="emergency" onclick="showScreen('screen-emergency')" aria-label="Emergency">
                <i class="fa-solid fa-bell"></i>
            </button>
            <button class="bnav-btn" data-section="offices" onclick="showScreen('screen-offices')" aria-label="Offices">
                <i class="fa-solid fa-location-dot"></i>
            </button>
            <button class="bnav-btn bnav-audio-toggle" id="mute-btn" onclick="toggleMute()" aria-label="Toggle audio">
                <i class="fa-solid fa-volume-high" id="mute-icon"></i>
                <span class="mute-label" id="mute-label">Audio On</span>
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


// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    injectInfoPageAudioButtons();
    injectBottomNav();
    injectLangToggle();
    loadTranslations();

    // Set initial nav highlight for home screen
    updateNavHighlight('screen-home');

    if (window.responsiveVoice && responsiveVoice.speak) {
        initHoverVoice();
    } else {
        window.addEventListener('ResponsiveVoiceReady', initHoverVoice);
    }
});