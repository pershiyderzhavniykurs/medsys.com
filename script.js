const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav'); // Changed from mobileMenu to mainNav
const contentArea = document.getElementById('contentArea'); // Still used for blurring

// Create a mobile menu overlay if it doesn't exist
let mobileNavOverlay = document.getElementById('mobileNavOverlay');
if (!mobileNavOverlay) {
  mobileNavOverlay = document.createElement('div');
  mobileNavOverlay.id = 'mobileNavOverlay';
  mobileNavOverlay.classList.add('mobile-nav-overlay');
  mobileNavOverlay.innerHTML = `
    <button class="close-menu" aria-label="Закрити меню"><i class="fas fa-times"></i></button>
    <nav class="main-nav"></nav>
  `;
  document.body.appendChild(mobileNavOverlay);

  // Move the existing nav content into the overlay
  const desktopNavUl = mainNav.querySelector('ul');
  if (desktopNavUl) {
    mobileNavOverlay.querySelector('.main-nav').appendChild(desktopNavUl.cloneNode(true));
  }
}

// Get the cloned nav list from the overlay
const mobileNavList = mobileNavOverlay.querySelector('.main-nav ul');
const closeMenuButton = mobileNavOverlay.querySelector('.close-menu');

let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  mobileNavOverlay.classList.toggle('active', menuOpen);
  // Optional: Blur main content when menu is open - відключено для цієї стилістики
  // contentArea.classList.toggle('blurred', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : ''; // Prevent scrolling when menu is open
}

// Open menu
menuToggle.addEventListener('click', toggleMenu);

// Close menu via button inside overlay
closeMenuButton.addEventListener('click', toggleMenu);

// Close menu when a link inside it is clicked (for smoother navigation)
if (mobileNavList) {
  mobileNavList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      if (menuOpen) {
        toggleMenu();
      }
    });
  });
}

// Close menu when clicking outside (only if overlay is active)
document.addEventListener('click', function (e) {
  if (menuOpen && !mobileNavOverlay.contains(e.target) && !menuToggle.contains(e.target)) {
    toggleMenu();
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - (document.querySelector('.main-header').offsetHeight || 0), // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active navigation link based on scroll position (Optional, but good for official sites)
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - (document.querySelector('.main-header').offsetHeight || 0);
        if (pageYOffset >= sectionTop - 50) { // -50px buffer
            current = section.getAttribute('id');
        }
    });

    // Remove active from all links
    mainNav.querySelectorAll('a').forEach(link => {
        link.classList.remove('active');
    });
    if (mobileNavList) {
      mobileNavList.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
      });
    }


    // Add active to the current section's link
    const currentNavLink = mainNav.querySelector(`a[href="#${current}"]`);
    if (currentNavLink) {
        currentNavLink.classList.add('active');
    }
    const currentMobileNavLink = mobileNavList ? mobileNavList.querySelector(`a[href="#${current}"]`) : null;
    if (currentMobileNavLink) {
        currentMobileNavLink.classList.add('active');
    }
});