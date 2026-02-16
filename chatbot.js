// Chatbot Variables
let chatbotOpen = false;
const chatMessages = [];

// Initialize Chatbot
document.addEventListener('DOMContentLoaded', function() {
    const chatbotBtn = document.getElementById('chatbot-btn');
    const closeChatbot = document.getElementById('close-chatbot');
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chatbot-input');

    // Toggle chatbot window
    chatbotBtn.addEventListener('click', function() {
        toggleChatbot();
        // Show welcome message on first open
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer.children.length === 0) {
            setTimeout(() => {
                addMessageToChat('👋 **Hello!** I\'m Bijaya\'s AI Assistant. How can I help you today?\n\n**You can ask me about:**\n• Services & pricing\n• How to book\n• Portfolio & samples\n• Business tips\n• Contact information\n• And more!', 'bot');
            }, 300);
        }
    });
    closeChatbot.addEventListener('click', toggleChatbot);

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotBtn = document.getElementById('chatbot-btn');
    
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbotWindow.classList.remove('hidden');
        chatbotBtn.style.display = 'none';
        document.getElementById('chatbot-input').focus();
    } else {
        chatbotWindow.classList.add('hidden');
        chatbotBtn.style.display = 'flex';
    }
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addMessageToChat(message, 'user');
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    // Get bot response
    setTimeout(() => {
        const response = generateAIResponse(message);
        removeTypingIndicator();
        addMessageToChat(response, 'bot');
    }, 800);
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const p = document.createElement('p');
    // Support line breaks and formatting
    p.innerHTML = message
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
    
    messageDiv.appendChild(p);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store message
    chatMessages.push({ sender, text: message });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

