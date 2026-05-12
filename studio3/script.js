(function () {
  'use strict';

  // Holds all recipe data once loaded; tracks which recipe is open
  let recipes = [];
  let currentIndex = 0;


  // Fetches recipes.json and stores the data in recipes[], then binds the cards
  async function getData() {
    try {
      const response = await fetch('recipes.json');
      const data = await response.json();
      recipes = data;
      bindCards();
    } catch (error) {
      console.error('Oops, something went wrong getting the data:', error);
    }
  }


  // Attaches a click listener to each card that opens its recipe
  function bindCards() {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('click', function () {
        const index = parseInt(card.dataset.index, 10);
        openRecipeView(index);
      });
    });
  }


  // Fades out the home view, fades in the recipe view, then animates the title (GSAP)
  function openRecipeView(index) {
    currentIndex = index;
    const homeView = document.querySelector('#home-view');
    const recipeView = document.querySelector('#recipe-view');

    gsap.to(homeView, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: function () {
        homeView.classList.add('hidden');
        recipeView.classList.remove('hidden');
        recipeView.style.opacity = 0;
        populateRecipe(currentIndex);
        gsap.to(recipeView, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: animateTitle
        });
      }
    });
  }


  // Writes the recipe data into the DOM (counter, image, ingredients, steps)
  function populateRecipe(index) {
    const recipe = recipes[index];

    document.querySelector('#recipe-counter').textContent =
      (index + 1) + ' / ' + recipes.length;

    const recipeImg = document.querySelector('#recipe-img');
    recipeImg.src = recipe.img;
    recipeImg.alt = recipe.name;

    let ingredientHTML = '';
    for (let i = 0; i < recipe.ingredients.length; i++) {
      ingredientHTML += '<li>' + recipe.ingredients[i] + '</li>';
    }
    document.querySelector('#recipe-ingredients').innerHTML = ingredientHTML;

    let stepsHTML = '';
    for (let i = 0; i < recipe.steps.length; i++) {
      stepsHTML += '<li>' + recipe.steps[i] + '</li>';
    }
    document.querySelector('#recipe-steps').innerHTML = stepsHTML;

    document.querySelector('#recipe-title').textContent = '';
  }


  // Splits the recipe name into individual characters and animates each one in
  function animateTitle() {
    const title = document.querySelector('#recipe-title');
    const name = recipes[currentIndex].name;
    title.textContent = '';

    name.split('').forEach(function (char, i) {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // preserve spaces
      span.style.opacity = 0;
      span.style.display = 'inline-block';
      title.appendChild(span);
      gsap.from(span, { y: 12, duration: 0.3, delay: i * 0.04, ease: 'power2.out' });
      gsap.to(span, { opacity: 1, duration: 0.3, delay: i * 0.04, ease: 'power2.out' });
    });
  }


  // Used by prev/next buttons — fades the card out, swaps content, fades back in (GSAP)
  function showRecipe(index) {
    currentIndex = index;
    gsap.to('.recipe-card', {
      opacity: 0,
      duration: 0.2,
      onComplete: function () {
        populateRecipe(index);
        gsap.to('.recipe-card', { opacity: 1, duration: 0.3 });
        animateTitle();
      }
    });
  }


  // Fades out the recipe view and fades the home grid back in (GSAP)
  function returnToGrid() {
    const homeView = document.querySelector('#home-view');
    const recipeView = document.querySelector('#recipe-view');

    gsap.to(recipeView, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: function () {
        recipeView.classList.add('hidden');
        homeView.classList.remove('hidden');
        homeView.style.opacity = 0;
        gsap.to(homeView, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      }
    });
  }


  // Back button returns to the grid
  document.querySelector('#back-btn').addEventListener('click', returnToGrid);

  // Prev/next buttons calculate the new index and show that recipe
  // The % operator makes it wrap around 
  document.querySelector('#prev-btn').addEventListener('click', function () {
    const newIndex = (currentIndex - 1 + recipes.length) % recipes.length;
    showRecipe(newIndex);
  });

  document.querySelector('#next-btn').addEventListener('click', function () {
    const newIndex = (currentIndex + 1) % recipes.length;
    showRecipe(newIndex);
  });


  // Start AOS (handles the card fade-up animations on page load)
  AOS.init({
    duration: 900,
    once: true,
    easing: 'ease-out'
  });

  getData();

})();