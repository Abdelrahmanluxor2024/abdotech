// ==================== TRANSLATIONS ====================
const translations = {
    en: {
        // Navigation
        nav: {
            home: "Home",
            about: "About",
            expertise: "Expertise",
            portfolio: "Portfolio",
            videos: "Videos",
            contact: "Contact",
            login: "Create Account",
            logout: "Logout",
            langBtn: "عربي"
        },
        // Hero Section
        hero: {
            badge: "Available for collaboration",
            name: "Abdelrahman Yasser",
            title1: "AI Architect &",
            title2: "Software Engineer",
            description: "Transforming complex ideas into intelligent, scalable solutions. Pioneering the future of AI-driven innovation.",
            cta1: "Explore My Work",
            cta2: "Get In Touch",
            stat1Label: "Years Experience",
            stat2Label: "Projects Delivered",
            stat3Label: "AI Solutions",
            scrollText: "Scroll to explore"
        },
        // About Section
        about: {
            label: "Who I Am",
            title: "Crafting the Future with Code & Intelligence",
            intro1: "I am <strong>Abdelrahman Yasser</strong>, a visionary software engineer and artificial intelligence specialist dedicated to pushing the boundaries of what's possible with technology.",
            intro2: "With deep expertise in <strong>Machine Learning</strong>, <strong>neural networks</strong>, and <strong>intelligent systems</strong>, I transform complex challenges into elegant, scalable solutions that drive real-world impact. My approach combines cutting-edge AI research with practical engineering excellence to build products that don't just work—they innovate.",
            card1Title: "Problem Solver",
            card1Text: "I thrive on complexity, breaking down intricate problems into innovative, actionable solutions that deliver measurable results.",
            card2Title: "Forward-Thinking",
            card2Text: "My passion lies in emerging technologies—AI, automation, and intelligent systems that shape tomorrow's digital landscape.",
            card3Title: "Builder & Creator",
            card3Text: "From concept to deployment, I architect and build intelligent applications that are robust, scalable, and future-proof.",
            mission: "<strong>My Mission:</strong> To bridge the gap between human ambition and technological capability, creating AI-powered solutions that empower businesses and individuals to achieve what was once impossible."
        },
        // Expertise Section
        expertise: {
            label: "Core Competencies",
            title: "Technical Excellence & Innovation",
            skill1: "Advanced Programming",
            skill1Text: "Mastery of multiple programming languages and frameworks, with expertise in Python, JavaScript, C++, and modern development tools. Building clean, efficient, and maintainable code is my foundation.",
            skill2: "AI & Machine Learning",
            skill2Text: "Deep expertise in designing and deploying machine learning models, neural networks, and intelligent systems. From research to production, I deliver AI solutions that learn, adapt, and excel.",
            skill3: "Intelligent Applications",
            skill3Text: "Specialized in building smart platforms, chatbots, recommendation engines, and predictive systems that leverage AI to solve complex business problems and enhance user experiences.",
            skill4: "Creative Innovation",
            skill4Text: "Combining technical mastery with creative thinking to design novel solutions. I don't just follow trends—I anticipate them and build systems that stand the test of time.",
            skill5: "Analytical Mindset",
            skill5Text: "Strong analytical and problem-solving capabilities. I dissect challenges methodically, identify patterns, and engineer solutions backed by data-driven insights and strategic thinking.",
            skill6: "Product Development",
            skill6Text: "End-to-end product development from ideation to launch. I transform abstract ideas into production-ready, scalable digital products that users love and businesses rely on."
        },
        // Portfolio Section
        portfolio: {
            label: "My Work",
            title: "Featured Projects & Websites",
            description: "A showcase of cutting-edge projects that demonstrate my expertise in AI, web development, and intelligent systems.",
            viewLive: "View Live",
            project1Title: "AI Analytics Platform",
            project1Desc: "Advanced analytics dashboard powered by machine learning algorithms for predictive insights and real-time data visualization.",
            project2Title: "Smart E-Commerce Solution",
            project2Desc: "Full-stack e-commerce platform with intelligent product recommendations and automated inventory management.",
            project3Title: "AI Customer Support Bot",
            project3Desc: "Intelligent chatbot using natural language processing to provide automated customer support with human-like interactions.",
            project4Title: "Business Intelligence Dashboard",
            project4Desc: "Comprehensive BI dashboard with advanced data visualization and predictive analytics for strategic decision-making."
        },
        // Videos Section
        videos: {
            label: "Video Showcase",
            title: "My Work in Action",
            description: "Watch demonstrations of my projects, tutorials, and insights into the world of AI and software engineering.",
            video1Title: "Building AI-Powered Chat Applications",
            video1Desc: "Complete tutorial on creating intelligent chatbots using modern NLP techniques and deep learning models.",
            video2Title: "Machine Learning Model Deployment",
            video2Desc: "Step-by-step guide to deploying ML models in production environments with best practices and optimization techniques.",
            video3Title: "Modern Web Development with AI Integration",
            video3Desc: "Learn how to integrate AI capabilities into modern web applications for enhanced user experiences.",
            views: "views",
            ago: "ago",
            week: "week",
            weeks: "weeks",
            month: "month"
        },
        // Contact Section
        contact: {
            label: "Let's Connect",
            title: "Ready to Build Something Amazing?",
            description: "Whether you have a project in mind, need consultation, or want to explore collaboration opportunities, I'd love to hear from you.",
            email: "Email",
            linkedin: "LinkedIn",
            github: "GitHub",
            ctaTitle: "Let's Create the Future Together",
            ctaText: "I'm always open to discussing new projects, innovative ideas, or opportunities to be part of your vision.",
            ctaBtn: "Start a Conversation"
        },
        // Footer
        footer: {
            tagline: "Building intelligent solutions for a smarter future.",
            copyright: "© 2024 Abdelrahman Yasser. All rights reserved.",
            motto: "Powered by Intelligence. Driven by Innovation."
        },
        comments: {
            label: "Guestbook",
            title: "Leave a Nice Comment",
            description: "Share your thoughts, feedback, or a nice message!",
            placeholder: "Write a nice comment...",
            submitBtn: "Post Comment",
            authPrompt: 'Please <a href="login.html" class="auth-link">login</a> to leave a comment.'
        },
        modal: {
            title: "Start a Conversation",
            subtitle: "Leave your details and project idea, and we will get back to you.",
            nameLabel: "Full Name",
            phoneLabel: "Phone Number",
            ideaLabel: "Project Idea",
            namePlaceholder: "Your Name",
            phonePlaceholder: "01xxxxxxxxx",
            ideaPlaceholder: "Describe your project idea...",
            submitBtn: "Send Message"
        },
        signupBanner: {
            title: "Join the Community",
            desc: "Create a free account to leave comments and interact with the portfolio.",
            cta: "Create Account",
            dismiss: "I already have an account"
        }
    },
    ar: {
        // Navigation
        nav: {
            home: "الرئيسية",
            about: "من أنا",
            expertise: "الخبرات",
            portfolio: "الأعمال",
            videos: "الفيديوهات",
            contact: "تواصل معي",
            login: "إنشاء حساب",
            logout: "تسجيل خروج",
            langBtn: "English"
        },
        // Hero Section
        hero: {
            badge: "متاح للتعاون",
            name: "عبدالرحمن ياسر",
            title1: "مهندس ذكاء اصطناعي",
            title2: "و مطور برمجيات",
            description: "تحويل الأفكار المعقدة إلى حلول ذكية قابلة للتطوير. رائد في مستقبل الابتكار القائم على الذكاء الاصطناعي.",
            cta1: "استكشف أعمالي",
            cta2: "تواصل معي",
            stat1Label: "سنوات خبرة",
            stat2Label: "مشروع منجز",
            stat3Label: "حل ذكاء اصطناعي",
            scrollText: "اسحب للاستكشاف"
        },
        // About Section
        about: {
            label: "من أنا",
            title: "صياغة المستقبل بالبرمجة والذكاء",
            intro1: "أنا <strong>عبدالرحمن ياسر</strong>، مهندس برمجيات ذو رؤية ومتخصص في الذكاء الاصطناعي، ملتزم بدفع حدود ما هو ممكن مع التكنولوجيا.",
            intro2: "بخبرة عميقة في <strong>التعلم الآلي</strong> و<strong>الشبكات العصبية</strong> و<strong>الأنظمة الذكية</strong>، أحول التحديات المعقدة إلى حلول أنيقة وقابلة للتطوير تحدث تأثيراً حقيقياً. نهجي يجمع بين أبحاث الذكاء الاصطناعي المتطورة والتميز الهندسي العملي لبناء منتجات لا تعمل فقط - بل تبتكر.",
            card1Title: "حل المشكلات",
            card1Text: "أزدهر في التعقيد، أحلل المشاكل المعقدة إلى حلول مبتكرة وقابلة للتنفيذ تحقق نتائج قابلة للقياس.",
            card2Title: "تفكير مستقبلي",
            card2Text: "شغفي يكمن في التقنيات الناشئة - الذكاء الاصطناعي والأتمتة والأنظمة الذكية التي تشكل المشهد الرقمي للغد.",
            card3Title: "بناء وإبداع",
            card3Text: "من الفكرة إلى النشر، أصمم وأبني تطبيقات ذكية قوية وقابلة للتطوير ومستقبلية.",
            mission: "<strong>مهمتي:</strong> سد الفجوة بين الطموح البشري والقدرة التكنولوجية، وإنشاء حلول مدعومة بالذكاء الاصطناعي تمكن الشركات والأفراد من تحقيق ما كان مستحيلاً."
        },
        // Expertise Section
        expertise: {
            label: "الكفاءات الأساسية",
            title: "التميز التقني والابتكار",
            skill1: "البرمجة المتقدمة",
            skill1Text: "إتقان لغات وأطر عمل برمجية متعددة، مع خبرة في Python و JavaScript و C++ وأدوات التطوير الحديثة. بناء كود نظيف وفعال وقابل للصيانة هو أساسي.",
            skill2: "الذكاء الاصطناعي والتعلم الآلي",
            skill2Text: "خبرة عميقة في تصميم ونشر نماذج التعلم الآلي والشبكات العصبية والأنظمة الذكية. من البحث إلى الإنتاج، أقدم حلول ذكاء اصطناعي تتعلم وتتكيف وتتفوق.",
            skill3: "التطبيقات الذكية",
            skill3Text: "متخصص في بناء منصات ذكية وروبوتات دردشة ومحركات توصيات وأنظمة تنبؤية تستفيد من الذكاء الاصطناعي لحل مشاكل الأعمال المعقدة وتحسين تجربة المستخدم.",
            skill4: "الابتكار الإبداعي",
            skill4Text: "الجمع بين الإتقان التقني والتفكير الإبداعي لتصميم حلول جديدة. لا أتبع الاتجاهات فقط - بل أتوقعها وأبني أنظمة تصمد أمام اختبار الزمن.",
            skill5: "العقلية التحليلية",
            skill5Text: "قدرات تحليلية قوية وحل المشكلات. أحلل التحديات بشكل منهجي، وأحدد الأنماط، وأهندس حلولاً مدعومة برؤى مدفوعة بالبيانات وتفكير استراتيجي.",
            skill6: "تطوير المنتجات",
            skill6Text: "تطوير منتجات من البداية إلى الإطلاق. أحول الأفكار المجردة إلى منتجات رقمية جاهزة للإنتاج وقابلة للتطوير يحبها المستخدمون وتعتمد عليها الشركات."
        },
        // Portfolio Section
        portfolio: {
            label: "أعمالي",
            title: "المشاريع والمواقع المميزة",
            description: "عرض للمشاريع المتطورة التي تظهر خبرتي في الذكاء الاصطناعي وتطوير الويب والأنظمة الذكية.",
            viewLive: "عرض مباشر",
            project1Title: "منصة تحليلات الذكاء الاصطناعي",
            project1Desc: "لوحة تحليلات متقدمة مدعومة بخوارزميات التعلم الآلي للرؤى التنبؤية وتصور البيانات في الوقت الفعلي.",
            project2Title: "حل تجارة إلكترونية ذكي",
            project2Desc: "منصة تجارة إلكترونية متكاملة مع توصيات منتجات ذكية وإدارة مخزون آلية.",
            project3Title: "روبوت دعم عملاء ذكي",
            project3Desc: "روبوت دردشة ذكي يستخدم معالجة اللغة الطبيعية لتقديم دعم عملاء آلي بتفاعلات شبيهة بالبشر.",
            project4Title: "لوحة معلومات الأعمال الذكية",
            project4Desc: "لوحة معلومات BI شاملة مع تصور بيانات متقدم وتحليلات تنبؤية لاتخاذ القرارات الاستراتيجية."
        },
        // Videos Section
        videos: {
            label: "عرض الفيديوهات",
            title: "أعمالي في الواقع",
            description: "شاهد عروضاً توضيحية لمشاريعي ودروساً ورؤى في عالم الذكاء الاصطناعي وهندسة البرمجيات.",
            video1Title: "بناء تطبيقات دردشة مدعومة بالذكاء الاصطناعي",
            video1Desc: "دورة تعليمية كاملة حول إنشاء روبوتات دردشة ذكية باستخدام تقنيات معالجة اللغة الطبيعية الحديثة ونماذج التعلم العميق.",
            video2Title: "نشر نماذج التعلم الآلي",
            video2Desc: "دليل خطوة بخطوة لنشر نماذج التعلم الآلي في بيئات الإنتاج مع أفضل الممارسات وتقنيات التحسين.",
            video3Title: "تطوير الويب الحديث مع تكامل الذكاء الاصطناعي",
            video3Desc: "تعلم كيفية دمج قدرات الذكاء الاصطناعي في تطبيقات الويب الحديثة لتحسين تجارب المستخدم.",
            views: "مشاهدة",
            ago: "منذ",
            week: "أسبوع",
            weeks: "أسابيع",
            month: "شهر"
        },
        // Contact Section
        contact: {
            label: "لنتواصل",
            title: "مستعد لبناء شيء مذهل؟",
            description: "سواء كان لديك مشروع في ذهنك، أو تحتاج إلى استشارة، أو ترغب في استكشاف فرص التعاون، أود أن أسمع منك.",
            email: "البريد الإلكتروني",
            linkedin: "لينكد إن",
            github: "جيت هب",
            ctaTitle: "لنصنع المستقبل معاً",
            ctaText: "أنا دائماً منفتح لمناقشة مشاريع جديدة أو أفكار مبتكرة أو فرص لأكون جزءاً من رؤيتك.",
            ctaBtn: "ابدأ محادثة"
        },
        // Footer
        footer: {
            tagline: "بناء حلول ذكية لمستقبل أذكى.",
            copyright: "© 2024 عبدالرحمن ياسر. جميع الحقوق محفوظة.",
            motto: "مدعوم بالذكاء. مدفوع بالابتكار."
        },
        comments: {
            label: "كتاب الزوار",
            title: "اترك تعليقاً جميلاً",
            description: "شاركنا بآرائك، ملاحظاتك، أو رسالة لطيفة!",
            placeholder: "اكتب تعليقاً جميلاً...",
            submitBtn: "نشر التعليق",
            authPrompt: 'يرجى <a href="login.html" class="auth-link">تسجيل الدخول</a> لترك تعليق.'
        },
        modal: {
            title: "ابدأ محادثة",
            subtitle: "اترك بياناتك وفكرة مشروعك، وسنتواصل معك قريباً.",
            nameLabel: "الاسم بالكامل",
            phoneLabel: "رقم الهاتف",
            ideaLabel: "فكرة المشروع",
            namePlaceholder: "اسمك الكريم",
            phonePlaceholder: "01xxxxxxxxx",
            ideaPlaceholder: "اكتب فكرة مشروعك بالتفصيل...",
            submitBtn: "إرسال الرسالة"
        },
        signupBanner: {
            title: "انضم للمجتمع",
            desc: "أنشئ حساباً مجانياً لترك تعليقات والتفاعل مع الأعمال.",
            cta: "إنشاء حساب",
            dismiss: "لدي حساب بالفعل"
        }
    }
};

