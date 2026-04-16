(function () {
    'use strict';
    console.log('reading ')

    // --------------------- Loader Declaration ---------------------

    const loader = document.querySelector('#loader');


    // --------------------- Video Declaration ---------------------

    const myVideo = document.querySelector('#main-video');

    // --------------------- Text Card Declaration ---------------------

    const textCard1 = document.querySelector('#text-card-1');
    const textCard2 = document.querySelector('#text-card-2');
    const textCard3 = document.querySelector('#text-card-3');
    const textCard4 = document.querySelector('#text-card-4');
    const textCard5 = document.querySelector('#text-card-5');
    const textCard6 = document.querySelector('#text-card-6');
    const textCard7 = document.querySelector('#text-card-7');

    // --------------------- Image Declaration ---------------------

    const img1 = document.querySelector('#img-card-5');
    const img2 = document.querySelector('#img-card-6');
    const img3 = document.querySelector('#img-card-7');
    const img4 = document.querySelector('#img-card-8');
    const img5 = document.querySelector('#img-card-9');
    const img6 = document.querySelector('#img-card-10');
    const img7 = document.querySelector('#img-card-11');

    // --------------------- Timeline object ---------------------

    const timeline = {
        start: [0, 3, 6.5, 9.5, 13.65, 16.5, 22, 9.5, 9.5, 9.5, 9.5, 9.5, 9.5, 9.5],
        stop: [3, 6, 9, 12, 16.5, 22, 30, 12, 12, 12, 12, 12, 12, 12],
        line: [textCard1, textCard2, textCard3, textCard4, textCard5, textCard6, textCard7,
            img1, img2, img3, img4, img5, img6, img7]
    }


    // --------------------- Clickable Card ---------------------

    textCard7.addEventListener('click', function () {
        window.open('https://open.spotify.com/playlist/45ztWhei00wyxPLFEBMzYd?si=B2PSOkd_QSm_miViVb22Xw');
    });

    // --------------------- checkTime ---------------------


    function checkTime() {
        for (let i = 0; i < timeline.start.length; i++) {
            if (timeline.start[i] < myVideo.currentTime && myVideo.currentTime < timeline.stop[i]) {
                timeline.line[i].className = 'text-card showing';
            } else {
                timeline.line[i].className = 'text-card hidden';
            }
        }
    }

    const intervalID = setInterval(checkTime, 1000);

    // --------------------- Loader ---------------------

    myVideo.addEventListener('canplaythrough', function () {
        loader.classList.add('hidden');
    });

})();