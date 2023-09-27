'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('img[data-src]');

////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // Obtaining the coordinates of section 1 | getBoundingClientRect is relative to the viewport.
  // const s1coords = section1.getBoundingClientRect();

  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', pageXOffset, pageYOffset);
  // console.log(
  //   'Height/Width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling
  // window.scrollTo(s1coords.left + pageXOffset, s1coords.top + pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left + pageXOffset,
  //   top: s1coords.top + pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

///////////////////////////////////////////////////
// Page navigation

// Without event delegation, this creates n copies of the same function each for every link which impact the performance
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     document.querySelector(this.getAttribute('href')).scrollIntoView({
//       behavior: 'smooth',
//     });
//   });
// });

// With event delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    document.querySelector(e.target.getAttribute('href')).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// Implementing Tabbed Component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activating tab
  clicked.classList.add('operations__tab--active');

  // Activating content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Implementing nav component
const handleHover = function (e) {
  const link = e.target;

  if (link.classList.contains('nav__link')) {
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Implementing sticky nav
// window.addEventListener('scroll', function (e) {
//   const initialCoords = section1.getBoundingClientRect();

//   window.scrollY >= initialCoords.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });

// Implementing sticky nav with Intersection Observer API
const stickyNav = function (entries, _) {
  const isIntersecting = entries[0].isIntersecting;

  if (!isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navHeight = nav.getBoundingClientRect().height;

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const observerStickyNav = new IntersectionObserver(stickyNav, obsOptions);
observerStickyNav.observe(header);

// Implementing reveal sections
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const options = {
  root: null,
  threshold: 0.15,
};

const observerRevealSection = new IntersectionObserver(revealSection, options);

sections.forEach(function (section) {
  // section.classList.add('section--hidden');
  observerRevealSection.observe(section);
});

// Implementing lazy loading images
const loadImage = function (entries, observer) {
  const [entry] = entries;
  const img = entry.target;

  if (!entry.isIntersecting) return;

  img.src = img.dataset.src;

  img.addEventListener('load', function (e) {
    img.classList.remove('lazy-img');
  });

  observer.unobserve(img);
};

const optionsLoadImg = {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
};

const observerLoadImg = new IntersectionObserver(loadImage, optionsLoadImg);

lazyImages.forEach(img => observerLoadImg.observe(img));

// Implementing slides
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  let currSlide = 0;
  const numSlides = slides.length - 1;

  //Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, index) =>
        (s.style.transform = `translateX(${(index - slide) * 100}%)`)
    );
    activateDot(slide);
  };

  const nextSlide = function () {
    if (currSlide === numSlides) {
      currSlide = 0;
    } else {
      currSlide++;
    }

    goToSlide(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) {
      currSlide = numSlides;
    } else {
      currSlide--;
    }

    goToSlide(currSlide);
  };

  const init = function () {
    createDots(0);
    goToSlide(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Sliding with left and right key arrows
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  // Implementing dots
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
slider();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// TYPES OF EVENTS AND EVENT HANDLERS /////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const h1 = document.querySelector('h1');

// const greet = function (e) {
//   alert('Hello world!');
// };

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

// h1.addEventListener('mouseenter', alertH1);
// h1.addEventListener('mouseenter', greet);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// EVENT PROPAGATION IN PRACTICE /////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);

//   // Stop propagation / stop bubbling
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LIST', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   true // In capture phase
// );

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// TRAVERSING THE DOM /////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const h1 = document.querySelector('h1');

// // Going downwards: Selecting child elements.
// console.log(h1.querySelectorAll('.highlight')); // All children of the element that have the 'highlight' class. Returns a NodeList.
// console.log(h1.childNodes); // All direct children of the element, regardless of type. Returns a NodeList.
// console.log(h1.children); // Element type direct children. Returns an HTML Collection.
// console.log(h1.firstElementChild); // First child of the element. It only considers children of type element.
// console.log(h1.lastElementChild); // Last child of the element. It only considers children of type element.

// // Going upwards: Selecting parent elements.
// console.log(h1.parentNode); // Direct parent node element (any type)
// console.log(h1.parentElement); // Direct parent element
// console.log(h1.closest('.header')); // Selects the closest parent element with an arbitrary class, ID, or label.
// console.log(h1.closest('h1')); // Considers the element that calls the method as part of its parent elements.

// // Going sideways: Selecting sibling elements.
// console.log(h1.previousElementSibling); // Previous element sibling
// console.log(h1.nextElementSibling); // Next element sibling
// console.log(h1.previousSibling); // Previous sibling node (any type)
// console.log(h1.nextSibling); // Next sibling node (any type)
