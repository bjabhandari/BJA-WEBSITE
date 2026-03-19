// Enhanced Booking System with Multi-Step Form, Video Upload, and WhatsApp Integration

// Service packages and pricing
const servicePackages = {
    'Video Editing': [
        { name: 'Basic Edit', price: 1500 },
        { name: 'Standard Edit', price: 4000 },
        { name: 'Advanced Edit', price: 10000 },
        { name: 'Premium Edit', price: 25000 }
    ],
    'Photography': [
        { name: 'Basic Session', price: 1500 },
        { name: 'Standard Session', price: 3000 },
        { name: 'Premium Session', price: 7000 },
        { name: 'Luxury Package', price: 15000 }
    ],
    'Graphic Design': [
        { name: 'Single Logo', price: 1000 },
        { name: 'Branding Package', price: 5000 },
        { name: 'Full Design Suite', price: 12000 },
        { name: 'Custom Design', price: 20000 }
    ],
    'Social Media Boosting': [
        { name: '1 Week Campaign', price: 2000 },
        { name: '1 Month Campaign', price: 5000 },
        { name: '3 Month Campaign', price: 12000 },
        { name: 'Custom Package', price: 15000 }
    ],
    'Job Center': [
        { name: 'Job Posting', price: 500 },
        { name: 'Featured Listing', price: 1500 },
        { name: 'Premium Package', price: 5000 },
        { name: 'Corporate Package', price: 15000 }
    ],
    'AI Video Production': [
        { name: 'Basic AI Video', price: 3000 },
        { name: 'Standard AI Video', price: 8000 },
        { name: 'Advanced AI Video', price: 15000 },
        { name: 'Enterprise Package', price: 30000 }
    ]
};

// Booking System Variables
let currentStep = 1;
let currentService = '';
let currentPackage = '';
let currentPrice = 0;
let uploadedFiles = [];
let bookingData = {};

