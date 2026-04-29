// --------------- Fetching Data | Async, Await, Try/Catch ---------------

async function getData() {
   try {
      const response = await fetch('data.json');
      const data = await response.json();

      // --------------- Click Each CD to Open Popup ---------------

      document.querySelectorAll('.cd-item').forEach(function (item) {
         item.addEventListener('click', function () {
            const id = parseInt(item.dataset.concert);
            const concert = data.concerts[id - 1];
            openPopup(concert);
         });
      });

   } catch (error) {
      console.error('Oops, something went wrong getting the data:', error);
   }
}

// --------------- Pop Up Videos and Info ---------------

function openPopup(concert) {
   document.querySelector('.popup-info').innerHTML = outputHTML(concert);

   const video = document.querySelector('#popup-video');
   video.src = 'videos/concert-' + concert.id + '.mp4';
   video.load();
   video.play().catch(function () {
   });

   document.querySelector('#overlay').classList.add('open');
}

// --------------- HTML String for the Popup ---------------

function outputHTML(concert) {
   const html = `<h2>${concert.artist}</h2>
      <p>${concert.tour}</p>
      <p>${concert.venue}</p>
      <p>${concert.date}</p>`;
   return html;
}

// --------------- Closes Pop Up / Stops Vid ---------------

function closePopup() {
   const video = document.querySelector('#popup-video');
   video.pause();
   video.src = '';
   document.querySelector('#overlay').classList.remove('open');
}

// --------------- Closes Pop Up / Overlay when X Clicked ---------------

document.querySelector('#popup-close').addEventListener('click', function (event) {
   event.preventDefault();
   closePopup();
});

// --------------- Closes Pop Up when Backdrop Clicked ---------------

document.querySelector('#overlay-backdrop').addEventListener('click', closePopup);


getData();