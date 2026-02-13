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

// Booking -> confirmation -> QR flow for Book Now button
document.addEventListener('DOMContentLoaded', function () {
    const bookBtn = document.getElementById('book-now-btn');
    const bookingModal = document.getElementById('booking-modal');
    const bookingClose = document.getElementById('booking-close');
    const bookingCancel = document.getElementById('booking-cancel');
    const bookingConfirm = document.getElementById('booking-confirm');
    const bookingConfirmation = document.getElementById('booking-confirmation');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    const bookingAccepted = document.getElementById('booking-accepted');
    const bookingAcceptedCard = document.getElementById('booking-accepted-card');
    const bookingQR = document.getElementById('booking-qr');
    const downloadQR = document.getElementById('download-qr');
    const closeAccepted = document.getElementById('close-accepted');

    function openModal(el) { if (!el) return; el.classList.remove('hidden'); el.classList.add('flex'); }
    function closeModal(el) { if (!el) return; el.classList.add('hidden'); el.classList.remove('flex'); }

    if (bookBtn) bookBtn.addEventListener('click', function () { openModal(bookingModal); });
    if (bookingClose) bookingClose.addEventListener('click', function () { closeModal(bookingModal); });
    if (bookingCancel) bookingCancel.addEventListener('click', function () { closeModal(bookingModal); });

    if (bookingConfirm) bookingConfirm.addEventListener('click', function () {
        // basic validation
        const name = (document.getElementById('booking-name') || {}).value || '';
        const contact = (document.getElementById('booking-contact') || {}).value || '';
        if (!name || !contact) {
            alert('Please enter your name and contact');
            return;
        }
        // show confirm yes/no
        closeModal(bookingModal);
        openModal(bookingConfirmation);
    });

    if (confirmNo) confirmNo.addEventListener('click', function () { closeModal(bookingConfirmation); });

    if (confirmYes) confirmYes.addEventListener('click', function () {
        // build booking payload
        const name = (document.getElementById('booking-name') || {}).value || '';
        const contact = (document.getElementById('booking-contact') || {}).value || '';
        const service = (document.getElementById('booking-service') || {}).value || '';
        const notes = (document.getElementById('booking-notes') || {}).value || '';

        const bookingId = 'BK' + Date.now();
        const payload = JSON.stringify({ id: bookingId, name, contact, service, notes });

        // generate QR via Google Chart API (simple, no extra dependency)
        const qrUrl = 'https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=' + encodeURIComponent(payload) + '&choe=UTF-8';
        if (bookingQR) bookingQR.src = qrUrl;
        if (downloadQR) downloadQR.href = qrUrl;

        closeModal(bookingConfirmation);

        // show acceptance modal with animation
        if (bookingAccepted) {
            bookingAccepted.classList.remove('hidden');
            bookingAccepted.classList.add('flex');
        }
        if (bookingAcceptedCard) {
            // start scaled down then pop in
            bookingAcceptedCard.style.transform = 'scale(0.6)';
            bookingAcceptedCard.style.opacity = '0';
            setTimeout(() => {
                bookingAcceptedCard.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1), opacity 300ms ease';
                bookingAcceptedCard.style.transform = 'scale(1)';
                bookingAcceptedCard.style.opacity = '1';
            }, 40);
        }

        // store booking locally for demo
        try { localStorage.setItem('lastBooking', payload); } catch (e) { }
    });

    if (closeAccepted) closeAccepted.addEventListener('click', function () {
        if (bookingAcceptedCard) {
            bookingAcceptedCard.style.transform = 'scale(0.8)';
            bookingAcceptedCard.style.opacity = '0';
            setTimeout(() => {
                if (bookingAccepted) closeModal(bookingAccepted);
            }, 280);
        } else {
            if (bookingAccepted) closeModal(bookingAccepted);
        }
    });
});

// Sidebar toggle (independent of contact form logic)
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebar-toggle');
    const closeBtn = document.getElementById('sidebar-close');

    if (!sidebar) return;

    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
    }

    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
    }

    if (openBtn) openBtn.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    // close sidebar when clicking outside on small screens
    document.addEventListener('click', function (e) {
        const target = e.target;
        if (!sidebar.contains(target) && !((openBtn && openBtn.contains(target)))) {
            // only close when sidebar is visible on small screens
            if (!sidebar.classList.contains('-translate-x-full')) closeSidebar();
        }
    });
});