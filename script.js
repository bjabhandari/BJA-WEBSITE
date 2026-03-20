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
});

// Preloader Hiding Logic
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 700);
    }
});

// 3D Video Slider Logic for Video CV
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.video-slider');
    const items = document.querySelectorAll('.slider-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (!slider || items.length === 0) return;

    let currentIndex = 0;
    const totalItems = items.length;

    function updateSlider() {
        items.forEach((item, index) => {
            item.classList.remove('active');
            
            // Calculate relative index for 3D placement
            let relativeIndex = index - currentIndex;
            
            // Handle wrapping
            if (relativeIndex > Math.floor(totalItems / 2)) relativeIndex -= totalItems;
            if (relativeIndex < -Math.floor(totalItems / 2)) relativeIndex += totalItems;

            // Apply transformations
            const rotateY = relativeIndex * 45; // Spread items
            const translateZ = Math.abs(relativeIndex) * -150; // Push back non-active items
            const translateX = relativeIndex * 120; // Spread horizontally

            if (relativeIndex === 0) {
                item.classList.add('active');
                item.style.transform = `translate(-50%, -50%) translateZ(400px) rotateY(0deg)`;
                item.style.opacity = '1';
                item.style.zIndex = '10';
            } else {
                item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
                item.style.opacity = Math.abs(relativeIndex) > 2 ? '0' : '0.6';
                item.style.zIndex = (10 - Math.abs(relativeIndex)).toString();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateSlider();
        });
    }

    // Initialize
    updateSlider();
});

// Scroll Reveal Logic
document.addEventListener('DOMContentLoaded', function () {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of element is visible
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
});

