/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

/*===== MENU SHOW =====*/
if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/*===== MENU HIDDEN =====*/
if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav-link');

function linkAction(){
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');

function scrollActive(){
    const scrollY = window.pageYOffset;

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        
        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active-link');
        }else{
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}
window.addEventListener('scroll', scrollActive);

/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
    const header = document.getElementById('header');
    if(this.scrollY >= 80) header.classList.add('scroll-header'); 
    else header.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader);

/*==================== REVEAL ANIMATION ON SCROLL ====================*/
function reveal() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', reveal);
// Trigger reveal on load
reveal();

/*==================== PARALLAX EFFECT ON MOUSEMOVE ====================*/
document.addEventListener("mousemove", parallax);
function parallax(e) {
    this.querySelectorAll('.bg-shape').forEach(shape => {
        const speed = shape.getAttribute('data-speed') || 5;
        const x = (window.innerWidth - e.pageX*speed)/100;
        const y = (window.innerHeight - e.pageY*speed)/100;
        shape.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
}
/*==================== SMOOTH SCROLL FOR INTERNAL LINKS ===================*/
const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            if (navMenu.classList.contains('show-menu')) {
                navMenu.classList.remove('show-menu');
            }
        }
    });
});
