// Booking System Variables
let currentService = '';
let currentPackage = '';
let currentPrice = 0;
let bookingData = {};

// Initialize Booking System
document.addEventListener('DOMContentLoaded', function() {
    // Setup book now buttons
    setupBookingButtons();
});

function setupBookingButtons() {
    const bookNowButtons = document.querySelectorAll('[data-book-package]');
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const packageName = this.getAttribute('data-book-package');
            const price = this.getAttribute('data-book-price');
            const features = this.getAttribute('data-book-features');
            openBookingModal(packageName, price, features);
        });
    });
}

function openBookingModal(packageName, price, features) {
    currentPackage = packageName;
    currentPrice = parseFloat(price);
    
    const modal = document.getElementById('booking-modal');
    const form = document.getElementById('booking-form');
    const summary = document.querySelector('.booking-summary');
    
    // Update modal title
    document.getElementById('booking-package-title').textContent = packageName;
    
    // Update price display
    document.querySelector('.booking-summary-item:last-child').innerHTML = 
        `<span>Total Price:</span><span>NPR ${currentPrice.toLocaleString()}</span>`;
    
    // Clear form
    form.reset();
    
    // Show modal
    modal.classList.add('show');
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('show');
}

// Submit booking form
function submitBooking() {
    const form = document.getElementById('booking-form');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    bookingData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        package: currentPackage,
        price: currentPrice,
        description: document.getElementById('projectDesc').value,
        deadline: document.getElementById('deadline').value,
        date: new Date().toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    closeBookingModal();
    showQRModal();
}

function showQRModal() {
    const qrModal = document.getElementById('qr-modal');
    const qrcodeContainer = document.getElementById('qrcode');
    
    // Clear previous QR code
    qrcodeContainer.innerHTML = '';
    
    // Generate booking reference
    const bookingRef = 'BJA' + Date.now();
    
    // Create payment URL (can be customized to your payment gateway)
    const paymentDetails = `Name: ${bookingData.fullName}|Email: ${bookingData.email}|Phone: ${bookingData.phone}|Package: ${bookingData.package}|Price: NPR ${bookingData.price}|Date: ${bookingData.date}|BookingRef: ${bookingRef}`;
    
    // Generate QR Code
    QRCode.toCanvas(qrcodeContainer, paymentDetails, {
        errorCorrectionLevel: 'H',
        type: 'image/webp',
        quality: 0.98,
        margin: 1,
        width: 300,
        color: {
            dark: '#ff3c00',
            light: '#ffffff'
        }
    }, function(error) {
        if (error) console.error(error);
    });

    // Update QR info
    document.getElementById('booking-ref').textContent = bookingRef;
    document.getElementById('customer-name').textContent = bookingData.fullName;
    document.getElementById('package-name').textContent = bookingData.package;
    document.getElementById('booking-price').textContent = `NPR ${bookingData.price.toLocaleString()}`;
    
    // Show modal
    qrModal.classList.add('show');
}

function closeQRModal() {
    const qrModal = document.getElementById('qr-modal');
    qrModal.classList.remove('show');
}

function downloadQR() {
    const canvas = document.querySelector('#qrcode canvas');
    
    if (!canvas) {
        alert('QR Code not ready. Please try again.');
        return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `BJA-Booking-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success popup
    showSuccessPopup(
        'QR Code Downloaded',
        'Your booking QR code has been downloaded successfully!'
    );

    // Auto show confirmation after a brief moment
    setTimeout(() => {
        closeQRModal();
        showConfirmationPopup();
    }, 2000);
}

function showConfirmationPopup() {
    const html = `
        <div class="success-popup" id="confirmation-popup">
            <button class="success-popup-close" onclick="closeConfirmationPopup()">×</button>
            <div class="success-popup-content">
                <div class="success-popup-icon">✓</div>
                <div class="success-popup-text">
                    <h4>Order Confirmed!</h4>
                    <p><strong>Booking Reference:</strong> ${bookingData.fullName}</p>
                    <p><strong>Package:</strong> ${bookingData.package}</p>
                    <p><strong>Price:</strong> NPR ${bookingData.price.toLocaleString()}</p>
                    <p style="margin-top: 8px; font-size: 13px;">Check your email for booking details</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Auto-close after 8 seconds
    setTimeout(() => {
        closeConfirmationPopup();
    }, 8000);
}

function closeConfirmationPopup() {
    const popup = document.getElementById('confirmation-popup');
    if (popup) {
        popup.classList.add('hide');
        setTimeout(() => popup.remove(), 400);
    }
}

function showSuccessPopup(title, message) {
    const html = `
        <div class="success-popup" id="success-popup-${Date.now()}">
            <button class="success-popup-close" onclick="this.parentElement.remove()">×</button>
            <div class="success-popup-content">
                <div class="success-popup-icon">✓</div>
                <div class="success-popup-text">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const popup = document.getElementById('success-popup-' + Date.now());
        if (popup) {
            popup.classList.add('hide');
            setTimeout(() => popup.remove(), 400);
        }
    }, 5000);
}

// Close modals on background click
document.addEventListener('click', function(event) {
    const bookingModal = document.getElementById('booking-modal');
    const qrModal = document.getElementById('qr-modal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
    if (event.target === qrModal) {
        closeQRModal();
    }
});

// Close modals on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeBookingModal();
        closeQRModal();
    }
});

// Export booking data (for email integration)
function getBookingData() {
    return bookingData;
}

// Send booking email (requires backend endpoint)
async function sendBookingEmail() {
    try {
        const response = await fetch('/api/send-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            console.log('Booking email sent successfully');
        }
    } catch (error) {
        console.log('Email sending requires backend setup');
    }
}
