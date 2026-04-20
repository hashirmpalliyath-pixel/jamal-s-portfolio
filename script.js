/*==================== SHOW MENU ====================*/
const navMenu    = document.getElementById('nav-menu');
const navToggle  = document.getElementById('nav-toggle');
const navClose   = document.getElementById('nav-close');

if(navToggle){ navToggle.addEventListener('click', () => navMenu.classList.add('show-menu')); }
if(navClose) { navClose.addEventListener('click',  () => navMenu.classList.remove('show-menu')); }

const navLink = document.querySelectorAll('.nav-link');
function linkAction(){
    document.getElementById('nav-menu').classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*==================== SCROLL ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');
function scrollActive(){
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop    = current.offsetTop - 100;
        const sectionId     = current.getAttribute('id');
        const linkEl        = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
        if (!linkEl) return;
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            linkEl.classList.add('active-link');
        } else {
            linkEl.classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*==================== SCROLL HEADER ====================*/
function scrollHeader(){
    const header = document.querySelector('.header');
    if(!header) return;
    if(window.scrollY >= 80) header.classList.add('scroll-header');
    else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/*==================== REVEAL ON SCROLL ====================*/
function reveal(){
    document.querySelectorAll('.reveal').forEach(el => {
        const top = el.getBoundingClientRect().top;
        if(top < window.innerHeight - 150) el.classList.add('active');
    });
}
window.addEventListener('scroll', reveal);
reveal();

/*==================== PARALLAX MOUSE ====================*/
document.addEventListener('mousemove', function parallax(e){
    document.querySelectorAll('.bg-shape').forEach(shape => {
        const speed = shape.getAttribute('data-speed') || 5;
        const x = (window.innerWidth  - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        shape.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

/*==================== SMOOTH SCROLL (LENIS) ====================*/
const lenis = new Lenis({
  duration: 1.5, // Smooth, cinematic duration
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1, // Standard wheel response
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e){
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if(targetEl){
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -64 });
            document.getElementById('nav-menu')?.classList.remove('show-menu');
        }
    });
});

/* ============================================================
   CINEMATIC SCROLL HERO DRIVER
   ============================================================
   The .scroll-hero section is 350vh tall.
   The sticky inner is 100vh.
   Scroll travel = 250vh (the extra 2.5 viewports).

   On each scroll tick we:
     1. Scale + pan the image (subtle Ken‑Burns zoom)
     2. Translate the text block upward (faster parallax)
     3. Fade & slide the scroll indicator out
     4. Darken the overlay as the user scrolls deeper
     5. Advance the thin progress bar
     6. Fade the entire text out near the exit point
   ============================================================ */

(function(){
    const heroSection  = document.querySelector('.scroll-hero');
    const heroImg      = document.getElementById('heroImg');
    const heroText     = document.getElementById('heroText');
    const heroEyebrow  = document.getElementById('heroEyebrow');
    const heroName     = document.getElementById('heroName');
    const heroRole     = document.getElementById('heroRole');
    const heroSub      = document.getElementById('heroSub');
    const heroCta      = document.getElementById('heroCta');
    const heroSocial   = document.getElementById('heroSocial');
    const heroIndicator= document.getElementById('heroIndicator');
    const heroProgress = document.getElementById('heroProgress');
    const heroOverlay  = document.querySelector('.scroll-hero__overlay');

    if(!heroSection) return;

    function clamp(val, min, max){ return Math.min(Math.max(val, min), max); }
    function lerp(a, b, t){ return a + (b - a) * t; }
    function easeOut(t){ return 1 - Math.pow(1 - t, 3); }

    function onScroll(){
        const scrollTop    = window.scrollY;
        const sectionTop   = heroSection.offsetTop;
        const sectionH     = heroSection.offsetHeight;  // 350vh
        const viewportH    = window.innerHeight;

        // How far we've scrolled INTO the section (0 → travelDist)
        const scrolled  = scrollTop - sectionTop;
        const travelDist = sectionH - viewportH;         // 250vh worth of pixels
        const progress  = clamp(scrolled / travelDist, 0, 1); // 0..1

        // --- Progress bar ---
        if(heroProgress) heroProgress.style.width = (progress * 100) + '%';

        // --- Image: Ken‑Burns scale (1 → 1.18) + slight upward pan ---
        const imgScale = lerp(1, 1.18, easeOut(progress));
        const imgTransY = lerp(0, -6, progress); // %, moves up a little
        if(heroImg){
            heroImg.style.transform = `scale(${imgScale}) translateY(${imgTransY}%)`;
        }

        // --- Overlay: darken as we scroll (adds extra tint layer) ---
        if(heroOverlay){
            const extraOpacity = lerp(0, 0.75, easeOut(progress));
            heroOverlay.style.backgroundColor = `rgba(0,0,0,${extraOpacity})`;
        }

        // --- Text block: parallax upward at 2× scroll speed ---
        const textY = lerp(0, -120, easeOut(progress));   // px
        if(heroText) heroText.style.transform = `translateY(${textY}px)`;

        // --- Individual text elements: staggered fade + translate out ---
        // Start fading at p=0.35, completely gone at p=0.65
        const textFade = clamp((progress - 0.35) / 0.30, 0, 1);
        const textOpacity = 1 - textFade;

        [heroEyebrow, heroRole, heroSub, heroCta].forEach((el, i) => {
            if(!el) return;
            const delay = i * 0.06;
            const f = clamp((progress - (0.3 + delay)) / 0.25, 0, 1);
            el.style.opacity  = 1 - f;
            el.style.transform = `translateY(${lerp(0, -30, easeOut(f))}px)`;
        });

        // Name stays longer — starts fading at 0.5
        if(heroName){
            const nameFade = clamp((progress - 0.45) / 0.30, 0, 1);
            heroName.style.opacity   = 1 - nameFade;
            heroName.style.transform = `translateY(${lerp(0, -20, easeOut(nameFade))}px)`;
        }

        // Social strip fades in opposite direction
        if(heroSocial){
            heroSocial.style.opacity   = textOpacity;
            heroSocial.style.transform = `translateY(${lerp(0, -80, easeOut(textFade))}px)`;
        }

        // --- Scroll indicator fades out early ---
        if(heroIndicator){
            const indFade = clamp(progress / 0.15, 0, 1);
            heroIndicator.style.opacity   = 1 - indFade;
            heroIndicator.style.transform = `translateX(-50%) translateY(${indFade * 20}px)`;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
})();

