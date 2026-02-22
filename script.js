// Contact form submission using EmailJS
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Ensure the preloader stays for at least 2 seconds
        const minDisplayTime = 2000;
        const loadTime = Date.now() - performance.timing.navigationStart;
        const remainingTime = Math.max(0, minDisplayTime - loadTime);

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 700);
        }, remainingTime);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit');
    const feedback = document.getElementById('contact-feedback');

    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // read service/template IDs from data attributes
        const serviceId = form.dataset.serviceId || 'YOUR_EMAILJS_SERVICE_ID';
        const templateId = form.dataset.templateId || 'YOUR_EMAILJS_TEMPLATE_ID';

        const name = (document.getElementById('name') || {}).value || '';
        const email = (document.getElementById('email') || {}).value || '';
        const eventType = (document.getElementById('event_type') || {}).value || '';
        const message = (document.getElementById('message') || {}).value || '';

        // basic validation
        if (!name || !email || !message) {
            showFeedback('Please fill in your name, email, and message.', 'text-red-600');
            return;
        }

        // disable submit
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-60', 'cursor-not-allowed');

        const templateParams = {
            from_name: name,
            from_email: email,
            event_type: eventType,
            message: message
        };

        // If EmailJS is not configured or library missing, provide a fallback
        const isPlaceholder = (s) => !s || s.includes('YOUR_EMAILJS');
        const emailjsAvailable = typeof emailjs !== 'undefined' && typeof emailjs.send === 'function';

        if (!emailjsAvailable || isPlaceholder(serviceId) || isPlaceholder(templateId)) {
            // EmailJS not available or not configured: show clear instructions instead of opening mailto
            const to = 'bijayabhandari515@gmail.com';
            showFeedback('Email service not configured. Please email ' + to + ' directly, or contact via social links.', 'text-yellow-600');

            // Re-enable the button so the user can try again later
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');

            return;
        }

        // send via EmailJS
        emailjs.send(serviceId, templateId, templateParams)
            .then(function (response) {
                showFeedback('Message sent — thank you! I will get back to you soon.', 'text-green-600');
                form.reset();
            }, function (error) {
                // Log full error for debugging
                console.error('EmailJS error:', error);

                // EmailJS returns a status and text on errors; 412 often means Gmail OAuth needs reauthorization
                try {
                    const status = error && error.status;
                    const text = error && error.text;
                    if (status === 412 || (typeof text === 'string' && text.toLowerCase().includes('invalid grant'))) {
                        showFeedback('Email service authorization error: please reconnect your Gmail in the EmailJS dashboard.', 'text-red-600');
                        return;
                    }
                } catch (e) {
                    // ignore parsing errors
                }

                showFeedback('Sorry — something went wrong. Please try again later.', 'text-red-600');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
            });
    });

    function showFeedback(text, colorClass) {
        feedback.className = '';
        feedback.classList.add('mb-4', 'font-medium', colorClass);
        feedback.textContent = text;
        feedback.classList.remove('hidden');
        // auto-hide after 6s
        setTimeout(() => feedback.classList.add('hidden'), 6000);
    }

    // Mobile Menu Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navContent = document.getElementById('nav-content');
    if (navToggle && navContent) {
        navToggle.onclick = function () {
            navContent.classList.toggle('hidden');
        };
    }

    // Popup ad logic: show on load unless user has skipped before (stored in localStorage).
    (function () {
        const popup = document.getElementById('popup-ad');
        const skip = document.getElementById('ad-skip');
        const link = document.getElementById('popup-ad-link');
        let timer = null;

        if (!popup) return;

        // If user previously skipped, don't show again
        try {
            if (localStorage.getItem('popupAdDismissed') === '1') {
                return;
            }
        } catch (err) {
            console.warn('localStorage unavailable for popup ad persistence', err);
        }

        function closePopup(persist) {
            if (!popup) return;
            popup.style.display = 'none';
            if (timer) { clearTimeout(timer); timer = null; }
            if (persist) {
                try { localStorage.setItem('popupAdDismissed', '1'); } catch (err) { }
            }
        }

        // Show popup
        popup.style.display = 'flex';
        // Auto close after 3 seconds
        timer = setTimeout(function () { closePopup(false); }, 3000);

        // Skip button: close and persist dismissal
        if (skip) {
            skip.addEventListener('click', function (e) {
                e.preventDefault();
                closePopup(true);
            });
        }

        // Close when user clicks outside the image
        popup.addEventListener('click', function (e) {
            if (e.target === popup) closePopup(false);
        });

        // Close when user clicks the ad link
        if (link) {
            link.addEventListener('click', function () { closePopup(false); });
        }
    })();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                if (window.innerWidth < 1024 && navContent) {
                    navContent.classList.add('hidden');
                }
            }
        });
    });

    // Scrollspy: set active nav link based on the section in view
    (function () {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));

        if (sections.length === 0 || navLinks.length === 0) return;

        function setActive(link) {
            navLinks.forEach(a => {
                a.classList.remove('text-orange-600', 'bg-orange-50');
                a.classList.add('text-gray-600');
            });
            if (link) {
                link.classList.remove('text-gray-600');
                link.classList.add('text-orange-600', 'bg-orange-50');
            }
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = navLinks.find(a => a.getAttribute('href') === `#${id}`);
                    setActive(activeLink);
                }
            });
        }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

        sections.forEach(s => observer.observe(s));

        // Initial check on load
        window.addEventListener('load', () => {
            sections.forEach(s => {
                const rect = s.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.25) {
                    const activeLink = navLinks.find(a => a.getAttribute('href') === `#${s.id}`);
                    setActive(activeLink);
                }
            });
        });
    })();

    // Make pricing cards selectable
    (function () {
        const cards = document.querySelectorAll('#services .relative');
        cards.forEach(card => {
            if (card.classList.contains('bg-white') || card.classList.contains('bg-orange-500')) {
                card.classList.add('price-card');
                card.style.cursor = 'pointer';
                card.addEventListener('click', function (e) {
                    if (e.target.closest('a') || e.target.closest('button')) return;
                    document.querySelectorAll('#services .price-card.featured').forEach(c => c.classList.remove('featured'));
                    card.classList.toggle('featured');
                });
            }
        });
    })();
});