// ==================== LANGUAGE SWITCHING ====================
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    const html = document.documentElement;
    const t = translations[lang];

    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update language button text
    document.querySelector('.lang-text').textContent = t.nav.langBtn;

    // Save preference
    localStorage.setItem('preferredLanguage', lang);

    // Apply translations
    applyTranslations(t);
}

function applyTranslations(t) {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks[0].textContent = t.nav.home;
    navLinks[1].textContent = t.nav.about;
    navLinks[2].textContent = t.nav.expertise;
    navLinks[3].textContent = t.nav.portfolio;
    navLinks[4].textContent = t.nav.videos;
    navLinks[5].textContent = t.nav.contact;

    // Update auth button text (if logged out)
    const authText = document.querySelector('.auth-text');
    if (authText) {
        const currentText = authText.textContent.trim();
        const isLoggedOut = currentText === 'Create Account' || currentText === 'إنشاء حساب';
        if (isLoggedOut) {
            authText.textContent = t.nav.login;
        }
    }

    // Update signup banner translations if it exists
    const bannerTitle = document.getElementById('signup-banner-title');
    const bannerDesc = document.getElementById('signup-banner-desc');
    const bannerCta = document.getElementById('signup-banner-cta');
    const bannerDismiss = document.getElementById('signup-banner-dismiss');
    if (t.signupBanner) {
        if (bannerTitle) bannerTitle.textContent = t.signupBanner.title;
        if (bannerDesc) bannerDesc.textContent = t.signupBanner.desc;
        if (bannerCta) bannerCta.textContent = t.signupBanner.cta;
        if (bannerDismiss) bannerDismiss.textContent = t.signupBanner.dismiss;
    }

    // Hero Section
    document.querySelector('.hero-label').innerHTML = `<span class="pulse-dot"></span>${t.hero.badge}`;
    const heroTitle = document.querySelector('.hero-title');
    heroTitle.innerHTML = `
        <span class="title-line">${t.hero.name}</span>
        <span class="title-gradient">${t.hero.title1}</span>
        <span class="title-gradient">${t.hero.title2}</span>
    `;
    document.querySelector('.hero-description').textContent = t.hero.description;
    document.querySelectorAll('.hero-cta .btn span')[0].textContent = t.hero.cta1;
    document.querySelectorAll('.hero-cta .btn span')[1].textContent = t.hero.cta2;
    document.querySelectorAll('.stat-label')[0].textContent = t.hero.stat1Label;
    document.querySelectorAll('.stat-label')[1].textContent = t.hero.stat2Label;
    document.querySelectorAll('.stat-label')[2].textContent = t.hero.stat3Label;
    document.querySelector('.scroll-indicator span').textContent = t.hero.scrollText;

    // About Section
    document.querySelectorAll('.section-label')[0].textContent = t.about.label;
    document.querySelectorAll('.section-title')[0].textContent = t.about.title;
    document.querySelectorAll('.intro-paragraph')[0].innerHTML = t.about.intro1;
    document.querySelectorAll('.intro-paragraph')[1].innerHTML = t.about.intro2;

    const philosophyCards = document.querySelectorAll('.philosophy-card');
    philosophyCards[0].querySelector('h3').textContent = t.about.card1Title;
    philosophyCards[0].querySelector('p').textContent = t.about.card1Text;
    philosophyCards[1].querySelector('h3').textContent = t.about.card2Title;
    philosophyCards[1].querySelector('p').textContent = t.about.card2Text;
    philosophyCards[2].querySelector('h3').textContent = t.about.card3Title;
    philosophyCards[2].querySelector('p').textContent = t.about.card3Text;

    document.querySelector('.mission-statement p').innerHTML = t.about.mission;

    // Expertise Section
    document.querySelectorAll('.section-label')[1].textContent = t.expertise.label;
    document.querySelectorAll('.section-title')[1].textContent = t.expertise.title;

    const skillCards = document.querySelectorAll('.skill-card');
    skillCards[0].querySelector('h3').textContent = t.expertise.skill1;
    skillCards[0].querySelector('p').textContent = t.expertise.skill1Text;
    skillCards[1].querySelector('h3').textContent = t.expertise.skill2;
    skillCards[1].querySelector('p').textContent = t.expertise.skill2Text;
    skillCards[2].querySelector('h3').textContent = t.expertise.skill3;
    skillCards[2].querySelector('p').textContent = t.expertise.skill3Text;
    skillCards[3].querySelector('h3').textContent = t.expertise.skill4;
    skillCards[3].querySelector('p').textContent = t.expertise.skill4Text;
    skillCards[4].querySelector('h3').textContent = t.expertise.skill5;
    skillCards[4].querySelector('p').textContent = t.expertise.skill5Text;
    skillCards[5].querySelector('h3').textContent = t.expertise.skill6;
    skillCards[5].querySelector('p').textContent = t.expertise.skill6Text;

    // Portfolio Section
    document.querySelectorAll('.section-label')[2].textContent = t.portfolio.label;
    document.querySelectorAll('.section-title')[2].textContent = t.portfolio.title;
    document.querySelectorAll('.section-description')[0].textContent = t.portfolio.description;

    const projectCards = document.querySelectorAll('.project-card');
    document.querySelectorAll('.project-link span').forEach(span => {
        span.textContent = t.portfolio.viewLive;
    });
    projectCards[0].querySelector('.project-title').textContent = t.portfolio.project1Title;
    projectCards[0].querySelector('.project-description').textContent = t.portfolio.project1Desc;
    projectCards[1].querySelector('.project-title').textContent = t.portfolio.project2Title;
    projectCards[1].querySelector('.project-description').textContent = t.portfolio.project2Desc;
    projectCards[2].querySelector('.project-title').textContent = t.portfolio.project3Title;
    projectCards[2].querySelector('.project-description').textContent = t.portfolio.project3Desc;
    projectCards[3].querySelector('.project-title').textContent = t.portfolio.project4Title;
    projectCards[3].querySelector('.project-description').textContent = t.portfolio.project4Desc;

    // Videos Section
    document.querySelectorAll('.section-label')[3].textContent = t.videos.label;
    document.querySelectorAll('.section-title')[3].textContent = t.videos.title;
    document.querySelectorAll('.section-description')[1].textContent = t.videos.description;

    const videoCards = document.querySelectorAll('.video-card');
    videoCards[0].querySelector('.video-title').textContent = t.videos.video1Title;
    videoCards[0].querySelector('.video-description').textContent = t.videos.video1Desc;
    videoCards[1].querySelector('.video-title').textContent = t.videos.video2Title;
    videoCards[1].querySelector('.video-description').textContent = t.videos.video2Desc;
    videoCards[2].querySelector('.video-title').textContent = t.videos.video3Title;
    videoCards[2].querySelector('.video-description').textContent = t.videos.video3Desc;

    // Contact Section
    document.querySelectorAll('.section-label')[4].textContent = t.contact.label;
    document.querySelectorAll('.section-title')[4].textContent = t.contact.title;
    document.querySelectorAll('.section-description')[2].textContent = t.contact.description;

    const contactCards = document.querySelectorAll('.contact-card h3');
    contactCards[0].textContent = t.contact.email;
    contactCards[1].textContent = t.contact.linkedin;
    contactCards[2].textContent = t.contact.github;

    document.querySelector('.cta-box h3').textContent = t.contact.ctaTitle;
    document.querySelector('.cta-box p').textContent = t.contact.ctaText;
    document.querySelector('.cta-box .btn span').textContent = t.contact.ctaBtn;

    // Footer
    document.querySelectorAll('.footer-left p')[0].textContent = t.footer.tagline;
    document.querySelectorAll('.footer-right p')[0].textContent = t.footer.copyright;
    document.querySelector('.footer-tagline').textContent = t.footer.motto;

    // Guestbook Section
    const commentsLabel = document.querySelector('.comments .section-label');
    const commentsTitle = document.querySelector('.comments .section-title');
    const commentsDesc = document.querySelector('.comments .section-description');
    const commentInput = document.getElementById('comment-text-input');
    const commentSubmitSpan = document.querySelector('#submit-comment-btn span');
    const commentAuthMsg = document.querySelector('#comment-auth-message p');

    if (commentsLabel) commentsLabel.textContent = t.comments.label;
    if (commentsTitle) commentsTitle.textContent = t.comments.title;
    if (commentsDesc) commentsDesc.textContent = t.comments.description;
    if (commentInput) commentInput.placeholder = t.comments.placeholder;
    if (commentSubmitSpan) commentSubmitSpan.textContent = t.comments.submitBtn;
    if (commentAuthMsg) {
        commentAuthMsg.innerHTML = t.comments.authPrompt;
    }

    // Modal
    const modalTitle = document.querySelector('.modal-title');
    const modalSubtitle = document.querySelector('.modal-subtitle');
    const modalLabels = document.querySelectorAll('.modal-label');
    const modalInputs = document.querySelectorAll('.modal .form-input');
    const modalSubmitSpan = document.querySelector('#modal-submit-btn span');

    if (modalTitle) modalTitle.textContent = t.modal.title;
    if (modalSubtitle) modalSubtitle.textContent = t.modal.subtitle;
    if (modalLabels.length >= 3) {
        modalLabels[0].textContent = t.modal.nameLabel;
        modalLabels[1].textContent = t.modal.phoneLabel;
        modalLabels[2].textContent = t.modal.ideaLabel;
    }
    if (modalInputs.length >= 3) {
        modalInputs[0].placeholder = t.modal.namePlaceholder;
        modalInputs[1].placeholder = t.modal.phonePlaceholder;
        modalInputs[2].placeholder = t.modal.ideaPlaceholder;
    }
    if (modalSubmitSpan) modalSubmitSpan.textContent = t.modal.submitBtn;
}

function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);

    // Add event listener to language toggle button
    const langToggle = document.getElementById('language-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
});
