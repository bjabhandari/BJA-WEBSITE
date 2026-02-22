// Contact form submission using EmailJS
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

function closeVideoCV() {
    const modal = document.getElementById('video-cv-modal');
    const iframe = document.getElementById('video-cv-iframe');
    if (modal && iframe) {
        iframe.src = '';
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}