// AI Response Generator - Professional Assistant
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Detect language
    const language = detectLanguage(message);
    
    // Service Information
    const services = {
        'video editing': {
            description: 'Professional editing for social media, ads, and news using DaVinci Resolve and Premiere Pro.',
            details: 'Our video editing service creates engaging content optimized for various platforms.', 
            tips: ['Clear, high-quality footage', 'Specific editing style preferences', 'Target platform dimensions']
        },
        'photography': {
            description: 'Capturing moments and telling stories through the lens with keen eye for lighting and composition.',
            details: 'Professional photography services for weddings, events, and commercial projects.',
            tips: ['Lighting requirements', 'Preferred style/mood', 'Post-processing preferences']
        },
        'graphic design': {
            description: 'Create visual elements such as logos, images, and illustrations. Design layouts with colors and typefaces.',
            details: 'We provide comprehensive graphic design solutions for branding and marketing.',
            tips: ['Brand guidelines', 'Target audience', 'Design preferences and style']
        },
        'social media boosting': {
            description: 'Amplifying the reach and visibility of posts, campaigns, and content on social platforms.',
            details: 'Strategies to grow your social media presence and engagement.',
            tips: ['Current follower count', 'Target audience demographics', 'Content type (reels, posts, stories)']
        },
        'job center': {
            description: 'A platform where job seekers get advice and access to job opportunities from employers.',
            details: 'Connect with employment opportunities and career guidance.',
            tips: ['Job type/industry', 'Experience level', 'Location preferences']
        },
        'ai video production': {
            description: 'AI-powered video production automating editing and generating dynamic visuals for faster content creation.',
            details: 'Leveraging artificial intelligence for innovative video production solutions.',
            tips: ['Video purpose/goal', 'Duration', 'Target audience']
        }
    };

    // GREETING MESSAGES
    if (message.match(/^(hello|hi|hey|namaste|namaskar|salam)/)) {
        const responses = {
            en: '👋 Hello! I\'m Bijaya\'s AI Assistant. How can I help you today? Feel free to ask about services, pricing, bookings, or anything else!',
            ne: '👋 नमस्ते! मैं बिजया को AI सहायक हूँ। आज मैं आपको कैसे मदद कर सकता हूँ? सेवाओं, मूल्य निर्धारण, बुकिंग या कुछ और के बारे में पूछने के लिए स्वतंत्र महसूस करें!'
        };
        return responses[language] || responses.en;
    }

    // ABOUT / WHO IS
    if (message.match(/^(about|who is|tell me about|कौन है|किसकी जानकारी)/)) {
        const responses = {
            en: '👤 Bijaya Bhandari is a premier creative professional specializing in:\n\n✅ Video Editing (DaVinci Resolve, Premiere Pro)\n✅ Professional Photography\n✅ Graphic Design & Branding\n✅ Social Media Marketing\n✅ AI-Powered Video Production\n✅ Career Counseling (Job Center)\n\nWith 2+ years of experience creating engaging content for businesses and individuals.',
            ne: '👤 बिजया भण्डारी निम्नलिखित में विशेषज्ञ हैं:\n\n✅ भिडियो संपादन\n✅ व्यावसायिक फोटोग्राफी\n✅ ग्राफिक डिजाइन\n✅ सामाजिक मीडिया मार्केटिंग\n✅ AI-संचालित भिडियो उत्पादन\n\n2+ वर्षों का अनुभव के साथ!'
        };
        return responses[language] || responses.en;
    }

    // HOW ARE YOU / PLEASANTRIES
    if (message.match(/how are you|कैसे हो|ठीक हो|मैं कैसा हूँ/)) {
        const responses = {
            en: "😊 I'm doing great, thanks for asking! I'm here and ready to help with any questions about Bijaya's services. What brings you here today?",
            ne: '😊 मैं बिल्कुल ठीक हूँ! मैं आपकी बिजया की सेवाओं के बारे में मदद करने के लिए तैयार हूँ। आज आप यहाँ कैसे मदद कर सकता हूँ?'
        };
        return responses[language] || responses.en;
    }

    // THANK YOU
    if (message.match(/thank|thanks|धन्यवाद|ढन्यबाद/)) {
        const responses = {
            en: "You're welcome! 😊 Is there anything else I can help you with?",
            ne: 'आपका स्वागत है! 😊 क्या मैं आपको और कुछ मदद कर सकता हूँ?'
        };
        return responses[language] || responses.en;
    }

    // SERVICES OVERVIEW
    if (message.match(/services|what do you|can you do|offerings|सेवाएं|क्या कर सकते/)) {
        const responses = {
            en: '🌟 Bijaya offers 6 professional services:\n\n1️⃣ **Video Editing** - Professional content creation\n2️⃣ **Photography** - Capturing beautiful moments\n3️⃣ **Graphic Design** - Visual branding solutions\n4️⃣ **Social Media Boosting** - Growth & engagement strategies\n5️⃣ **Job Center** - Career opportunities & guidance\n6️⃣ **AI Video Production** - AI-powered creative solutions\n\n💡 Ask about any service for details & pricing!',
            ne: '🌟 बिजया 6 पेशेवर सेवाएं प्रदान करते हैं:\n\n1️⃣ **भिडियो संपादन**\n2️⃣ **फोटोग्राफी**\n3️⃣ **ग्राफिक डिजाइन**\n4️⃣ **सामाजिक मीडिया बूस्टिंग**\n5️⃣ **नौकरी केंद्र**\n6️⃣ **AI भिडियो उत्पादन**\n\n💡 किसी भी सेवा के बारे में पूछें!'
        };
        return responses[language] || responses.en;
    }

    // VIDEO EDITING SPECIFIC
    if (message.match(/video edit|भिडियो|वीडियो|साङ्ख्यिक/)) {
        const responses = {
            en: `📹 **VIDEO EDITING SERVICE**\n\n${services['video editing'].description}\n\n**Packages:**\n• Basic Edit: NPR 1,500\n• Standard Edit: NPR 4,000\n• Advanced Edit: NPR 10,000\n• Premium Edit: NPR 25,000\n\n**Tips for best results:**\n${services['video editing'].tips.map(tip => '✓ ' + tip).join('\n')}\n\n🎬 Ready to start? Click "Book Services"!`,
            ne: '📹 **भिडियो संपादन सेवा**\n\nवेबसाइट पर बुकिंग अनुभाग देखें या संपर्क करें!'
        };
        return responses[language] || responses.en;
    }

    // PHOTOGRAPHY SPECIFIC
    if (message.match(/photog|तस्वीर|फोटो/)) {
        const responses = {
            en: `📸 **PHOTOGRAPHY SERVICE**\n\n${services['photography'].description}\n\n**Packages:**\n• Basic Session: NPR 1,500\n• Standard Session: NPR 3,000\n• Premium Session: NPR 7,000\n• Luxury Package: NPR 15,000\n\n**Perfect for:** Weddings, events, portraits, commercial shoots\n\n📅 Schedule a session today!`,
            ne: '📸 **फोटोग्राफी सेवा**\n\nशादी, event, पोर्ट्रेट के लिए पूर्ण पेशेवर सेवा'
        };
        return responses[language] || responses.en;
    }

    // GRAPHIC DESIGN SPECIFIC
    if (message.match(/graphic|design|логотип|लोगो|डिजाइन/)) {
        const responses = {
            en: `🎨 **GRAPHIC DESIGN SERVICE**\n\n${services['graphic design'].description}\n\n**Packages:**\n• Single Logo: NPR 1,000\n• Branding Package: NPR 5,000\n• Full Design Suite: NPR 12,000\n• Custom Design: NPR 20,000+\n\n**Specialties:** Logos, branding, social media graphics, marketing materials\n\n🎯 Elevate your brand!`,
            ne: '🎨 **ग्राफिक डिजाइन सेवा**\n\nलोगो, ब्र्रांडिंग, सामाजिक मीडिया ग्राफिक्स'
        };
        return responses[language] || responses.en;
    }

    // SOCIAL MEDIA BOOSTING
    if (message.match(/social media|boost|growth|रोचक|बढ़ाएं|फेसबुक/)) {
        const responses = {
            en: `📱 **SOCIAL MEDIA BOOSTING SERVICE**\n\n${services['social media boosting'].description}\n\n**Packages:**\n• 1 Week Campaign: NPR 2,000\n• 1 Month Campaign: NPR 5,000\n• 3 Month Campaign: NPR 12,000\n• Custom Package: Contact us\n\n**Strategies include:**\n✓ Content optimization\n✓ Engagement growth\n✓ Audience targeting\n✓ Performance tracking\n\n📊 Grow your presence!`,
            ne: '📱 **सामाजिक मीडिया बूस्टिंग**\n\nआपके फॉलोअर्स और एनगेजमेंट बढ़ाएं!'
        };
        return responses[language] || responses.en;
    }

    // JOB CENTER
    if (message.match(/job|career|employment|नौकरी|कैरियर|रोजगार/)) {
        const responses = {
            en: `💼 **JOB CENTER SERVICE**\n\n${services['job center'].description}\n\n**Packages:**\n• Job Posting: NPR 500\n• Featured Listing: NPR 1,500\n• Premium Package: NPR 5,000\n• Corporate Package: NPR 15,000\n\n**Benefits:**\n✓ Job seekers meet employers\n✓ Career guidance provided\n✓ Wide reach network\n✓ Professional support\n\n🚀 Find your next opportunity!`,
            ne: '💼 **नौकरी केंद्र**\n\nरोजगार के अवसर और कैरियर मार्गदर्शन'
        };
        return responses[language] || responses.en;
    }

    // AI VIDEO PRODUCTION
    if (message.match(/ai video|artificial|ai|avatar|script/)) {
        const responses = {
            en: `🤖 **AI VIDEO PRODUCTION SERVICE**\n\n${services['ai video production'].description}\n\n**Packages:**\n• Basic AI Video: NPR 3,000\n• Standard AI Video: NPR 8,000\n• Advanced AI Video: NPR 15,000\n• Enterprise Package: NPR 30,000+\n\n**Features:**\n✓ AI Avatar creation\n✓ Auto-script generation\n✓ Dynamic visuals\n✓ Fast turnaround\n\n⚡ Create faster with AI!`,
            ne: '🤖 **AI भिडियो उत्पादन**\n\nकृत्रिम बुद्धिमत्ता के साथ तेजी से सामग्री बनाएं!'
        };
        return responses[language] || responses.en;
    }

    // PRICING QUESTIONS
    if (message.match(/price|cost|rate|much|charge|किमत|कितना|दर/)) {
        const responses = {
            en: '💰 **Pricing varies by service and project scope:**\n\n📊 Quick price ranges:\n• Video Editing: 1,500 - 25,000\n• Photography: 1,500 - 15,000\n• Graphic Design: 1,000 - 20,000\n• Social Media: 2,000 - 15,000\n• Job Center: 500 - 15,000\n• AI Video: 3,000 - 30,000+\n\n💡 Custom quotes available! Ask about a specific service for details.',
            ne: '💰 मूल्य प्रत्येक सेवा के अनुसार अलग है। अधिक जानकारी के लिए सेवा के बारे में पूछें!'
        };
        return responses[language] || responses.en;
    }

    // BOOKING / PROJECT INQUIRY
    if (message.match(/book|project|inquiry|hire|engage|बुक|परियोजना|काम/)) {
        const responses = {
            en: '📋 **How to Book a Service:**\n\n**Option 1:** Click "Book Services" button on the homepage\n**Option 2:** Email: bijayabhandari515@gmail.com\n**Option 3:** WhatsApp: +977 9824168577\n**Option 4:** Use the contact form at the bottom of website\n\n⏱️ What details to prepare:\n✓ Service type\n✓ Project scope\n✓ Timeline/deadline\n✓ Budget (optional)\n\n🚀 Let\'s start!',
            ne: '📋 **बुकिंग कैसे करें:**\n\n"Book Services" बटन पर क्लिक करें या संपर्क करें!'
        };
        return responses[language] || responses.en;
    }

    // CONTACT INFORMATION
    if (message.match(/contact|phone|email|पता|संपर्क|फोन/)) {
        const responses = {
            en: '📞 **CONTACT INFORMATION:**\n\n📧 Email: bijayabhandari515@gmail.com\n📱 WhatsApp: +977 9824168577\n☎️ Phone: +977 9824168577\n📍 Location: Pokhara, Birauta, Nepal\n🌐 Website: Available on homepage footer\n\n⏰ Response time: Usually within 24 hours\n\n💬 I\'m also here in chat to help!',
            ne: '📞 **संपर्क जानकारी:**\n\n📧 ईमेल: bijayabhandari515@gmail.com\n📱 व्हाट्सएप: +977 9824168577'
        };
        return responses[language] || responses.en;
    }

    // PORTFOLIO / SAMPLES
    if (message.match(/portfolio|sample|examples|gallery|work|उदाहरण/)) {
        const responses = {
            en: '🖼️ **VIEW PORTFOLIO:**\n\n✓ Check "My Services Gallery" section on homepage\n✓ Each service page has dedicated portfolio samples\n✓ Real client examples and testimonials\n✓ Before/after comparisons\n✓ Video samples for editing/production work\n\n💡 Visit the website to see stunning examples of Bijaya\'s work!',
            ne: '🖼️ **होमपेज पर "My Services Gallery" देखें**\n\nहर सेवा और परियोजना के उदाहरण उपलब्ध हैं!'
        };
        return responses[language] || responses.en;
    }

    // BUSINESS/MARKETING ADVICE
    if (message.match(/advice|tips|strategy|marketing|grow|business|सलाह|टिप्स|व्यापार/)) {
        const responses = {
            en: '💡 **BUSINESS & MARKETING TIPS:**\n\n**Video Content Strategy:**\n• Post consistently (2-3x weekly)\n• Keep videos under 60 seconds for social media\n• Use hooks in first 3 seconds\n• Include clear call-to-action\n\n**Social Media Growth:**\n• Engage with your audience\'s content\n• Use trending hashtags (5-10 per post)\n• Post at peak engagement times\n• Collaborate with other creators\n\n**Visual Branding:**\n• Maintain consistent color palette\n• Use same fonts across platforms\n• Quality over quantity\n• Show your brand\'s personality\n\n\n📊 Need a customized strategy? Contact Bijaya!',
            ne: '💡 **मार्केटिंग सलाह:**\n\n• नियमित रूप से पोस्ट करें\n• सोशल मीडिया पर engaging कंटेंट बनाएं\n• अपने दर्शकों के साथ जुड़ें'
        };
        return responses[language] || responses.en;
    }

    // TECHNICAL HELP / PROBLEMS
    if (message.match(/problem|issue|not working|error|bug|help|मदद|समस्या/)) {
        const responses = {
            en: '⚠️ **Technical Support:**\n\nCan you provide more details about the issue?\n\n☑️ Try these steps:\n1. Refresh your browser (Ctrl+R or ⌘+R)\n2. Clear browser cache\n3. Try a different browser\n4. Check internet connection\n\nIf the issue persists:\n📧 Email: bijayabhandari515@gmail.com\n📱 WhatsApp: +977 9824168577\n\n🔧 Our team will assist quickly!',
            ne: '⚠️ **तकनीकी सहायता:**\n\nअधिक विवरण साझा करें तो मैं बेहतर मदद कर सकता हूँ!'
        };
        return responses[language] || responses.en;
    }

    // TIMELINE / DELIVERY
    if (message.match(/how long|timeline|delivery|deadline|rush|fast|कितना समय|डिलीवरी/)) {
        const responses = {
            en: '⏱️ **TURNAROUND TIMES:**\n\n**Standard Timeline:**\n• Video Editing: 3-7 days\n• Photography: 5-10 days (including editing)\n• Graphic Design: 3-5 days\n• Social Media Boosting: 3-30 days\n• AI Video: 2-4 days\n\n⚡ **Express Options Available:**\n• 24-hour rush (+50% cost)\n• 12-hour express (+100% cost)\n\n💬 Contact directly to discuss your timeline!',
            ne: '⏱️ **डिलीवरी समय साधारणतः:**\n\n• भिडियो संपादन: 3-7 दिन\n• फोटोग्राफी: 5-10 दिन\n\n🚀 तेजी से चाहिए? संपर्क करें!'
        };
        return responses[language] || responses.en;
    }

    // CLARIFICATION NEEDED
    if (message.length > 0) {
        const responses = {
            en: '🤔 I\'m not entirely sure about your question. Could you clarify?\n\n**You can ask me about:**\n✅ Services offered\n✅ Pricing & packages\n✅ How to book\n✅ Portfolio/samples\n✅ Contact information\n✅ Business marketing tips\n✅ Technical issues\n✅ Timeline/delivery\n\n💬 Please rephrase your question or pick one of the above!',
            ne: '🤔 मुझे आपके सवाल को समझने में थोड़ी कठिनाई हुई। क्या आप स्पष्ट कर सकते हैं?\n\n📋 आप मुझसे पूछ सकते हैं:\n✅ सेवाएं\n✅ मूल्य निर्धारण\n✅ बुकिंग\n✅ संपर्क\n✅ और अधिक!'
        };
        return responses[language] || responses.en;
    }

    // DEFAULT FALLBACK
    const responses = {
        en: "Hi there! 👋 How can I help? Feel free to ask about services, pricing, or anything else!",
        ne: 'नमस्ते! 👋 मैं कैसे मदद कर सकता हूँ?'
    };
    return responses[language] || responses.en;
}

// Language Detection Function
function detectLanguage(text) {
    // Common Nepali unicode characters
    const nepaliPattern = /[\u0900-\u097F]/g;
    const nepaliMatches = text.match(nepaliPattern) || [];
    
    // If more than 20% of characters are Nepali, detect as Nepali
    if (nepaliMatches.length > text.length * 0.15) {
        return 'ne';
    }
    
    return 'en'; // Default to English
}
}

// Optional: When API key is available, upgrade to real AI
// Uncomment and replace with your actual API configuration
/*
async function generateAIResponseWithAPI(userMessage) {
    try {
        // This example uses a free hugging face API
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            headers: { Authorization: `Bearer YOUR_HF_API_KEY` },
            method: "POST",
            body: JSON.stringify({ inputs: userMessage }),
        });
        const result = await response.json();
        return result[0].generated_text;
    } catch (error) {
        console.log("API call failed, using fallback response");
        return generateAIResponse(userMessage);
    }
}
*/