// Video CV Functions (Outside DOMContentLoaded as they are called via onclick)
function openVideoCV() {
    const modal = document.getElementById('video-cv-modal');
    const iframe = document.getElementById('video-cv-iframe');
    if (modal && iframe) {
        iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Replace with actual URL if different
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}


// Video CV Carousel Initialization
(function () {
    const sliderContainer = document.querySelector('.video-slider-container');
    if (!sliderContainer) return;

    let currentIndex = 0;
    const items = document.querySelectorAll('.slider-item');
    const total = items.length;
    let autoPlayInterval;

    function updateSlider() {
        const isMobile = window.innerWidth < 768;

        items.forEach((item, index) => {
            let diff = index - currentIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const absDiff = Math.abs(diff);
            let rotation = diff * 25;
            let translateZ = 0;
            let translateX = diff * 12;

            // Adjust spread for mobile
            if (isMobile) {
                translateX = diff * 15; // Tighter spread
                rotation = diff * 15; // Less rotation
            }

            let opacity = 1 - (absDiff * 0.4);
            let zIndex = 10 - absDiff;

            if (absDiff === 0) {
                rotation = 0;
                translateZ = 400;
                translateX = 0;
                opacity = 1;
                zIndex = 10;
                item.classList.add('active');
            } else {
                item.classList.remove('active');
                // On mobile, fade out side videos much faster to avoid overlap
                if (isMobile && absDiff >= 1) opacity = 0.2;
                if (absDiff > 2) opacity = 0;
            }

            item.style.transform = `translate(-50%, -50%) rotateY(${rotation}deg) translateX(${translateX}vw) translateZ(${translateZ}px)`;
            item.style.opacity = Math.max(0, opacity);
            item.style.zIndex = Math.round(zIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % total;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + total) % total;
        updateSlider();
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 3500);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);

    let startX = 0;
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoPlay();
    });
    sliderContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) nextSlide();
        else if (endX - startX > 50) prevSlide();
        startAutoPlay();
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();
    startAutoPlay();

    // Load YouTube API if not already present
    if (!document.getElementById('youtube-api-script')) {
        var tag = document.createElement('script');
        tag.id = 'youtube-api-script';
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
})();

