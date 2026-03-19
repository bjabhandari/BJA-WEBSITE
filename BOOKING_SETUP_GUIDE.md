# Booking System Setup Guide for Details Pages

This guide explains how to add the booking functionality to all details pages.

## Files Required
- `booking.css` - Stylesheet for booking modals and QR codes
- `booking.js` - JavaScript for booking logic and QR code generation
- `QRCode.js` - CDN library for QR code generation (included via CDN)

## Steps to Add Booking to a Details Page

### 1. Add CSS and JS Links to <head>
Add these lines in the `<head>` section (after the Font Awesome link):

```html
<link rel="stylesheet" href="../../booking.css">
<!-- QRCode Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode.js/1.5.3/qrcode.min.js"></script>
```

### 2. Update Price Cards
Replace the "Get Started" buttons on each pricing card with "Book Now" buttons:

**OLD:**
```html
<a href="process-upload.html" class="btn-primary text-white px-8 py-3 rounded-lg w-full inline-block text-center">Get Started</a>
```

**NEW:**
```html
<button class="btn-book-now" 
    data-book-package="[PACKAGE_NAME]" 
    data-book-price="[PRICE]" 
    data-book-features="[FEATURES]">Book Now</button>
<a href="process-upload.html" class="btn-primary text-white px-8 py-3 rounded-lg w-full inline-block text-center mt-3">Learn More</a>
```

Example:
```html
<button class="btn-book-now" 
    data-book-package="Basic Photography" 
    data-book-price="2000" 
    data-book-features="Portrait session, basic editing, digital copies">Book Now</button>
```

### 3. Add Modals Before Closing </body> Tag
Add the booking modal, QR modal, and script link:

```html
<!-- Booking Modal -->
<div id="booking-modal" class="booking-modal">
    <div class="booking-modal-content">
        <button class="booking-close" onclick="closeBookingModal()">&times;</button>
        <h2>Book <span id="booking-package-title">Service</span></h2>
        
        <div class="booking-summary">
            <div class="booking-summary-item">
                <span>Service Package:</span>
                <span id="booking-package-name">-</span>
            </div>
            <div class="booking-summary-item">
                <span>Total Price:</span>
                <span id="booking-total-price">-</span>
            </div>
        </div>

        <form id="booking-form" onsubmit="submitBooking(); return false;">
            <div class="booking-form-group">
                <label for="fullName">Full Name *</label>
                <input type="text" id="fullName" name="fullName" required>
            </div>

            <div class="booking-form-row">
                <div class="booking-form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="booking-form-group">
                    <label for="phone">Phone Number *</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
            </div>

            <div class="booking-form-group">
                <label for="projectDesc">Project Description</label>
                <textarea id="projectDesc" name="projectDesc" rows="4" placeholder="Tell us about your project..."></textarea>
            </div>

            <div class="booking-form-group">
                <label for="deadline">Project Deadline</label>
                <input type="date" id="deadline" name="deadline">
            </div>

            <button type="submit" class="btn-book-order">Proceed to Payment (Generate QR)</button>
        </form>
    </div>
</div>

<!-- QR Code Modal -->
<div id="qr-modal" class="qr-modal">
    <div class="qr-modal-content">
        <button class="booking-close" onclick="closeQRModal()">&times;</button>
        <h2>Your Booking QR Code</h2>
        <p>Scan this QR code to complete your payment</p>

        <div class="qr-container">
            <div id="qrcode"></div>
        </div>

        <div class="qr-info">
            <h4>Booking Details</h4>
            <p><strong>Booking Reference:</strong> <span id="booking-ref">-</span></p>
            <p><strong>Client Name:</strong> <span id="customer-name">-</span></p>
            <p><strong>Package:</strong> <span id="package-name">-</span></p>
            <p><strong>Amount:</strong> <span id="booking-price">-</span></p>
        </div>

        <div class="qr-actions">
            <button class="btn-download-qr" onclick="downloadQR()">
                <i class="fas fa-download"></i> Download QR Code
            </button>
            <button class="btn-close-qr" onclick="closeQRModal()">Close</button>
        </div>
    </div>
</div>

<!-- Booking Script -->
<script src="../../booking.js"></script>
```

## Service-Specific Package Examples

### Video Editing
- Basic Edit - NPR 1,500
- Standard Edit - NPR 4,000
- Advanced Edit - NPR 10,000
- Premium Edit - NPR 25,000

### Photography
- Basic Session - NPR 1,500
- Standard Session - NPR 3,000
- Premium Session - NPR 7,000
- Luxury Package - NPR 15,000

### Graphics Design
- Single Logo - NPR 1,000
- Branding Package - NPR 5,000
- Full Design Suite - NPR 12,000
- Custom Design - NPR 20,000

### Social Media Boosting
- 1 Week Campaign - NPR 2,000
- 1 Month Campaign - NPR 5,000
- 3 Month Campaign - NPR 12,000
- Custom Package - NPR Custom

### Job Center
- Job Posting - NPR 500
- Featured Listing - NPR 1,500
- Premium Package - NPR 5,000
- Corporate Package - NPR 15,000

### AI Video Production
- Basic AI Video - NPR 3,000
- Standard AI Video - NPR 8,000
- Advanced AI Video - NPR 15,000
- Enterprise Package - NPR 30,000

## Booking Flow

1. **User clicks "Book Now"** → Booking form opens
2. **Fill in details** → Name, email, phone, project info, deadline
3. **Submit form** → Generates unique booking reference
4. **QR Code appears** → Customer scans to see payment details
5. **Download QR** → Customer can save the QR code
6. **Done popup** → Confirmation with order details

## Features Included

✅ Dynamic booking form
✅ Real-time price calculation
✅ QR code generation with booking details
✅ QR code download functionality
✅ Order confirmation popup
✅ Responsive design (mobile-friendly)
✅ Email capture for follow-up
✅ Project deadline tracking
✅ Easy modal close (ESC key, background click)

## Customization

You can customize:
- Package names and prices (in data attributes)
- Form fields (add/remove in HTML)
- QR code colors (in booking.js)
- Success messages (in booking.js)
- Email templates (requires backend setup)

## Backend Integration (Optional)

To send emails automatically:

1. Create an endpoint: `/api/send-booking`
2. It will receive JSON with booking data
3. Send confirmation email to customer
4. Send notification to business

The `sendBookingEmail()` function is ready to use when backend is available.