// Initialize Booking System
document.addEventListener('DOMContentLoaded', function() {
    setupBookingButtons();
    setupFileUpload();
    const globalBookBtn = document.getElementById('book-services-btn');
    if (globalBookBtn) globalBookBtn.addEventListener('click', openGenericBookingModal);
    const navBookBtn = document.getElementById('nav-book-btn');
    if (navBookBtn) navBookBtn.addEventListener('click', openGenericBookingModal);
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

function setupFileUpload() {
    const uploadArea = document.getElementById('file-upload-area');
    if (!uploadArea) return;

    uploadArea.addEventListener('click', () => {
        const input = uploadArea.querySelector('input[type="file"]');
        if (input) input.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(255, 60, 0, 0.15)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = 'rgba(255, 60, 0, 0.05)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(255, 60, 0, 0.05)';
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    const fileInput = uploadArea.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
}

function handleFiles(files) {
    const fileList = document.getElementById('file-list');
    if (!fileList) return;

    uploadedFiles = Array.from(files);
    fileList.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const icon = getFileIcon(file.type);

        fileItem.innerHTML = `
            <div class="file-item-name">
                <span class="file-item-icon">${icon}</span>
                <span>${file.name} (${fileSize}MB)</span>
            </div>
            <button type="button" class="file-item-remove" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        fileList.appendChild(fileItem);
    });
}

function getFileIcon(fileType) {
    if (fileType.startsWith('video')) return '🎥';
    if (fileType.startsWith('image')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    return '📎';
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    handleFiles(uploadedFiles);
}

function openBookingModal(packageName, price, features) {
    currentPackage = packageName;
    currentPrice = parseFloat(price);
    currentService = getCurrentServiceFromPackage(packageName);
    
    const modal = document.getElementById('booking-modal');
    const form = document.getElementById('booking-form');
    
    // Update modal title
    document.getElementById('booking-package-title').textContent = packageName;
    
    // Update summary
    document.getElementById('booking-package-name').textContent = packageName;
    document.getElementById('booking-total-price').textContent = `NPR ${currentPrice.toLocaleString()}`;
    
    // Reset form
    currentStep = 1;
    uploadedFiles = [];
    form.reset();
    showBookingStep(1);
    updateProgressIndicator(1);
    
    // Show modal
    modal.classList.add('show');
}

function openGenericBookingModal() {
    const modal = document.getElementById('booking-modal');
    const form = document.getElementById('booking-form');
    
    if (!modal || !form) {
        alert('Booking modal not found. Please try again on a service page.');
        return;
    }
    
    currentStep = 1;
    uploadedFiles = [];
    bookingData = {};
    form.reset();
    
    showBookingStep(1);
    updateProgressIndicator(1);
    
    // Reset summary
    document.getElementById('booking-package-name').textContent = 'Select a service';
    document.getElementById('booking-total-price').textContent = 'NPR -';
    
    modal.classList.add('show');
}

function updateServiceOptions() {
    const serviceType = document.getElementById('serviceType').value;
    const packageSelect = document.getElementById('packageOption');
    
    packageSelect.innerHTML = '<option value="">-- Choose a Package --</option>';
    
    if (serviceType && servicePackages[serviceType]) {
        servicePackages[serviceType].forEach(pkg => {
            const option = document.createElement('option');
            option.value = pkg.name;
            option.textContent = `${pkg.name} - NPR ${pkg.price.toLocaleString()}`;
            packageSelect.appendChild(option);
        });
    }
}

function updatePackagePrice() {
    const serviceType = document.getElementById('serviceType').value;
    const packageName = document.getElementById('packageOption').value;
    
    if (serviceType && packageName && servicePackages[serviceType]) {
        const pkg = servicePackages[serviceType].find(p => p.name === packageName);
        if (pkg) {
            currentService = serviceType;
            currentPackage = packageName;
            currentPrice = pkg.price;
            
            document.getElementById('booking-package-name').textContent = `${serviceType} - ${packageName}`;
            document.getElementById('booking-total-price').textContent = `NPR ${currentPrice.toLocaleString()}`;
        }
    }
}

function nextBookingStep() {
    if (currentStep === 1) {
        // Validate step 1
        const serviceType = document.getElementById('serviceType').value;
        const packageOption = document.getElementById('packageOption').value;
        
        if (!serviceType || !packageOption) {
            alert('Please select both service type and package');
            return;
        }
        currentStep = 2;
    } else if (currentStep === 2) {
        // Validate step 2
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const whatsapp = document.getElementById('whatsapp').value.trim();
        
        if (!fullName || !email || !phone || !whatsapp) {
            alert('Please fill in all required contact fields');
            return;
        }
        
        // Update review section
        updateReviewSection();
        currentStep = 3;
    }
    
    showBookingStep(currentStep);
    updateProgressIndicator(currentStep);
}

function prevBookingStep() {
    if (currentStep > 1) {
        currentStep--;
        showBookingStep(currentStep);
        updateProgressIndicator(currentStep);
    }
}

function showBookingStep(step) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show current step
    const stepElement = document.getElementById(`booking-step-${step}`);
    if (stepElement) {
        stepElement.classList.add('active');
    }
}

function updateProgressIndicator(step) {
    for (let i = 1; i <= 3; i++) {
        const stepElement = document.getElementById(`progress-step-${i}`);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');
            if (i < step) {
                stepElement.classList.add('completed');
            } else if (i === step) {
                stepElement.classList.add('active');
            }
        }
    }
}

function updateReviewSection() {
    const serviceType = document.getElementById('serviceType').value;
    const packageName = document.getElementById('packageOption').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const whatsapp = document.getElementById('whatsapp').value;
    
    document.getElementById('review-service').textContent = serviceType;
    document.getElementById('review-package').textContent = packageName;
    document.getElementById('review-price').textContent = `NPR ${currentPrice.toLocaleString()}`;
    document.getElementById('review-name').textContent = fullName;
    document.getElementById('review-email').textContent = email;
    document.getElementById('review-phone').textContent = phone;
    document.getElementById('review-whatsapp').textContent = whatsapp;
    
    const filesHtml = uploadedFiles.length > 0 
        ? uploadedFiles.map(f => `<div style="margin: 5px 0;">✓ ${f.name}</div>`).join('')
        : '<em>No files uploaded</em>';
    document.getElementById('review-files').innerHTML = filesHtml;
}

function getCurrentServiceFromPackage(packageName) {
    for (const [service, packages] of Object.entries(servicePackages)) {
        if (packages.some(p => p.name === packageName)) {
            return service;
        }
    }
    return '';
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('show');
    currentStep = 1;
    uploadedFiles = [];
}

function submitBooking() {
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!agreeTerms) {
        alert('Please agree to the terms before proceeding');
        return;
    }

    // Collect booking data
    bookingData = {
        service: document.getElementById('serviceType').value,
        package: document.getElementById('packageOption').value,
        price: currentPrice,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        whatsapp: document.getElementById('whatsapp').value,
        projectDesc: document.getElementById('projectDesc').value,
        deadline: document.getElementById('deadline').value,
        date: new Date().toLocaleDateString(),
        filesCount: uploadedFiles.length
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
    
    // Create payment details with WhatsApp
    const paymentDetails = `Service: ${bookingData.service}|Package: ${bookingData.package}|Name: ${bookingData.fullName}|WhatsApp: ${bookingData.whatsapp}|Email: ${bookingData.email}|Price: NPR ${bookingData.price}|Ref: ${bookingRef}`;
    
    // Generate QR Code
    try {
        if (typeof QRCode !== 'undefined' && typeof QRCode.toCanvas === 'function') {
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
        } else if (typeof QRCode === 'function') {
            // qrcode.js (davidshimjs) style
            new QRCode(qrcodeContainer, {
                text: paymentDetails,
                width: 300,
                height: 300,
                colorDark: '#ff3c00',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        } else {
            console.error('No compatible QRCode library found.');
            qrcodeContainer.textContent = 'QR generation not available.';
        }
    } catch (e) {
        console.error('QR generation failed', e);
        qrcodeContainer.textContent = 'QR generation failed.';
    }

    // Update QR info
    document.getElementById('booking-ref').textContent = bookingRef;
    document.getElementById('customer-name').textContent = bookingData.fullName;
    document.getElementById('package-name').textContent = `${bookingData.service} - ${bookingData.package}`;
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
    
    showSuccessPopup('QR Code Downloaded', 'Your booking QR code has been downloaded successfully!');

    setTimeout(() => {
        closeQRModal();
        showConfirmationPopup();
    }, 2000);
}

function sendToWhatsApp() {
    const whatsappNumber = bookingData.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
        `Hello ${bookingData.fullName},\n\n` +
        `Your booking details:\n` +
        `📌 Service: ${bookingData.service}\n` +
        `📦 Package: ${bookingData.package}\n` +
        `💰 Price: NPR ${bookingData.price.toLocaleString()}\n` +
        `📅 Date: ${bookingData.date}\n\n` +
        `Please scan the QR code we'll send to complete your payment. Thank you!`
    );
    
    // Open WhatsApp with message
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    showSuccessPopup('WhatsApp Opened', 'Send the booking details to your WhatsApp!');
}

function showConfirmationPopup() {
    const html = `
        <div class="success-popup" id="confirmation-popup">
            <button class="success-popup-close" onclick="closeConfirmationPopup()">×</button>
            <div class="success-popup-content">
                <div class="success-popup-icon">✓</div>
                <div class="success-popup-text">
                    <h4>Booking Confirmed!</h4>
                    <p><strong>Service:</strong> ${bookingData.service}</p>
                    <p><strong>Package:</strong> ${bookingData.package}</p>
                    <p><strong>Price:</strong> NPR ${bookingData.price.toLocaleString()}</p>
                    <p style="margin-top: 8px; font-size: 13px;">Check your email and WhatsApp for booking details</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
    
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
    
    setTimeout(() => {
        const popup = document.querySelector('.success-popup');
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

// Export booking data
function getBookingData() {
    return bookingData;
}
