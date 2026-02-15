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
    chatbotBtn.addEventListener('click', toggleChatbot);
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
    p.textContent = message;
    
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

// AI Response Generator - Enhanced with Website Knowledge
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Service Information
    const services = {
        'video editing': {
            description: 'Professional editing for social media, ads, and news using DaVinci Resolve and Premiere Pro.',
            details: 'Our video editing service creates engaging content optimized for various platforms.'
        },
        'photography': {
            description: 'Capturing moments and telling stories through the lens with keen eye for lighting and composition.',
            details: 'Professional photography services for weddings, events, and commercial projects.'
        },
        'graphic design': {
            description: 'Create visual elements such as logos, images, and illustrations. Design layouts with selection of colors and typefaces.',
            details: 'We provide comprehensive graphic design solutions for branding and marketing.'
        },
        'social media boosting': {
            description: 'Amplifying the reach and visibility of posts, campaigns, and content on social platforms.',
            details: 'Strategies to grow your social media presence and engagement.'
        },
        'job center': {
            description: 'A platform where job seekers get advice and access to job opportunities from employers.',
            details: 'Connect with employment opportunities and career guidance.'
        },
        'ai video production': {
            description: 'AI-powered video production automating editing and generating dynamic visuals for faster, more accessible content creation.',
            details: 'Leveraging artificial intelligence for innovative video production solutions.'
        }
    };

    // Greeting and basic questions
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return '👋 Hello! How can I help you today? Feel free to ask about my services, pricing, or anything else!';
    }

    if (message.includes('how are you') || message.includes('how do you do')) {
        return "I'm doing great! Thanks for asking! 😊 How can I assist you with any of Bijaya's services?";
    }

    if (message.includes('thank') || message.includes('thanks')) {
        return "You're welcome! 😊 Is there anything else I can help you with?";
    }

    // Service enquiries
    if (message.includes('video editing')) {
        return `📹 ${services['video editing'].description}\n\n${services['video editing'].details}\n\nVisit our Video Editing page for pricing and samples!`;
    }

    if (message.includes('photography')) {
        return `📸 ${services['photography'].description}\n\n${services['photography'].details}\n\nCheck our Photography page for more information!`;
    }

    if (message.includes('graphic design') || message.includes('graphics')) {
        return `🎨 ${services['graphic design'].description}\n\n${services['graphic design'].details}\n\nVisit our Graphic Design page for portfolio!`;
    }

    if (message.includes('social media')) {
        return `📱 ${services['social media boosting'].description}\n\n${services['social media boosting'].details}\n\nLearn more on our Social Media Boosting page!`;
    }

    if (message.includes('job center') || message.includes('job centre')) {
        return `💼 ${services['job center'].description}\n\n${services['job center'].details}\n\nExplore opportunities on our Job Center page!`;
    }

    if (message.includes('ai video') || message.includes('artificial intelligence')) {
        return `🤖 ${services['ai video production'].description}\n\n${services['ai video production'].details}\n\nDiscover AI Video Production capabilities!`;
    }

    // Pricing questions
    if (message.includes('price') || message.includes('cost') || message.includes('how much') || message.includes('pricing')) {
        return "💰 Great question! Pricing varies based on the service and project scope. Each service page has detailed pricing information. Would you like to know about a specific service?";
    }

    // Contact information
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
        return "📞 You can reach Bijaya at:\n📧 Email: bijayabhandari515@gmail.com\n📱 Phone: +977 9824168577\n📍 Location: Pokhara, Birauta, Nepal\n\nYou can also find contact info at the bottom of our website!";
    }

    // Services overview
    if (message.includes('what do you do') || message.includes('what services') || message.includes('services')) {
        return "🌟 Bijaya offers six main services:\n\n1️⃣ Video Editing - Professional content creation\n2️⃣ Photography - Capturing beautiful moments\n3️⃣ Graphic Design - Visual branding solutions\n4️⃣ Social Media Boosting - Content amplification\n5️⃣ Job Center - Career opportunities\n6️⃣ AI Video Production - AI-powered video creation\n\nWhich service interests you?";
    }

    // Help and support
    if (message.includes('help') || message.includes('support')) {
        return "🆘 I'm here to help! You can ask me about:\n• Services offered\n• Pricing & packages\n• How to contact Bijaya\n• Details about specific services\n• Website navigation\n\nWhat would you like to know?";
    }

    // Website navigation
    if (message.includes('portfolio') || message.includes('gallery')) {
        return "🖼️ You can view the complete portfolio in the 'My Services Gallery' section on our homepage. Each service has a dedicated page with samples and detailed information!";
    }

    if (message.includes('about') || message.includes('who is')) {
        return "👤 Bijaya Bhandari is a premier editor and content creator specializing in video editing, photography, graphic design, and AI-powered content creation. With expertise in industry-standard tools like DaVinci Resolve and Premiere Pro, Bijaya delivers high-quality creative solutions for businesses and individuals.";
    }

    // Problem/Issue resolution
    if (message.includes('problem') || message.includes('issue') || message.includes('not working') || message.includes('bug')) {
        return "⚠️ Sorry to hear you're experiencing an issue! Please describe the problem in detail, and I'll try to help. You can also contact Bijaya directly at bijayabhandari515@gmail.com for technical support.";
    }

    // Location
    if (message.includes('where') || message.includes('location')) {
        return "📍 Bijaya is located in Pokhara, Birauta, Nepal. While based in Nepal, services are available online for clients worldwide!";
    }

    // Social media
    if (message.includes('facebook') || message.includes('instagram') || message.includes('linkedin') || message.includes('twitter')) {
        return "📲 Follow Bijaya on social media:\n🔵 Facebook: facebook.com/bijaya.bhandari.9404\n📷 Instagram: @bijaya.bhandari.9404\n💼 LinkedIn: linkedin.com/in/bijaya-bhandari/\n\nStay updated with the latest work and announcements!";
    }

    // When can you start
    if (message.includes('when') && (message.includes('start') || message.includes('available') || message.includes('book'))) {
        return "📅 Availability depends on the current project load. Contact Bijaya at bijayabhandari515@gmail.com or use the contact form to discuss your project timeline and availability!";
    }

    // Why choose
    if (message.includes('why') || message.includes('unique') || message.includes('advantage')) {
        return "⭐ Why choose Bijaya's services?\n✅ Professional expertise in multiple creative fields\n✅ Industry-standard tools and techniques\n✅ Quick turnaround times\n✅ High-quality, customized solutions\n✅ Client-focused approach\n✅ Competitive pricing\n\nReady to start a project?";
    }

    // Booking/Inquiry
    if (message.includes('book') || message.includes('project') || message.includes('inquiry')) {
        return "📋 To book a service or inquire about a project:\n1. Click 'Request a Booking' on the homepage, OR\n2. Email: bijayabhandari515@gmail.com\n3. Call: +977 9824168577\n\nBelow the services section, you'll find a detailed contact form!";
    }

    // Default response
    return "😊 That's an interesting question! I might not have all the specific details, but feel free to ask me about:\n• Our services (video editing, photography, graphic design, social media, job center, AI video)\n• Pricing information\n• How to contact Bijaya\n• Portfolio and samples\n\nWhat else would you like to know?";
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
