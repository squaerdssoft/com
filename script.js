// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    // Create all icons
    lucide.createIcons();

    // Initialize custom cursor
    initCustomCursor();

    // Initialize scroll progress bar
    initScrollProgress();

    // Initialize brand icons in nav
    initBrandIcons();

    // Initialize brand marquee
    initBrandMarquee();

    // Initialize video player
    initVideoPlayer();
});

// Custom Cursor Following Mouse
function initCustomCursor() {
    const cursorOuter = document.getElementById('cursor-outer');
    const cursorInner = document.getElementById('cursor-inner');

    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;
    let innerX = 0;
    let innerY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation with spring effect
    function animateCursor() {
        // Outer cursor (slower, spring effect)
        const outerDamping = 0.15;
        outerX += (mouseX - 16 - outerX) * outerDamping;
        outerY += (mouseY - 16 - outerY) * outerDamping;
        cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;

        // Inner cursor (faster)
        const innerDamping = 0.25;
        innerX += (mouseX - 3 - innerX) * innerDamping;
        innerY += (mouseY - 3 - innerY) * innerDamping;
        cursorInner.style.transform = `translate(${innerX}px, ${innerY}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.getElementById('progress-bar');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.scrollY;
        const progress = scrolled / windowHeight;

        progressBar.style.transform = `scaleX(${progress})`;
    });
}

// Brand Icons Data
const brands = [
    { icon: 'github', name: 'GitHub' },
    { icon: 'youtube', name: 'YouTube' },
    { icon: 'chrome', name: 'Google' },
    { icon: 'figma', name: 'Figma' },
    { icon: 'slack', name: 'Slack' },
    { icon: 'twitter', name: 'Twitter' },
    { icon: 'message-square', name: 'Discord' }
];

// Initialize Brand Icons in Nav
function initBrandIcons() {
    const container = document.getElementById('brand-icons');

    brands.forEach((brand, i) => {
        const div = document.createElement('div');
        div.className = 'w-8 h-8 bg-white/60 backdrop-blur-md border border-black/5 rounded-full flex items-center justify-center shadow-sm hover:z-20 hover:scale-125 transition-transform';
        div.style.opacity = '0';
        div.style.animation = `fadeIn 0.8s ease-out forwards ${i * 0.1}s`;

        const iconElement = document.createElement('i');
        iconElement.setAttribute('data-lucide', brand.icon);
        iconElement.className = 'w-3.5 h-3.5 opacity-60';

        div.appendChild(iconElement);
        container.appendChild(div);
    });

    // Reinitialize icons after adding them
    lucide.createIcons();

    // Add floating animation
    const brandDivs = container.querySelectorAll('div');
    brandDivs.forEach((div, i) => {
        animateFloatingIcon(div, i);
    });
}

// Floating animation for brand icons
function animateFloatingIcon(element, index) {
    let time = index * 0.2;

    function animate() {
        time += 0.01;
        const y = Math.sin(time) * 10;
        const x = Math.cos(time * 0.5) * (index % 2 === 0 ? 5 : -5);
        element.style.transform = `translateY(${y}px) translateX(${x}px)`;
        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize Brand Marquee
function initBrandMarquee() {
    const marquee = document.getElementById('brand-marquee');

    // Create multiple sets for seamless loop
    const marqueeContent = [];
    for (let set = 0; set < 5; set++) {
        brands.forEach((brand, i) => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-4 group cursor-pointer';

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'w-16 h-16 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center border border-white group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-xl shadow-black/[0.02]';

            const iconElement = document.createElement('i');
            iconElement.setAttribute('data-lucide', brand.icon);
            iconElement.className = 'w-6 h-6';

            iconWrapper.appendChild(iconElement);

            const span = document.createElement('span');
            span.className = 'text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 group-hover:text-black transition-colors';
            span.textContent = brand.name;

            div.appendChild(iconWrapper);
            div.appendChild(span);

            marqueeContent.push(div);
        });
    }

    marqueeContent.forEach(item => marquee.appendChild(item));

    // Reinitialize icons
    lucide.createIcons();

    // Add wave animation to marquee items
    const marqueeItems = marquee.querySelectorAll('.flex.items-center');
    marqueeItems.forEach((item, i) => {
        animateMarqueeItem(item, i);
    });
}

// Marquee item wave animation
function animateMarqueeItem(element, index) {
    let time = index * 0.1;

    function animate() {
        time += 0.015;
        const y = Math.sin(time + index * 0.5) * 40;
        const scale = 1 + Math.sin(time + index * 0.5) * 0.1;
        element.style.transform = `translateY(${y}px) scale(${scale})`;
        requestAnimationFrame(animate);
    }

    animate();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// Video Player Control
function initVideoPlayer() {
    const video = document.getElementById('promo-video');
    const playButton = document.getElementById('play-button');
    const textOverlay = document.getElementById('video-content-overlay');
    const playIcon = playButton ? playButton.querySelector('i') : null;
    const container = playButton ? playButton.closest('.group') : null;

    if (!video || !playButton || !textOverlay) return;

    function togglePlay() {
        if (video.paused) {
            video.play();
            if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
            // Remove grayscale and increase opacity when playing
            video.classList.remove('grayscale', 'opacity-20');
            video.classList.add('opacity-100');

            // Hide UI elements with smooth transitions
            playButton.classList.add('opacity-0', 'pointer-events-none');
            textOverlay.classList.add('opacity-0', 'translate-y-4');
        } else {
            video.pause();
            if (playIcon) playIcon.setAttribute('data-lucide', 'play');
            // Re-apply grayscale and decrease opacity when paused
            video.classList.add('grayscale', 'opacity-20');
            video.classList.remove('opacity-100');

            // Show UI elements
            playButton.classList.remove('opacity-0', 'pointer-events-none');
            textOverlay.classList.remove('opacity-0', 'translate-y-4');
        }
        // Re-initialize icon
        lucide.createIcons();
    }

    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    // Make video clickable itself
    video.addEventListener('click', () => {
        togglePlay();
    });

    // Show button on hover if playing for easy pausing
    if (container) {
        container.addEventListener('mouseenter', () => {
            if (!video.paused) {
                playButton.classList.remove('opacity-0', 'pointer-events-none');
            }
        });

        container.addEventListener('mouseleave', () => {
            if (!video.paused) {
                playButton.classList.add('opacity-0', 'pointer-events-none');
            }
        });
    }

    // Reset UI when video finishes (if not looping)
    video.addEventListener('ended', () => {
        if (playIcon) playIcon.setAttribute('data-lucide', 'play');
        video.classList.add('grayscale', 'opacity-20');
        video.classList.remove('opacity-100');
        playButton.classList.remove('opacity-0', 'pointer-events-none');
        textOverlay.classList.remove('opacity-0', 'translate-y-4');
        lucide.createIcons();
    });
}
