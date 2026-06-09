(function () {
    'use strict';
    console.log('reading js');

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
        stopActiveAudio();
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


    // ===================== PRONUNCIATION CLEANUP =====================
    function cleanForSpeech(text) {
        if (currentLang === 'es') {
            return text
                .replace(/\bH-1B\b/g, 'H uno B')
                .replace(/\bH-2A\b/g, 'H dos A')
                .replace(/\bL-1\b/g, 'L uno')
                .replace(/\bF-1\b/g, 'F uno')
                .replace(/\bJ-1\b/g, 'J uno')
                .replace(/\bM-1\b/g, 'M uno')
                .replace(/\bB-1\b/g, 'B uno')
                .replace(/\bB-2\b/g, 'B dos')
                .replace(/\bEB-1\b/g, 'E B uno')
                .replace(/\bEB-2\b/g, 'E B dos')
                .replace(/\bEB-3\b/g, 'E B tres')
                .replace(/\bEB-4\b/g, 'E B cuatro')
                .replace(/\bEB-5\b/g, 'E B cinco');
        }
        return text
            .replace(/\bH-1B\b/g, 'H one B')
            .replace(/\bH-2A\b/g, 'H two A')
            .replace(/\bL-1\b/g, 'L one')
            .replace(/\bF-1\b/g, 'F one')
            .replace(/\bJ-1\b/g, 'J one')
            .replace(/\bM-1\b/g, 'M one')
            .replace(/\bB-1\b/g, 'B one')
            .replace(/\bB-2\b/g, 'B two')
            .replace(/\bEB-1\b/g, 'E B one')
            .replace(/\bEB-2\b/g, 'E B two')
            .replace(/\bEB-3\b/g, 'E B three')
            .replace(/\bEB-4\b/g, 'E B four')
            .replace(/\bEB-5\b/g, 'E B five');
    }


    // ===================== AUDIO STATE TRACKER =====================
    // Tracks which button is currently playing — don't rely on responsiveVoice.isPlaying()
    let activeAudioBtn = null;

    function stopActiveAudio() {
        if (window.responsiveVoice) responsiveVoice.cancel();
        if (activeAudioBtn) {
            activeAudioBtn.classList.remove('playing');
            updateAudioIcon(activeAudioBtn, false);
            activeAudioBtn = null;
        }
    }


    // ===================== SPEAK A CARD =====================
    function speakCard(btn) {
        if (!window.responsiveVoice) return;

        // If this button is already playing, stop it
        if (activeAudioBtn === btn) {
            stopActiveAudio();
            return;
        }

        // Stop whatever else is playing
        stopActiveAudio();

        if (isMuted) return;

        const card = btn.closest('.visa-card') || btn.closest('.emergency-card');
        if (!card) return;

        let text = '';
        card.querySelectorAll('h3, p').forEach(el => {
            const t = el.innerText.trim();
            if (t) text += t + '. ';
        });
        if (!text) return;

        text = cleanForSpeech(text);

        activeAudioBtn = btn;
        btn.classList.add('playing');
        updateAudioIcon(btn, true);

        const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
        responsiveVoice.speak(text, voice, {
            onend: () => { if (activeAudioBtn === btn) stopActiveAudio(); },
            onerror: () => { if (activeAudioBtn === btn) stopActiveAudio(); }
        });
    }


    // ===================== SPEAK AN INFO PAGE =====================
    function speakInfoPage(btn) {
        if (!window.responsiveVoice) return;

        // If this button is already playing, stop it
        if (activeAudioBtn === btn) {
            stopActiveAudio();
            return;
        }

        // Stop whatever else is playing
        stopActiveAudio();

        if (isMuted) return;

        const screen = btn.closest('.screen');
        if (!screen) return;

        let text = '';
        screen.querySelectorAll('h2, h3, h4, p, li').forEach(el => {
            if (el.closest('.page-audio-btn')) return;
            const t = el.innerText.trim();
            if (t) text += t + '. ';
        });
        if (!text) return;

        text = cleanForSpeech(text);

        activeAudioBtn = btn;
        btn.classList.add('playing');
        updateAudioIcon(btn, true);

        const voice = currentLang === 'es' ? 'Spanish Latin American Female' : 'US English Female';
        responsiveVoice.speak(text, voice, {
            onend: () => { if (activeAudioBtn === btn) stopActiveAudio(); },
            onerror: () => { if (activeAudioBtn === btn) stopActiveAudio(); }
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
        stopActiveAudio();

        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang] && translations[lang][key] !== undefined) {
                // Don't overwrite innerHTML on buttons that have child elements (e.g. icon-only back buttons)
                if (el.tagName === 'BUTTON' && el.children.length > 0 && el.textContent.trim() === '') {
                    el.setAttribute('data-read', translations[lang][key]);
                } else {
                    el.innerHTML = translations[lang][key];
                }
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

        // Re-render offices in the new language
        filterOffices(document.getElementById('offices-search-input')?.value || '');
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
                    let readText = cleanForSpeech(button.getAttribute('data-read'));
                    responsiveVoice.speak(readText, voice);
                }, 600);
                button._didLongPress = () => didLongPress;
            }, { passive: true });
            button.addEventListener('touchend', () => clearTimeout(longPressTimer), { passive: true });
            button.addEventListener('touchmove', () => clearTimeout(longPressTimer), { passive: true });
            button.addEventListener('click', (e) => {
                if (button._didLongPress && button._didLongPress()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    button._didLongPress = () => false;
                }
            }, { capture: true });
        });

        // Card audio buttons — tap to speak
        // touchend + preventDefault blocks the synthetic click on mobile, avoiding double-fire.
        // The click listener only runs on true mouse clicks (no prior touch).
        document.querySelectorAll('.card-audio-btn').forEach(btn => {
            let touchFired = false;
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                touchFired = true;
                speakCard(btn);
                setTimeout(() => { touchFired = false; }, 500);
            }, { passive: false });
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (touchFired) return;
                speakCard(btn);
            });
        });

        // Info page audio buttons — tap to speak
        document.querySelectorAll('.page-audio-btn').forEach(btn => {
            let touchFired = false;
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                touchFired = true;
                speakInfoPage(btn);
                setTimeout(() => { touchFired = false; }, 500);
            }, { passive: false });
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (touchFired) return;
                speakInfoPage(btn);
            });
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
        stopActiveAudio();

        // Update ALL injected nav mute buttons (one per screen) by class
        document.querySelectorAll('.bnav-audio-toggle').forEach(muteBtn => {
            const icon = muteBtn.querySelector('.mute-icon');
            const label = muteBtn.querySelector('.mute-label');
            if (icon) icon.className = isMuted ? 'fa-solid fa-volume-xmark mute-icon' : 'fa-solid fa-volume-high mute-icon';
            if (label) label.textContent = isMuted ? 'Audio Off' : 'Audio On';
            muteBtn.classList.toggle('muted', isMuted);
        });
    }


    // ===================== INJECT INFO PAGE AUDIO BUTTONS =====================
    function buildInfoPageAudioButtons() {
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
    function buildBottomNav() {
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
            <button class="bnav-btn bnav-audio-toggle" onclick="toggleMute()" aria-label="Toggle audio">
                <i class="fa-solid fa-volume-high mute-icon"></i>
                <span class="mute-label">Audio On</span>
            </button>
        </nav>
    `;
        document.querySelectorAll('.screen').forEach(screen => {
            screen.insertAdjacentHTML('beforeend', navHTML);
        });
    }


    // ===================== INJECT LANG TOGGLE =====================
    function buildLangToggle() {
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


    // ===================== OFFICE LOCATOR =====================
    function t(key) {
        return (translations[currentLang] && translations[currentLang][key]) || key;
    }

    let currentOfficeFilter = 'all';

    function renderOffices(list) {
        const container = document.getElementById('offices-list');
        const noResults = document.getElementById('offices-no-results');
        if (!container) return;
        if (!list || list.length === 0) {
            container.innerHTML = '';
            if (noResults) {
                noResults.textContent = t('offices_no_results');
                noResults.classList.remove('hidden');
            }
            return;
        }
        if (noResults) noResults.classList.add('hidden');
        container.innerHTML = list.map(o => {
            const badgeLabel = o.type === 'immigration'
                ? `<i class="fa-solid fa-building-columns"></i> ${t('badge_gov')}`
                : `<i class="fa-solid fa-scale-balanced"></i> ${t('badge_legal')}`;
            return `
            <div class="office-card ${o.type}">
                <span class="office-type-badge ${o.type}">${badgeLabel}</span>
                <h3 class="office-name">${o.name}</h3>
                <p class="office-address"><i class="fa-solid fa-location-dot"></i> ${o.address}</p>
                <p class="office-note">${o.note}</p>
                <a href="tel:${o.phone.replace(/\D/g, '')}" class="office-call-btn">
                    <i class="fa-solid fa-phone"></i> ${o.phone}
                </a>
            </div>`;
        }).join('');
    }

    function filterOffices(query) {
        const officesData = (translations[currentLang] && translations[currentLang].offices) || [];
        const q = (query || '').toLowerCase().trim();
        let results = officesData;
        if (currentOfficeFilter !== 'all') {
            results = results.filter(o => o.type === currentOfficeFilter);
        }
        if (q.length > 0) {
            results = results.filter(o =>
                (o.keywords || []).some(k => k.includes(q)) ||
                o.name.toLowerCase().includes(q) ||
                o.address.toLowerCase().includes(q) ||
                o.note.toLowerCase().includes(q)
            );
        }
        renderOffices(results);
    }

    function setOfficeFilter(type, btn) {
        currentOfficeFilter = type;
        document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        filterOffices(document.getElementById('offices-search-input')?.value || '');
    }

    // ===================== INIT =====================
    document.addEventListener('DOMContentLoaded', () => {
        buildInfoPageAudioButtons();
        buildBottomNav();
        buildLangToggle();
        loadTranslations(); // offices render inside applyLanguage once translations load

        // Set initial nav highlight for home screen
        updateNavHighlight('screen-home');

        if (window.responsiveVoice && responsiveVoice.speak) {
            initHoverVoice();
        } else {
            window.addEventListener('ResponsiveVoiceReady', initHoverVoice);
        }
    });

    // ===================== EXPOSE GLOBALS =====================
    window.showScreen = showScreen;
    window.applyLanguage = applyLanguage;
    window.toggleMute = toggleMute;
    window.filterOffices = filterOffices;
    window.setOfficeFilter = setOfficeFilter;

})();