(function () {
    'use strict';

    const button = document.querySelector('button');
    const body = document.querySelector('body');
    const banner = document.querySelector('#banner');
    const bannerImg = document.querySelector('#banner-img');
    const sections = document.querySelectorAll('section');
    let mode = 'dark';

    button.addEventListener('click', function () {
        if (mode === 'dark') {
            body.className = 'switch';
            banner.className = 'switch';
            button.className = 'switch';
            for (const section of sections) {
                section.className = 'switch';
            }
            bannerImg.src = 'images/night-view.png'; // swap to dark image
            bannerImg.alt = 'night view';
            mode = 'light';
        } else {
            body.removeAttribute('class');
            banner.removeAttribute('class');
            button.removeAttribute('class');
            for (const section of sections) {
                section.removeAttribute('class');
            }
            bannerImg.src = 'images/day-view.jpg'; //swap back
            bannerImg.alt = 'day view';
            mode = 'dark';
        }
    });
})();