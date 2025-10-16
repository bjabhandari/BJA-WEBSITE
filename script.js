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
            // Helpful message
            showFeedback('Email service not configured. Opening your email client as a fallback...', 'text-yellow-600');

            // Build mailto fallback safely
            const subject = encodeURIComponent(`Website Inquiry from ${name}`);
            const bodyLines = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Type of Event: ${eventType}`,
                ``,
                `Message:`,
                message
            ];
            const body = encodeURIComponent(bodyLines.join('\n'));
            const to = 'bijayabhandari515@gmail.com'; // change this to your email if desired
            const mailto = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;

            try {
                // Use an anchor to open mail client which is less likely to be blocked
                const a = document.createElement('a');
                a.href = mailto;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                showFeedback('Email client opened. If it did not open, please check your browser settings.', 'text-yellow-600');
            } catch (err) {
                console.error('Mailto fallback failed:', err);
                showFeedback('Could not open email client. Please send a message to ' + to, 'text-red-600');
            } finally {
                // Re-enable the button
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
            }

            return;
        }

        // send via EmailJS
        emailjs.send(serviceId, templateId, templateParams)
            .then(function (response) {
                showFeedback('Message sent — thank you! I will get back to you soon.', 'text-green-600');
                form.reset();
            }, function (error) {
                console.error('EmailJS error:', error);
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