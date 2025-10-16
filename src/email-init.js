import emailjs from '@emailjs/browser';

// Initialize EmailJS client with your public key
emailjs.init('WmiOu2pgdWsAGhtEQ');

// Expose emailjs globally so non-module scripts can use it
window.emailjs = emailjs;

// export emailjs so module users can import it if needed
export default emailjs;
