// Professional, context-aware translations for English, Amharic, and Afaan Oromo
export type Language = 'en' | 'am' | 'or' | 'ti';

export interface Translations {
    // Navbar
    nav: {
        home: string;
        features: string;
        solutions: string;
        howItWorks: string;
        security: string;
        pricing: string;
        contact: string;
        integrations: string;
        blog: string;
        signIn: string;
        startFreeTrial: string;
        dashboard: string;
        signOut: string;
    };

    // Hero Section
    hero: {
        badge1: string;
        badge2: string;
        title1: string;
        title2: string;
        title3: string;
        cta1: string;
        cta2: string;
        stat1Value: string;
        stat1Label: string;
        stat2Value: string;
        stat2Label: string;
        stat3Value: string;
        stat3Label: string;
    };

    // Problem Solution Section
    problemSolution: {
        title: string;
        subtitle: string;
        problem1Title: string;
        problem1Desc: string;
        problem2Title: string;
        problem2Desc: string;
        problem3Title: string;
        problem3Desc: string;
        solution1Title: string;
        solution1Desc: string;
        solution2Title: string;
        solution2Desc: string;
        solution3Title: string;
        solution3Desc: string;
        intro: string;
        oldWay: string;
        mesobWay: string;
    };

    // Features Section
    features: {
        badge: string;
        title: string;
        subtitle: string;
        feature1Title: string;
        feature1Desc: string;
        feature2Title: string;
        feature2Desc: string;
        feature3Title: string;
        feature3Desc: string;
        feature4Title: string;
        feature4Desc: string;
        feature5Title: string;
        feature5Desc: string;
        quickFeature1: string;
        quickFeature2: string;
        quickFeature3: string;
        quickFeature4: string;
    };

    // AI Section
    ai: {
        badge: string;
        title: string;
        subtitle: string;
        feature1Title: string;
        feature1Desc: string;
        feature2Title: string;
        feature2Desc: string;
        feature3Title: string;
        feature3Desc: string;
        cta: string;
        chat1Question: string;
        chat1Answer: string;
        chat2Question: string;
        chat2Answer: string;
        imageAlt: string;
    };

    // How It Works
    howItWorks: {
        badge: string;
        title: string;
        subtitle: string;
        step1Title: string;
        step1Desc: string;
        step2Title: string;
        step2Desc: string;
        step3Title: string;
        step3Desc: string;
        imageAlt1: string;
        imageAlt2: string;
        imageAlt3: string;
    };

    // Pricing Section
    pricing: {
        badge: string;
        title: string;
        subtitle: string;
        monthly: string;
        annually: string;
        saveLabel: string;
        perMonth: string;
        startTrial: string;
        getStarted: string;
        contactSales: string;
        mostPopular: string;
        starterName: string;
        starterDesc: string;
        professionalName: string;
        professionalDesc: string;
        enterpriseName: string;
        enterpriseDesc: string;
        feature1: string;
        feature2: string;
        feature3: string;
        feature4: string;
        feature5: string;
        feature6: string;
        feature7: string;
        feature8: string;
        feature9: string;
        footerText: string;
        ownerCta: string;
        supplierCta: string;
        contactUs: string;
    };

    // PWA Install
    pwaInstall: {
        installApp: string;
        installTitle: string;
        installDescription: string;
        iosStep1: string;
        iosStep2: string;
        androidStep1: string;
        androidStep2: string;
        desktopStep1: string;
        desktopStep2: string;
        firefoxMessage: string;
        defaultMessage: string;
        gotIt: string;
    };

    // Integrations Section
    integrations: {
        badge: string;
        title: string;
        subtitle: string;
        viewAll: string;
        effortlessTitle: string;
        effortlessDesc: string;
        benefit1: string;
        benefit2: string;
        benefit3: string;
        benefit4: string;
        requestTitle: string;
        requestLink: string;
        googleSheetsDesc: string;
        sapDesc: string;
        odooDesc: string;
    };

    // Affiliate Section
    affiliate: {
        badge: string;
        title: string;
        subtitle: string;
        benefit1Title: string;
        benefit1Desc: string;
        benefit2Title: string;
        benefit2Desc: string;
        benefit3Title: string;
        benefit3Desc: string;
        benefit4Title: string;
        benefit4Desc: string;
        cta: string;
        howItWorksTitle: string;
        step1Title: string;
        step1Desc: string;
        step2Title: string;
        step2Desc: string;
        step3Title: string;
        step3Desc: string;
        step4Title: string;
        step4Desc: string;
        dashboardAlt: string;
    };

    // Testimonials Section
    testimonials: {
        badge: string;
        title: string;
        subtitle: string;
    };

    // CTA Section
    cta: {
        title: string;
        subtitle: string;
        button: string;
        feature1Title: string;
        feature1Desc: string;
        feature2Title: string;
        feature2Desc: string;
        feature3Title: string;
        feature3Desc: string;
    };

    // Footer
    footer: {
        description: string;
        productTitle: string;
        product1: string;
        product2: string;
        product3: string;
        product4: string;
        companyTitle: string;
        company1: string;
        company2: string;
        company3: string;
        company4: string;
        legalTitle: string;
        legal1: string;
        legal2: string;
        legal3: string;
        supportTitle: string;
        support1: string;
        support2: string;
        support3: string;
        rightsReserved: string;
        featureOverview: string;
        aiSolutions: string;
        pricing: string;
        contact: string;
        affiliates: string;
        privacyPolicy: string;
        termsOfService: string;
        privacy: string;
        terms: string;
        support: string;
    };

    // Contact Us Page
    contactPage: {
        title: string;
        subtitle: string;
        formHeading: string;
        nameLabel: string;
        emailLabel: string;
        companyLabel: string;
        messageLabel: string;
        messagePlaceholder: string;
        submitButton: string;
        submitting: string;
        successTitle: string;
        successMessage: string;
        contactInfoHeading: string;
        emailHeading: string;
        emailText: string;
        emailResponseTime: string;
        phoneHeading: string;
        phoneText: string;
        phoneHours: string;
        officeHeading: string;
        officeAddress: string;
        officeHours: string;
        demoExpectationsHeading: string;
        demoExpectation1: string;
        demoExpectation2: string;
        demoExpectation3: string;
        demoExpectation4: string;
        demoExpectation5: string;
    };

    // Privacy Policy Page
    privacyPage: {
        pageTitle: string;
        pageSubtitle: string;
        lastUpdated: string;
        section1Heading: string;
        section1Body: string;
        section2Heading: string;
        section2Body: string;
        section3Heading: string;
        section3Body: string;
        section4Heading: string;
        section4Body: string;
        section5Heading: string;
        section5Body: string;
        section6Heading: string;
        section6Body: string;
        section7Heading: string;
        section7Body: string;
        section8Heading: string;
        section8Body: string;
        section9Heading: string;
        section9Body: string;
        section10Heading: string;
        section10Body: string;
        contactUsHeading: string;
        contactUsIntro: string;
        contactEmail: string;
        contactPhone: string;
        contactAddress: string;
        contactBusinessHours: string;
        termsLink: string;
    };

    // Cookie Consent
    cookieConsent: {
        title: string;
        description: string;
        learnMore: string;
        decline: string;
        accept: string;
    };

    // Auth Pages
    auth: {
        // Common
        signIn: string;
        signUp: string;
        emailOrPhone: string;
        password: string;
        forgotPassword: string;
        rememberMe: string;
        dontHaveAccount: string;
        createOne: string;
        alreadyHaveAccount: string;
        termsAndPrivacy: string;
        terms: string;
        privacy: string;
        verificationCode: string;
        checkEmail: string;
        verifyCode: string;
        verifying: string;
        sendingCode: string;
        backToSignIn: string;

        // Owner Sign In
        ownerSignInTitle: string;
        ownerSignInSubtitle: string;
        ownerWelcome: string;

        // Supplier Sign In
        supplierSignInTitle: string;
        supplierSignInSubtitle: string;
        supplierWelcome: string;

        // Affiliate Sign In
        affiliateSignInTitle: string;
        affiliateSignInSubtitle: string;
        affiliateWelcome: string;

        // Register
        businessName: string;
        tinNumber: string;
        phoneNumber: string;
        address: string;
        licenseDocument: string;
        registerOwner: string;
        registerSupplier: string;
        registerAffiliate: string;
        ownerRegisterTitle: string;
        ownerRegisterSubtitle: string;
        supplierRegisterTitle: string;
        supplierRegisterSubtitle: string;
        affiliateRegisterTitle: string;
        affiliateRegisterSubtitle: string;

        // Forgot Password
        resetPasswordTitle: string;
        resetPasswordSubtitleEmail: string;
        resetPasswordSubtitleCode: string;
        sendResetCode: string;
        resetCode: string;
        newPassword: string;
        confirmPassword: string;
        resetPasswordButton: string;
        didntReceiveCode: string;
    };
}

export const translations: Record<Language, Translations> = {
    en: {
        nav: {
            home: 'Home',
            features: 'Features',
            solutions: 'Solutions',
            howItWorks: 'How It Works',
            security: 'Security',
            pricing: 'Pricing',
            contact: 'Contact',
            integrations: 'Integrations',
            blog: 'Blog',
            signIn: 'Sign In',
            startFreeTrial: 'Start Free Trial',
            dashboard: 'Dashboard',
            signOut: 'Sign Out',
        },
        hero: {
            badge1: 'Business Revolution with AI',
            badge2: 'Built by Ethiopia for Africa',
            title1: 'Transform Your',
            title2: 'Business',
            title3: 'with AI-Powered Management Software',
            cta1: 'Start 30-Day Free Trial',
            cta2: 'Watch Demo',
            stat1Value: '30 Days',
            stat1Label: 'Free Trial',
            stat2Value: '24/7',
            stat2Label: 'AI Support',
            stat3Value: '>99.9%',
            stat3Label: 'Uptime',
        },
        problemSolution: {
            title: 'The Challenge African Businesses Face',
            subtitle: 'And How We Solve It',
            problem1Title: 'Manual Processes',
            problem1Desc: 'Time-consuming paperwork and manual data entry slow down your business',
            problem2Title: 'Limited Insights',
            problem2Desc: 'Difficult to track inventory, sales, and business performance in real-time',
            problem3Title: 'Disconnected Systems',
            problem3Desc: 'Multiple tools that don\'t work together, causing inefficiency',
            solution1Title: 'Automated Workflows',
            solution1Desc: 'AI-powered automation handles repetitive tasks, freeing your time for growth',
            solution2Title: 'Real-Time Analytics',
            solution2Desc: 'Instant insights into your business performance with intelligent dashboards',
            solution3Title: 'All-in-One Platform',
            solution3Desc: 'Everything you need in one place - inventory, sales, HR, and more',
            intro: 'Traditional Bussiness management is holding Ethiopian businesses back. It\'s time for a revolution.',
            oldWay: 'Old Way Problems',
            mesobWay: 'Mesob Way',
        },
        features: {
            badge: 'Powerful Features',
            title: 'Everything You Need in One Platform',
            subtitle: 'A complete, modern bussiness management system designed specifically for Ethiopian shops, pharmacies, and retail businesses.',
            feature1Title: 'Multi-Branch Management',
            feature1Desc: 'Manage all your store locations from a single, unified dashboard. Get real-time visibility into stock levels, sales, and performance across every branch.',
            feature2Title: 'Staff & Team Management',
            feature2Desc: 'Create staff accounts with custom permissions, track activities, and ensure accountability across your organization with role-based access control.',
            feature3Title: 'One-Click Integrations',
            feature3Desc: 'Seamlessly connect with Google Sheets, ERP systems, accounting software, and more. No technical knowledge required—just one click to integrate your existing tools.',
            feature4Title: 'Smart Expense & Goal Tracking',
            feature4Desc: 'Never miss a payment deadline again. Mesob automatically tracks and reminds you of tax payments, employee salaries, rent, license renewals, and all business expenses.',
            feature5Title: 'Supplier Marketplace',
            feature5Desc: 'Connect directly with verified suppliers who promote their products on your dashboard. Discover new products, compare prices, and order with confidence.',
            quickFeature1: 'Real-time Analytics',
            quickFeature2: 'Automated Alerts',
            quickFeature3: 'Stock Transfers',
            quickFeature4: 'Sales Forecasting',
        },
        ai: {
            badge: 'AI-Powered Intelligence',
            title: 'Your Business, Supercharged by AI',
            subtitle: 'Intelligent automation that works for you 24/7',
            feature1Title: 'Smart Predictions',
            feature1Desc: 'AI forecasts demand, optimizes inventory, and predicts trends',
            feature2Title: 'Automated Insights',
            feature2Desc: 'Get actionable recommendations to improve your business',
            feature3Title: 'Intelligent Support',
            feature3Desc: '24/7 AI assistant to answer questions and help with tasks',
            cta: 'Experience AI-Powered Business',
            chat1Question: '"How is my pharmacy inventory performing this month?"',
            chat1Answer: 'Your pharmacy has seen a 23% increase in sales compared to last month. However, I notice you\'re running low on antibiotics. Based on current trends, I recommend ordering 150 units of Amoxicillin within the next 3 days to avoid stockouts.',
            chat2Question: '"Which products are underperforming?"',
            chat2Answer: 'I\'ve identified 12 slow-moving items worth 45,000 Birr that haven\'t sold in 60 days. I suggest running a promotion or adjusting your ordering strategy for these items.',
            imageAlt: 'AI-Powered Pharmacy Management',
        },
        howItWorks: {
            badge: 'Simple Process',
            title: 'How Mesob Works',
            subtitle: 'Three simple steps to transform your business',
            step1Title: 'Quick Setup',
            step1Desc: 'Get started in minutes with easy setup and seamless integration with your existing systems.',
            step2Title: 'Smart Analytics',
            step2Desc: 'AI-powered insights help you make better decisions with real-time analytics and predictions.',
            step3Title: 'Scale & Grow',
            step3Desc: 'Expand confidently with multi-branch support, automated workflows, and continuous optimization.',
            imageAlt1: 'Dashboard Overview',
            imageAlt2: 'AI Assistant Interface',
            imageAlt3: 'Owner Overview',
        },
        pricing: {
            badge: 'Flexible Pricing',
            title: 'Choose the Perfect Plan for Your Business',
            subtitle: 'Start with a 30-day free trial. No credit card required.',
            monthly: 'Monthly',
            annually: 'Annually',
            saveLabel: 'Save 20%',
            perMonth: '/month',
            startTrial: 'Start Free Trial',
            getStarted: 'Get Started',
            contactSales: 'Contact Sales',
            mostPopular: 'Most Popular',
            starterName: 'Starter',
            starterDesc: 'Perfect for small businesses just getting started',
            professionalName: 'Professional',
            professionalDesc: 'For growing businesses that need advanced features',
            enterpriseName: 'Enterprise',
            enterpriseDesc: 'Custom solutions for large organizations',
            feature1: 'Up to 5 users',
            feature2: 'Basic inventory management',
            feature3: 'Sales tracking',
            feature4: 'Email support',
            feature5: 'Unlimited users',
            feature6: 'Advanced analytics',
            feature7: 'API access',
            feature8: 'Priority support',
            feature9: 'Custom integrations',
            footerText: '© 2024 Mesob. All rights reserved.',
            ownerCta: 'Sign in as Owner',
            supplierCta: 'Sign in as Supplier',
            contactUs: 'Contact Us',
        },
        pwaInstall: {
            installApp: 'Install App',
            installTitle: 'Install Mesob',
            installDescription: 'Add the app to your home screen for a better experience.',
            iosStep1: 'Tap the share icon',
            iosStep2: 'Select "Add to Home Screen"',
            androidStep1: 'Tap the menu icon',
            androidStep2: 'Select "Install App"',
            desktopStep1: 'Click the install icon',
            desktopStep2: 'in the address bar',
            firefoxMessage: 'Please use Chrome or Edge to install the app',
            defaultMessage: 'This browser does not support app installation',
            gotIt: 'Got it',
        },
        integrations: {
            badge: 'Seamless Integrations',
            title: 'Connect with Your Favorite Tools',
            subtitle: 'Integrate with popular payment, accounting, and business tools',
            viewAll: 'View All Integrations',
            effortlessTitle: 'Effortless Integration',
            effortlessDesc: 'Stop juggling multiple platforms. Mesob AI connects seamlessly with your existing tools, creating a unified ecosystem for your business operations.',
            benefit1: 'One-click setup for all integrations',
            benefit2: 'Real-time data synchronization',
            benefit3: 'Secure, encrypted connections',
            benefit4: 'No technical knowledge required',
            requestTitle: 'Don\'t see your tool?',
            requestLink: 'Request a custom integration',
            googleSheetsDesc: 'Export reports and sync inventory data directly from Google Sheets for easy analysis and sharing.',
            sapDesc: 'Seamlessly integrate with SAP ERP systems for enterprise-level financial and operational management.',
            odooDesc: 'Connect with Odoo\'s comprehensive business suite for unified inventory, sales, and accounting workflows.',
        },
        affiliate: {
            badge: 'Affiliate Program',
            title: 'Earn by Sharing Mesob',
            subtitle: 'Join our affiliate program and earn recurring commissions',
            benefit1Title: 'Earn High Commission',
            benefit1Desc: 'Earn competitive commission for every successful referral.',
            benefit2Title: 'Easy Link Sharing',
            benefit2Desc: 'Generate your unique referral link instantly and share anywhere.',
            benefit3Title: 'Dual Revenue Stream',
            benefit3Desc: 'Earn from both supplier and business owner sign-ups.',
            benefit4Title: 'Real-time Tracking',
            benefit4Desc: 'Track your referrals and earnings in a real-time dashboard.',
            cta: 'Join Affiliate Program',
            howItWorksTitle: 'How It Works',
            step1Title: 'Sign Up Free',
            step1Desc: 'Create your affiliate account in minutes.',
            step2Title: 'Generate Link',
            step2Desc: 'Get your unique referral link from your dashboard with one click.',
            step3Title: 'Share & Promote',
            step3Desc: 'Share your link with your network.',
            step4Title: 'Earn Commission',
            step4Desc: 'Get paid for every successful sign-up.',
            dashboardAlt: 'Affiliate Dashboard',
        },
        testimonials: {
            badge: 'Testimonials',
            title: 'Trusted by Businesses Across Africa',
            subtitle: 'See what our customers have to say',
        },
        cta: {
            title: 'Ready to Transform Your Business?',
            subtitle: 'Join thousands of African businesses already using Mesob',
            button: 'Start Your Free Trial',
            feature1Title: 'GDPR Compliant',
            feature1Desc: 'Enterprise-grade security with complete tenant isolation',
            feature2Title: 'Quick Setup',
            feature2Desc: 'Get started in under an hour with guided onboarding',
            feature3Title: '24/7 Support',
            feature3Desc: 'AI and human support always available to help',
        },
        footer: {
            description: 'AI-powered business management software built for African businesses',
            productTitle: 'Product',
            product1: 'Features',
            product2: 'Pricing',
            product3: 'Integrations',
            product4: 'Updates',
            companyTitle: 'Company',
            company1: 'About Us',
            company2: 'Blog',
            company3: 'Careers',
            company4: 'Contact',
            legalTitle: 'Legal',
            legal1: 'Privacy Policy',
            legal2: 'Terms of Service',
            legal3: 'Cookie Policy',
            supportTitle: 'Support',
            support1: 'Help Center',
            support2: 'Documentation',
            support3: 'API Reference',
            rightsReserved: 'All rights reserved.',
            featureOverview: 'Feature overview',
            aiSolutions: 'AI solutions',
            pricing: 'Pricing',
            contact: 'Contact',
            affiliates: 'Affiliates',
            privacyPolicy: 'Privacy policy',
            termsOfService: 'Terms of service',
            privacy: 'Privacy',
            terms: 'Terms',
            support: 'Support',
        },
        contactPage: {
            title: 'Schedule a Demo',
            subtitle: 'Ready to see how Mesob can transform your business operations? Let\'s schedule a personalized demo tailored to your needs.',
            formHeading: 'Request Your Demo',
            nameLabel: 'Full Name*',
            emailLabel: 'Email Address*',
            companyLabel: 'Company/Business Name',
            messageLabel: 'Tell us about your needs',
            messagePlaceholder: 'What challenges are you facing with your business? What features are you most interested in?',
            submitButton: 'Schedule My Demo',
            submitting: 'Sending Request...',
            successTitle: 'Demo Request Sent!',
            successMessage: 'We\'ll contact you within 24 hours to schedule your personalized demo.',
            contactInfoHeading: 'Get in Touch',
            emailHeading: 'Email',
            emailText: 'nahomkeneni4@gmail.com',
            emailResponseTime: 'We respond within 24 hours',
            phoneHeading: 'Phone',
            phoneText: '+251983446134',
            phoneHours: 'Mon-Fri, 9AM-6PM EAT',
            officeHeading: 'Office',
            officeAddress: 'Bole, Addis Ababa, Ethiopia',
            officeHours: 'Business Hours: Monday - Friday, 8:30 AM - 5:30 PM (East Africa Time)',
            demoExpectationsHeading: 'What to Expect in Your Demo',
            demoExpectation1: '• 30-minute personalized walkthrough',
            demoExpectation2: '• See features specific to your business type',
            demoExpectation3: '• Live Q&A with our product experts',
            demoExpectation4: '• Custom pricing discussion',
            demoExpectation5: '• Implementation timeline and support',
        },
        privacyPage: {
            pageTitle: 'Privacy Policy',
            pageSubtitle: 'Your privacy matters to us. This policy explains how Mesob AI collects, uses, and protects your personal information.',
            lastUpdated: 'Last updated:',
            section1Heading: 'Information We Collect',
            section1Body: 'We collect business information you provide during registration including business name, owner details, TIN (Tax Identification Number), trade license, contact information, and bank account details for payment processing. We also collect transaction data, inventory records, and usage logs to provide our services effectively.',
            section2Heading: 'How We Use Your Information',
            section2Body: 'Your information is used to provide platform services, process payments through Ethiopian banking systems, generate tax-compliant receipts, manage inventory, facilitate supplier connections, and provide AI-powered business insights. We comply with Ethiopian commercial regulations and never sell your personal or business data to third parties.',
            section3Heading: 'Data Storage and Security',
            section3Body: 'Your data is stored securely with encryption both in transit and at rest. We implement multi-factor authentication, regular security audits, and access controls. While our infrastructure may utilize international cloud services, we ensure compliance with Ethiopian data protection standards and maintain data sovereignty where required by law.',
            section4Heading: 'Compliance with Ethiopian Laws',
            section4Body: 'We operate in full compliance with Ethiopian commercial law, tax regulations, and business licensing requirements. We maintain records as required by the Ministry of Trade and Industry and Ethiopian Revenue and Customs Authority. Business transaction data is retained according to Ethiopian legal requirements (minimum 5 years for tax purposes).',
            section5Heading: 'Data Sharing and Disclosure',
            section5Body: 'We share data only with trusted service providers (payment processors, SMS providers, cloud hosting) under strict confidentiality agreements. We may disclose information to Ethiopian government authorities when legally required (tax audits, regulatory compliance, court orders). We do not share your business data with competitors or unauthorized third parties.',
            section6Heading: 'Payment and Financial Data',
            section6Body: 'Payment processing is handled through licensed Ethiopian payment service providers. We store bank account information securely for subscription billing and supplier payments. All financial transactions comply with National Bank of Ethiopia regulations and anti-money laundering requirements.',
            section7Heading: 'Your Rights',
            section7Body: 'You have the right to access, correct, or delete your personal data. You can export your business data at any time through your account settings. For data deletion requests, we will comply within 30 days while maintaining records required by Ethiopian law. You can withdraw consent for marketing communications at any time.',
            section8Heading: 'Business Data Ownership',
            section8Body: 'You retain full ownership of your business data including inventory records, customer information, sales data, and financial records. Upon account termination, you can export all your data. We act as a data processor on your behalf and do not claim ownership of your business information.',
            section9Heading: 'Cookies and Tracking',
            section9Body: 'We use essential cookies for authentication and session management, and analytics cookies to improve platform performance. No third-party advertising cookies are used. You can manage cookie preferences in your browser settings, though essential cookies are required for platform functionality.',
            section10Heading: 'Updates to This Policy',
            section10Body: 'We may update this policy to reflect changes in Ethiopian regulations or our services. Material changes will be communicated via email and in-app notifications at least 14 days before taking effect. Continued use after the effective date constitutes acceptance of the updated policy.',
            contactUsHeading: 'Contact Us',
            contactUsIntro: 'If you have questions about this Privacy Policy or how we handle your data, please contact us:',
            contactEmail: 'Email:',
            contactPhone: 'Phone: +251983446134',
            contactAddress: 'Address: Bole, Addis Ababa, Ethiopia',
            contactBusinessHours: 'Business Hours: Monday - Friday, 8:30 AM - 5:30 PM (East Africa Time)',
            termsLink: 'Read our Terms of Service →',
        },
        cookieConsent: {
            title: 'We use cookies',
            description: 'We use essential cookies for authentication and analytics cookies to improve your experience.',
            learnMore: 'Learn more',
            decline: 'Decline',
            accept: 'Accept',
        },
        auth: {
            signIn: 'Sign In',
            signUp: 'Sign Up',
            emailOrPhone: 'Email or phone',
            password: 'Password',
            forgotPassword: 'Forgot password?',
            rememberMe: 'Remember me',
            dontHaveAccount: "Don't have an account?",
            createOne: 'Create one',
            alreadyHaveAccount: 'Already have an account?',
            termsAndPrivacy: 'By signing in you agree to our',
            terms: 'Terms',
            privacy: 'Privacy Policy',
            verificationCode: 'Verification Code',
            checkEmail: 'Check your email for the verification code',
            verifyCode: 'Verify Code',
            verifying: 'Verifying...',
            sendingCode: 'Sending code...',
            backToSignIn: 'Back to Sign In',

            ownerSignInTitle: 'Business Owner Sign In',
            ownerSignInSubtitle: 'Access your business dashboard, manage operations, and track performance.',
            ownerWelcome: 'Welcome back — enter your credentials to continue.',

            supplierSignInTitle: 'Supplier Sign In',
            supplierSignInSubtitle: 'Manage your products, orders, and connect with businesses.',
            supplierWelcome: 'Welcome back — sign in to your supplier portal.',

            affiliateSignInTitle: 'Affiliate Sign In',
            affiliateSignInSubtitle: 'Track your referrals, earnings, and performance.',
            affiliateWelcome: 'Welcome back — sign in to your affiliate dashboard.',

            businessName: 'Business Name',
            tinNumber: 'TIN Number',
            phoneNumber: 'Phone Number',
            address: 'Business Address',
            licenseDocument: 'Business License Document',
            registerOwner: 'Register as Owner',
            registerSupplier: 'Register as Supplier',
            registerAffiliate: 'Register as Affiliate',
            ownerRegisterTitle: 'Start your business management journey',
            ownerRegisterSubtitle: 'Join thousands of business owners who trust our AI-powered platform.',
            supplierRegisterTitle: 'Expand your market reach',
            supplierRegisterSubtitle: 'Connect with thousands of businesses and grow your sales.',
            affiliateRegisterTitle: 'Start earning with Mesob',
            affiliateRegisterSubtitle: 'Join our affiliate program and earn recurring commissions.',

            resetPasswordTitle: 'Reset Password',
            resetPasswordSubtitleEmail: 'Enter your email to receive a reset code',
            resetPasswordSubtitleCode: 'Enter the code and your new password',
            sendResetCode: 'Send Reset Code',
            resetCode: 'Reset Code',
            newPassword: 'New Password',
            confirmPassword: 'Confirm Password',
            resetPasswordButton: 'Reset Password',
            didntReceiveCode: "Didn't receive code? Try again",
        },
    },
    am: {
        nav: {
            home: 'መነሻ',
            features: 'ባህሪያት',
            solutions: 'መፍትሄዎች',
            howItWorks: 'እንዴት ይሰራል',
            security: 'ደህንነት',
            pricing: 'ዋጋ',
            contact: 'ያግኙን',
            integrations: 'ግንኙነቅች',
            blog: 'ብሎግ',
            signIn: 'ግባ',
            startFreeTrial: 'ነጻ ሙከራ ጀምር',
            dashboard: 'ዳሽቦርድ',
            signOut: 'ውጣ',
        },
        hero: {
            badge1: 'በ AI የንግድ አብዮት',
            badge2: 'በኢትዮጵያ ለአፍሪካ የተገነባ',
            title1: 'ንግድዎን',
            title2: 'ይቀይሩ',
            title3: 'በ AI የሚሰራ የአስተዳደር ሶፍትዌር',
            cta1: '30-ቀን ነጻ ሙከራ ጀምር',
            cta2: 'ማሳያ ተመልከት',
            stat1Value: '30 ቀናት',
            stat1Label: 'ነጻ ሙከራ',
            stat2Value: '24/7',
            stat2Label: 'AI ድጋፍ',
            stat3Value: '>99.9%',
            stat3Label: 'አገልግሎት ጊዜ',
        },
        problemSolution: {
            title: 'የአፍሪካ ንግዶች የሚገጥማቸው ፈተና',
            subtitle: 'እና እንዴት እንፈታዋለን',
            problem1Title: 'የእጅ ሂደቶች',
            problem1Desc: 'ጊዜ የሚወስድ ወረቀት ስራና በእጅ መረጃ ማስገባት ንግድዎን ያዘገያል',
            problem2Title: 'ውሱን ግንዛቤ',
            problem2Desc: 'ዕቃዎችን፣ ሽያጮችን እና የንግድ አፈጻጸምን በእውነተኛ ጊዜ መከታተል አስቸጋሪ ነው',
            problem3Title: 'የተለያዩ ስርዓቶች',
            problem3Desc: 'አንድ ላይ የማይሰሩ በርካታ መሳሪያዎች ብቃትን ይቀንሳሉ',
            solution1Title: 'ራስ-ሰር የሥራ ሂደቶች',
            solution1Desc: 'በ AI የሚሰራ ራስ-ሰር ቴክኖሎጂ ተደጋጋሚ ሥራዎችን በመቆጣጠር ለእድገት ጊዜ ይሰጣል',
            solution2Title: 'በእውነተኛ ጊዜ ትንታኔ',
            solution2Desc: 'ስለ ንግድዎ አፈጻጸም ወዲያውኑ ግንዛቤ በዘመናዊ ዳሽቦርድ',
            solution3Title: 'ሁሉም-በ-አንድ መድረክ',
            solution3Desc: 'በአንድ ቦታ የሚፈልጉት ሁሉ - ዕቃዎች፣ ሽያጮች፣ የሰው ኃይል እና ሌሎችም',
            intro: 'ባህላዊ የንግድ አሰራር የኢትዮጵያን ንግዶች ወደኋላ እየጎተተ ነው። አሁን ለለውጥ ጊዜው ነው።',
            oldWay: 'የድሮው አሰራር ችግሮች',
            mesobWay: 'የመሶብ አሰራር',
        },
        features: {
            badge: 'ኃይለኛ ባህሪያት',
            title: 'የሚፈልጉት ሁሉ በአንድ መድረክ',
            subtitle: 'ለኢትዮጵያ ሱቆች፣ መድኃኒት ቤቶች እና የችርቻሮ ንግዶች የተዘጋጀ የተሟላ ዘመናዊ የንግድ አስተዳደር ስርዓት።',
            feature1Title: 'ባለብዙ-ቅርንጫፍ አስተዳደር',
            feature1Desc: 'ሁሉንም የመደብር ቦታዎችዎን ከአንድ ወጥ ዳሽቦርድ ያስተዳድሩ። በእያንዳንዱ ቅርንጫፍ ላይ ስለ እቃዎች፣ ሽያጮች እና አፈጻጸም የእውነተኛ ጊዜ እይታ ያግኙ።',
            feature2Title: 'የሰራተኞች እና የቡድን አስተዳደር',
            feature2Desc: 'ብጁ ፈቃዶች ያላቸው የሰራተኛ መለያዎችን ይፍጠሩ፣ እንቅስቃሴዎችን ይከታተሉ እና በድርጅትዎ ውስጥ በተጠያቂነት ላይ የተመሰረተ ተጠያቂነትን ያረጋግጡ።',
            feature3Title: 'የአንድ ጠቅታ ግንኙነቶች',
            feature3Desc: 'ከ Google Sheets፣ ERP ስርዓቶች፣ የሂሳብ ሶፍትዌር እና ሌሎችም ጋር በሰላም ይገናኙ። ምንም ቴክኒካዊ እውቀት አያስፈልግም - ነባር መሳሪያዎችዎን ለማገናኘት አንድ ጠቅታ ብቻ።',
            feature4Title: 'ብልጥ ወጪ እና ግብ ክትትል',
            feature4Desc: 'የክፍያ ቀነ-ገደብ በጭራሽ አያምልጥዎ። መሶብ የግብር ክፍያዎችን፣ የሰራተኛ ደመወዝን፣ ኪራይን፣ የፍቃድ እድሳትን እና ሁሉንም የንግድ ወጪዎችን በራስ-ሰር ይከታተላል እና ያስታውስዎታል።',
            feature5Title: 'የአቅራቢዎች ገበያ',
            feature5Desc: 'ምርቶቻቸውን በዳሽቦርድዎ ላይ ከሚያስተዋውቁ የተረጋገጡ አቅራቢዎች ጋር በቀጥታ ይገናኙ። አዳዲስ ምርቶችን ያግኙ፣ ዋጋዎችን ያወዳድሩ እና በልበ ሙሉነት ይዘዙ።',
            quickFeature1: 'የእውነተኛ ጊዜ ትንታኔ',
            quickFeature2: 'ራስ-ሰር ማንቂያዎች',
            quickFeature3: 'የእቃ ዝውውሮች',
            quickFeature4: 'የሽያጭ ትንበያ',
        },
        ai: {
            badge: 'በ AI የሚሰራ እውቀት',
            title: 'ንግድዎ በ AI ተጠናክሯል',
            subtitle: 'በየቀኑ 24/7 ለእርስዎ የሚሰራ ብልህ ራስ-ሰር አገልግሎት',
            feature1Title: 'ብልህ ትንበያዎች',
            feature1Desc: 'AI ፍላጐትን ይተነብያል፣ ዕቃዎችን ያመቻቻል እና አዝማሚያዎችን ያሳያል',
            feature2Title: 'ራስ-ሰር ግንዛቤዎች',
            feature2Desc: 'ንግድዎን ለማሻሻል ተግባራዊ ምክሮችን ያግኙ',
            feature3Title: 'ብልህ ድጋፍ',
            feature3Desc: 'ጥያቄዎችን ለመመለስ እና በስራዎች ለመርዳት 24/7 AI ረዳት',
            cta: 'በ AI የሚሰራ ንግድ ይለማመዱ',
            chat1Question: '"የመድኃኒት ቤቴ ክምችት በዚህ ወር እንዴት ነው?"',
            chat1Answer: 'መድኃኒት ቤትዎ ካለፈው ወር ጋር ሲነጻጸር የ 23% የሽያጭ ጭማሪ አሳይቷል። ሆኖም፣ አንቲባዮቲክስ እያለቀብዎት እንደሆነ አስተውያለሁ። አሁን ባለው አዝማሚያ መሰረት፣ እጥረትን ለማስወገድ በሚቀጥሉት 3 ቀናት ውስጥ 150 አሞክሲሲሊን እንዲያዝዙ እመክራለሁ።',
            chat2Question: '"የትኞቹ ምርቶች ዝቅተኛ አፈጻጸም እያሳዩ ነው?"',
            chat2Answer: 'በ 60 ቀናት ውስጥ ያልተሸጡ 45,000 ብር ዋጋ ያላቸው 12 ቀስ ብለው የሚንቀሳቀሱ እቃዎችን ለይቻለሁ። ለእነዚህ እቃዎች ማስተዋወቂያ እንዲያካሂዱ ወይም የማዘዣ ስልትዎን እንዲያስተካክሉ እመክራለሁ።',
            imageAlt: 'በ AI የሚሰራ የመድኃኒት ቤት አስተዳደር',
        },
        howItWorks: {
            badge: 'ቀላል ሂደት',
            title: 'መሶብ እንዴት ይሰራል',
            subtitle: 'ንግድዎን ለመቀየር ሶስት ቀላል እርምጃዎች',
            step1Title: 'ፈጣን ቅንብር',
            step1Desc: 'በደቂቃዎች ውስጥ በቀላሉ ይጀምሩ እና ከነባር ስርዓቶችዎ ጋር በሰላም ያገናኙ።',
            step2Title: 'ብልጥ ትንታኔ',
            step2Desc: 'በ AI የሚሰሩ ግንዛቤዎች በእውነተኛ ጊዜ ትንታኔ እና ትንበያዎች የተሻሉ ውሳኔዎችን እንዲወስኑ ይረዱዎታል።',
            step3Title: 'ያሳድጉ እና ይመንጠቁ',
            step3Desc: 'በባለብዙ ቅርንጫፍ ድጋፍ፣ በራስ-ሰር የሥራ ሂደቶች እና በተከታታይ ማሻሻያ በልበ ሙሉነት ያስፋፉ።',
            imageAlt1: 'የዳሽቦርድ አጠቃላይ እይታ',
            imageAlt2: 'የ AI ረዳት በይነገጽ',
            imageAlt3: 'የባለቤት አጠቃላይ እይታ',
        },
        pricing: {
            badge: 'ተለዋዋጭ ዋጋ',
            title: 'ለንግድዎ ፍጹም እቅድ ይምረጡ',
            subtitle: 'በ 30-ቀን ነጻ ሙከራ ይጀምሩ። የክሬዲት ካርድ አያስፈልግም።',
            monthly: 'በወር',
            annually: 'በዓመት',
            saveLabel: '20% ይቆጥቡ',
            perMonth: '/ወር',
            startTrial: 'ነጻ ሙከራ ጀምር',
            getStarted: 'ይጀምሩ',
            contactSales: 'ሽያጮችን ያነጋግሩ',
            mostPopular: 'በጣም ተወዳጅ',
            starterName: 'መነሻ',
            starterDesc: 'አሁን ለሚጀምሩ ትናንሽ ንግዶች ፍጹም',
            professionalName: 'ሙያዊ',
            professionalDesc: 'የላቁ ባህሪያትን ለሚፈልጉ እያደጉ ላሉ ንግዶች',
            enterpriseName: 'ድርጅታዊ',
            enterpriseDesc: 'ለትላልቅ ድርጅቶች ብጁ መፍትሄዎች',
            feature1: 'እስከ 5 ተጠቃሚዎች',
            feature2: 'መሠረታዊ የዕቃ አስተዳደር',
            feature3: 'የሽያጭ ክትትል',
            feature4: 'የኢሜይል ድጋፍ',
            feature5: 'ያልተገደቡ ተጠቃሚዎች',
            feature6: 'የላቁ ትንታኔዎች',
            feature7: 'API መዳረሻ',
            feature8: 'ቅድሚያ ያለው ድጋፍ',
            feature9: 'ብጁ ግንኙነቶች',
            footerText: '© 2024 መሶብ. መብቱ በህግ የተጠበቀ ነው።',
            ownerCta: 'እንደ ባለቤት ይግቡ',
            supplierCta: 'እንደ አቅራቢ ይግቡ',
            contactUs: 'ያግኙን',
        },
        pwaInstall: {
            installApp: 'መተግበሪያውን ይጫኑ',
            installTitle: 'መሶብን ይጫኑ',
            installDescription: 'ለተሻለ ተሞክሮ መተግበሪያውን ወደ መነሻ ስክሪንዎ ያክሉ።',
            iosStep1: 'የማጋራት አዶውን ይንኩ',
            iosStep2: '"ወደ መነሻ ገጽ አክል"ን ይምረጡ',
            androidStep1: 'የምናሌ አዶውን ይንኩ',
            androidStep2: '"መተግበሪያን ይጫኑ"ን ይምረጡ',
            desktopStep1: 'የመጫን አዶውን ጠቅ ያድርጉ',
            desktopStep2: 'በአድራሻ አሞሌው ውስጥ',
            firefoxMessage: 'መተግበሪያውን ለመጫን እባክዎ Chrome ወይም Edge ይጠቀሙ',
            defaultMessage: 'ይህ አሳሽ መተግበሪያውን መጫን አይደግፍም',
            gotIt: 'ገባኝ',
        },
        integrations: {
            badge: 'ቀላል ግንኙነቶች',
            title: 'ከሚወዷቸው መሳሪያዎች ጋር ይገናኙ',
            subtitle: 'ከታዋቂ ክፍያ፣ የሂሳብ አያያዝ እና የንግድ መሳሪያዎች ጋር ይቀላቀሉ',
            viewAll: 'ሁሉንም ግንኙነቶች ይመልከቱ',
            effortlessTitle: 'ቀላል ውህደት',
            effortlessDesc: 'በተለያዩ መድረኮች መባከን ይቁም። መሶብ AI ከነባር መሳሪያዎችዎ ጋር በሰላም ይገናኛል፣ ለንግድ ስራዎ አንድ ወጥ የሆነ ሥርዓት ይፈጥራል።',
            benefit1: 'ለሁሉም ውህደቶች የአንድ ጠቅታ ቅንብር',
            benefit2: 'የእውነተኛ ጊዜ መረጃ ማመሳሰል',
            benefit3: 'ደህንነቱ የተጠበቀ፣ የተመሰጠረ ግንኙነት',
            benefit4: 'ምንም ቴክኒካዊ እውቀት አያስፈልግም',
            requestTitle: 'መሳሪያዎን አላገኙትም?',
            requestLink: 'ብጁ ውህደት ይጠይቁ',
            googleSheetsDesc: 'ለቀላል ትንታኔ እና ማጋራት ሪፖርቶችን ይላኩ እና የዕቃ ዝርዝር መረጃን በቀጥታ ከ Google Sheets ያመሳስሉ።',
            sapDesc: 'ለድርጅት ደረጃ የፋይናንስ እና የአሠራር አስተዳደር ከ SAP ERP ስርዓቶች ጋር በሰላም ይዋሃዱ።',
            odooDesc: 'ለተዋሃደ የዕቃ፣ የሽያጭ እና የሂሳብ አያያዝ የሥራ ሂደቶች ከ Odoo አጠቃላይ የንግድ ስብስብ ጋር ይገናኙ።',
        },
        affiliate: {
            badge: 'የአጋር መርሃ ግብር',
            title: 'መሶብን በማጋራት ያትርፉ',
            subtitle: 'የአጋር መርሃ ግብራችንን ይቀላቀሉ እና ተደጋጋሚ ኮሚሽን ያትርፉ',
            benefit1Title: 'ከፍተኛ ኮሚሽን ያግኙ',
            benefit1Desc: 'ለእያንዳንዱ ስኬታማ ሪፈራል ተወዳዳሪ ኮሚሽን ያግኙ።',
            benefit2Title: 'ቀላል አገናኝ ማጋራት',
            benefit2Desc: 'ልዩ የሪፈራል አገናኝዎን ወዲያውኑ ያመንጩ እና በየትኛውም ቦታ ያጋሩ።',
            benefit3Title: 'ድርብ የገቢ ምንጭ',
            benefit3Desc: 'ከአቅራቢዎች እና ከንግድ ባለቤቶች ምዝገባ ያትርፉ።',
            benefit4Title: 'የእውነተኛ ጊዜ ክትትል',
            benefit4Desc: 'ሪፈራሎችዎን እና ገቢዎን በእውነተኛ ጊዜ ዳሽቦርድ ይከታተሉ።',
            cta: 'የአጋር መርሃ ግብርን ይቀላቀሉ',
            howItWorksTitle: 'እንዴት እንደሚሰራ',
            step1Title: 'በነጻ ይመዝገቡ',
            step1Desc: 'የአጋር መለያዎን በደቂቃዎች ውስጥ ይፍጠሩ።',
            step2Title: 'አገናኝዎን ያመንጩ',
            step2Desc: 'ልዩ የሪፈራል አገናኝዎን ከዳሽቦርድዎ በአንድ ጠቅታ ያግኙ።',
            step3Title: 'ያጋሩ እና ያስተዋውቁ',
            step3Desc: 'አገናኝዎን ለኔትወርክዎ ያጋሩ።',
            step4Title: 'ኮሚሽን ያግኙ',
            step4Desc: 'ለእያንዳንዱ ስኬታማ ምዝገባ ክፍያ ያግኙ።',
            dashboardAlt: 'የአጋር ዳሽቦርድ',
        },
        testimonials: {
            badge: 'ምስክርነቶች',
            title: 'በመላ አፍሪካ ባሉ ንግዶች የታመነ',
            subtitle: 'ደንበኞቻችን የሚሉትን ይመልከቱ',
        },
        cta: {
            title: 'ንግድዎን ለመቀየር ዝግጁ ነዎት?',
            subtitle: 'መሶብን በመጠቀም ላይ ካሉ በሺዎች የሚቆጠሩ የአፍሪካ ንግዶች ጋር ይቀላቀሉ',
            button: 'ነጻ ሙከራዎን ይጀምሩ',
            feature1Title: 'GDPR ታዛዥ',
            feature1Desc: 'ከፍተኛ ደረጃ ያለው ደህንነት ከሙሉ የግል መረጃ ጥበቃ ጋር',
            feature2Title: 'ፈጣን ቅንብር',
            feature2Desc: 'በአንድ ሰዓት ውስጥ በተመራ አጀማመር ይጀምሩ',
            feature3Title: '24/7 ድጋፍ',
            feature3Desc: 'AI እና የሰው ድጋፍ ሁልጊዜ ለመርዳት ዝግጁ ናቸው',
        },
        footer: {
            description: 'ለአፍሪካ ንግዶች የተገነባ በ AI የሚሰራ የንግድ አስተዳደር ሶፍትዌር',
            productTitle: 'ምርት',
            product1: 'ባህሪያት',
            product2: 'ዋጋ',
            product3: 'ግንኙነቶች',
            product4: 'ማሻሻያዎች',
            companyTitle: 'ኩባንያ',
            company1: 'ስለ እኛ',
            company2: 'ብሎግ',
            company3: 'ሥራዎች',
            company4: 'ያግኙን',
            legalTitle: 'ሕጋዊ',
            legal1: 'የግላዊነት ፖሊሲ',
            legal2: 'የአገልግሎት ውል',
            legal3: 'የኩኪ ፖሊሲ',
            supportTitle: 'ድጋፍ',
            support1: 'የእገዛ ማእከል',
            support2: 'ሰነዶች',
            support3: 'API ማጣቀሻ',
            rightsReserved: 'መብቱ በህጋ የተጠበቀ ነው።',
            featureOverview: 'የባህሪ አጠቃላይ እይታ',
            aiSolutions: 'AI መፍትሄዎች',
            pricing: 'ዋጋ',
            contact: 'ያግኙን',
            affiliates: 'አጋሮች',
            privacyPolicy: 'የግላዊነት ፖሊሲ',
            termsOfService: 'የአገልግሎት ውል',
            privacy: 'ግላዊነት',
            terms: 'ውሎች',
            support: 'ድጋፍ',
        },
        contactPage: {
            title: 'ማሳያ በቀጠሮ ይቀርቡ',
            subtitle: 'መሶብ የንግድዎን ሥራዎች እንዴት ሊቀይር እንደሚችል ለማየት ዝግጁ ነዎት? ለፍላጎትዎ የተበጀ ግላዊ ማሳያ እናቀናጅ።',
            formHeading: 'ማሳያዎን ይጠይቁ',
            nameLabel: 'ሙሉ ስም*',
            emailLabel: 'ኢሜይል አድራሻ*',
            companyLabel: 'ኩባንያ/የንግድ ስም',
            messageLabel: 'ፍላጎቶችዎን ያሳውቁን',
            messagePlaceholder: 'በንግድዎ ምን ፈተናዎች እያጋጠሙዎት ነው? በየትኛው ባህሪያት ላይ በጣም ፍላጎት አለዎት?',
            submitButton: 'ማሳያዬን አቅርብ',
            submitting: 'ጥያቄ እየላከ...',
            successTitle: 'የማሳያ ጥያቄ ተልኳል!',
            successMessage: 'ግላዊ ማሳያዎን ለማቀናጀት በ24 ሰዓቶች ውስጥ እናገናኝዎታለን።',
            contactInfoHeading: 'ያግኙን',
            emailHeading: 'ኢሜይል',
            emailText: 'nahomkeneni4@gmail.com',
            emailResponseTime: 'በ24 ሰዓቶች ውስጥ እንመልሳለን',
            phoneHeading: 'ስልክ',
            phoneText: '+251983446134',
            phoneHours: 'ሰኞ-አርብ፣ 9AM-6PM EAT',
            officeHeading: 'ቢሮ',
            officeAddress: 'ቦሌ፣ አዲስ አበባ፣ ኢትዮጵያ',
            officeHours: 'የንግድ ሰዓቶች፡ ሰኞ - አርብ፣ 8:30 ጥዋት - 5:30 ከሰዓት (የምስራቅ አፍሪካ ሰዓት)',
            demoExpectationsHeading: 'በማሳያዎ ውስጥ ምን መጠበቅ እንደሚገባ',
            demoExpectation1: '• 30-ደቂቃ ግላዊ ዝርዝር',
            demoExpectation2: '• ለንግድዎ አይነት የተለዩ ባህሪያትን ይመልከቱ',
            demoExpectation3: '• ከምርት ባለሙያዎቻችን ጋር ቀጥታ ጥያቄ እና መልስ',
            demoExpectation4: '• ብጁ የዋጋ ውይይት',
            demoExpectation5: '• የአፈጻጸም የጊዜ መርሐግብርና ድጋፍ',
        },
        privacyPage: {
            pageTitle: 'የግላዊነት ፖሊሲ',
            pageSubtitle: 'ግላዊነትዎ ለእኛ አስፈላጊ ነው። ይህ ፖሊሲ መሶብ AI ግላዊ መረጃዎን እንዴት እንደሚሰበስብ፣ እንደሚጠቀምበት እና እንደሚጠብቅ ያብራራል።',
            lastUpdated: 'ለመጨረሻ ጊዜ የተዘመነው፡',
            section1Heading: 'የምንሰበስባቸው መረጃዎች',
            section1Body: 'በምዝገባ ወቅት የሚሰጡትን የንግድ ስም፣ የባለቤት ዝርዝሮች፣ የግብር መታወቂያ ቁጥር (TIN)፣ የንግድ ፍቃድ፣ ዕውቂያ መረጃ እና ለክፍያ ሂደት የባንክ ሂሳብ ዝርዝሮችን እንሰበስባለን። እንዲሁም አገልግሎቶቻችንን በብቃት ለመስጠት የግብይት መረጃ፣ የዕቃ መዝገቦች እና የአጠቃቀም ምዝገባዎችን እንሰበስባለን።',
            section2Heading: 'መረጃዎን እንዴት እንጠቀማለን',
            section2Body: 'መረጃዎ የመድረክ አገልግሎቶችን ለመስጠት፣ በኢትዮጵያ የባንክ ስርዓቶች ክፍያዎችን ለማስኬድ፣ ከግብር ጋር የሚጣጣሙ ደረሰኞችን ለማመንጨት፣ ዕቃዎችን ለማስተዳደር፣ የአቅራቢ ግንኙነቶችን ለማመቻቸት እና በ AI የሚሰሩ የንግድ ግንዛቤዎችን ለመስጠት ይጠቀማል። ከኢትዮጵያ የንግድ ህጎች ጋር እንታዘዋለን እና ግላዊ ወይም የንግድ መረጃዎን ለሶስተኛ ወገኖች በጭራሽ አንሸጥም።',
            section3Heading: 'የመረጃ ማከማቻና ደህንነት',
            section3Body: 'መረጃዎ በሚጓዝበት ጊዜና በሚቆይበት ቦታ መረጃ በመሸፈን በደህንነት ይቀመጣል። ብዙ ደረጃ ማረጋገጫ፣ መደበኛ የደህንነት ምርመራዎችና የመዳረሻ መቆጣጠሪያዎችን እንተገብራለን። መሠረተ ልማታችን ዓለም አቀፋዊ የደመና አገልግሎቶችን ሊጠቀም ቢችልም፣ ከኢትዮጵያ የመረጃ ጥበቃ ደረጃዎች ጋር መጣጣምን እናረጋግጣለን እና በሕግ አስፈላጊ ሲሆን የመረጃ ሉዓላዊነትን እንጠብቃለን።',
            section4Heading: 'ከኢትዮጵያ ህጎች ጋር መጣጣም',
            section4Body: 'ከኢትዮጵያ የንግድ ሕግ፣ የግብር ደንቦችና የንግድ ፍቃድ መስፈርቶች ጋር ሙሉ በሙሉ በመጣጣም እንሰራለን። በንግድና ኢንዱስትሪ ሚኒስቴርና በኢትዮጵያ ገቢና ጉምሩክ ባለስልጣን እንደሚፈለገው መዝገቦችን እንይዛለን። የንግድ ግብይት መረጃ እንደ ኢትዮጵያ የሕግ መስፈርቶች (ለግብር አላማ ቢያንስ 5 ዓመት) ይቀመጣል።',
            section5Heading: 'የመረጃ ማጋራትና መግለጽ',
            section5Body: 'መረጃ የምናጋራው በጥብቅ ሚስጥራዊነት ስምምነት ከታመኑ የአገልግሎት አቅራቢዎች (የክፍያ ሂደት አቅራቢዎች፣ የኤስኤምኤስ አቅራቢዎች፣ የደመና ማስተናገድ) ጋር ብቻ ነው። በሕግ አስፈላጊ ሲሆን (የግብር ምርመራዎች፣ የቁጥጥር መጣጣም፣ የፍርድ ቤት ትዕዛዞች) መረጃን ለኢትዮጵያ የመንግስት ባለስልጣናት ማሳወቅ እንችላለን። የንግድ መረጃዎን ከተወዳዳሪዎች ወይም ከፈቃድ ሌላም ሶስተኛ ወገኖች አናጋራም።',
            section6Heading: 'የክፍያና የፋይናንስ መረጃ',
            section6Body: 'የክፍያ ሂደት የሚከናወነው ፍቃድ ባላቸው የኢትዮጵያ የክፍያ አገልግሎት አቅራቢዎች በኩል ነው። ለደንበኝነት ቢሊንግና ለአቅራቢ ክፍያዎች የባንክ ሂሳብ መረጃ በደህንነት እናስቀምጣለን። ሁሉም የፋይናንስ ግብይቶች ከናሽናል ባንክ ኦፍ ኢትዮጵያ ደንቦችና ከገንዘብ ማጭበርበር ተቃዋሚ መስፈርቶች ጋር የሚጣጣሙ ናቸው።',
            section7Heading: 'መብቶችዎ',
            section7Body: 'ግላዊ መረጃዎን የመድረስ፣ የማረም ወይም የማጥፋት መብት አለዎት። የንግድ መረጃዎን በማንኛውም ጊዜ በመለያ ቅንጅቶችዎ በኩል መላክ ይችላሉ። ለመረጃ ማጥፊያ ጥያቄዎች፣ በኢትዮጵያ ሕግ የሚፈለጉ መዝገቦችን እየጠበቅን በ30 ቀናት ውስጥ እንታዘባለን። ለማርኬቲንግ ግንኙነቶች ፈቃድ በማንኛውም ጊዜ መልቀቅ ይችላሉ።',
            section8Heading: 'የንግድ መረጃ ባለቤትነት',
            section8Body: 'የእቃ መዝገቦችን፣ የደንበኞች መረጃን፣ የሽያጭ መረጃንና የ ፋይናንስ መዝገቦችን ጨምሮ ሙሉ የንግድ መረጃዎን ባለቤትነት ያዙ። መለያ ሲዘጋ ሁሉንም መረጃዎን መላክ ይችላሉ። በእርስዎ ወክሎ እንደ መረጃ ሂደተኛ እንሰራለን እና የንግድ መረጃዎን ባለቤትነት አንጠይቅም።',
            section9Heading: 'ኩኪዎችና ክትትል',
            section9Body: 'ለማረጋገጫና ለክፍለ ጊዜ አስተዳደር አስፈላጊ ኩኪዎችን፣ እና የመድረክ አፈጻጸምን ለማሻሻል የትንታኔ ኩኪዎችን እንጠቀማለን። የሶስተኛ ወገን ማስታወቂያ ኩኪዎች አይጠቀሙም። ለመድረክ ተግባራዊነት አስፈላጊ ኩኪዎች ቢያስፈልጉም በአሳሽ ቅንብሮችዎ ውስጥ የኩኪ ምርጫዎችን ማስተዳደር ይችላሉ።',
            section10Heading: 'ለዚህ ፖሊሲ ማሻሻያዎች',
            section10Body: 'ይህን ፖሊሲ በኢትዮጵያ ደንቦች ወይም በአገልግሎቶቻችን ላይ ላሉ ለውጦች ለማንጸባረቅ ማሻሻል እንችላለን። አስፈላጊ ለውጦች ከመተግበራቸው ቢያንስ 14 ቀናት በፊት በኢሜይልና በመተግበሪያው ማሳሰቢያዎች ይገለጻሉ። ከተግባራዊ ቀን በኋላ መቀጠል የአዲሱን ፖሊሲ መቀበል ያመለክታል።',
            contactUsHeading: 'ያግኙን',
            contactUsIntro: 'ስለዚህ የግላዊነት ፖሊሲ ወይም መረጃዎን እንዴት እንደምናስተናግድ ጥያቄዎች ካሉዎት እባክዎ ያግኙን፡',
            contactEmail: 'ኢሜይል፡',
            contactPhone: 'ስልክ፡ +251983446134',
            contactAddress: 'አድራሻ፡ ቦሌ፣ አዲስ አበባ፣ ኢትዮጵያ',
            contactBusinessHours: 'የንግድ ሰዓቶች፡ ሰኞ - አርብ፣ 8:30 ጥዋት - 5:30 ከሰዓት (የምስራቅ አፍሪካ ሰዓት)',
            termsLink: 'የአገልግሎት ውሉችንን ያንብቡ →',
        },
        cookieConsent: {
            title: 'ኩኪዎችን እንጠቀማለን',
            description: 'ለማረጋገጫ እና የተጠቃሚ ተሞክሮዎን ለማሻሻል አስፈላጊ ኩኪዎችን እና የትንታኔ ኩኪዎችን ን እንጠቀማለን።',
            learnMore: 'ተጨማሪ ይወቁ',
            decline: 'አይቀበሉ',
            accept: 'ይቀበሉ',
        },
        auth: {
            signIn: 'ግባ',
            signUp: 'ተመዝገብ',
            emailOrPhone: 'ኢሜይል ወይም ስልክ',
            password: 'የይለፍ ቃል',
            forgotPassword: 'የይለፍ ቃል ረሱ?',
            rememberMe: 'አስታውሰኝ',
            dontHaveAccount: 'መለያ የለዎትም?',
            createOne: 'አዲስ ይፍጠሩ',
            alreadyHaveAccount: 'መለያ አለዎት?',
            termsAndPrivacy: 'በመግባት በሚከተሉት እንስማማለን',
            terms: 'ውሎች',
            privacy: 'የግላዊነት ፖሊሲ',
            verificationCode: 'ማረጋገጫ ኮድ',
            checkEmail: 'ለማረጋገጫ ኮድ ኢሜይልዎን ይፈትሹ',
            verifyCode: 'ኮድ አረጋግጥ',
            verifying: 'በማረጋገጥ ላይ...',
            sendingCode: 'ኮድ በመላክ ላይ...',
            backToSignIn: 'ወደ መግቢያ ተመለስ',

            ownerSignInTitle: 'የንግድ ባለቤት መግቢያ',
            ownerSignInSubtitle: 'የንግድ ዳሽቦርድዎን ይድረሱ፣ ስራዎችን ያስተዳድሩ እና አፈጻጸምን ይከታተሉ።',
            ownerWelcome: 'እንኳን ደህና መጡ — ለመቀጠል መረጃዎን ያስገቡ።',

            supplierSignInTitle: 'አቅራቢ መግቢያ',
            supplierSignInSubtitle: 'ምርቶችዎን፣ ትዕዛዞችዎን ያስተዳድሩ እና ከንግዶች ጋር ይገናኙ።',
            supplierWelcome: 'እንኳን ደህና መጡ — ወደ አቅራቢ መግቢያዎ ይግቡ።',

            affiliateSignInTitle: 'አጋር መግቢያ',
            affiliateSignInSubtitle: 'ሪፈራሎችዎን፣ ገቢዎን እና አፈጻጸምዎን ይከታተሉ።',
            affiliateWelcome: 'እንኳን ደህና መጡ — ወደ አጋር ዳሽቦርድዎ ይግቡ።',

            businessName: 'የንግድ ስም',
            tinNumber: 'የግብር መለያ ቁጥር (TIN)',
            phoneNumber: 'ስልክ ቁጥር',
            address: 'የንግድ አድራሻ',
            licenseDocument: 'የንግድ ፈቃድ ሰነድ',
            registerOwner: 'እንደ ባለቤት ይመዝገቡ',
            registerSupplier: 'እንደ አቅራቢ ይመዝገቡ',
            registerAffiliate: 'እንደ አጋር ይመዝገቡ',
            ownerRegisterTitle: 'የንግድ አስተዳደር ጉዞዎን ይጀምሩ',
            ownerRegisterSubtitle: 'በ AI የተጎላበተውን መድረካችንን የሚያምኑ በሺዎች የሚቆጠሩ የንግድ ባለቤቶችን ይቀላቀሉ።',
            supplierRegisterTitle: 'የገበያ ተደራሽነትዎን ያስፋፉ',
            supplierRegisterSubtitle: 'ከሺዎች ከሚቆጠሩ ንግዶች ጋር ይገናኙ እና ሽያጭዎን ያሳድጉ።',
            affiliateRegisterTitle: 'በመሶብ ማትረፍ ይጀምሩ',
            affiliateRegisterSubtitle: 'የአጋር ፕሮግራማችንን ይቀላቀሉ እና ተደጋጋሚ ኮሚሽኖችን ያግኙ።',

            resetPasswordTitle: 'የይለፍ ቃል ዳግም ያስጀምሩ',
            resetPasswordSubtitleEmail: 'የዳግም ማስጀመሪያ ኮድ ለማግኘት ኢሜይልዎን ያስገቡ',
            resetPasswordSubtitleCode: 'ኮዱን እና አዲሱን የይለፍ ቃል ያስገቡ',
            sendResetCode: 'የዳግም ማስጀመሪያ ኮድ ላክ',
            resetCode: 'የዳግም ማስጀመሪያ ኮድ',
            newPassword: 'አዲስ የይለፍ ቃል',
            confirmPassword: 'የይለፍ ቃል አረጋግጥ',
            resetPasswordButton: 'የይለፍ ቃል ዳግም አስጀምር',
            didntReceiveCode: "ኮድ አልደረሰዎትም? እንደገና ይሞክሩ",
        },
    },
    or: {
        nav: {
            home: 'Man\'ee',
            features: 'Amaloota',
            solutions: 'Furmaata',
            howItWorks: 'Akkamitti Hojjeta',
            security: 'Nageenya',
            pricing: 'Gatii',
            contact: 'Qunnamtii',
            integrations: 'Walitti Makamuu',
            blog: 'Blog',
            signIn: 'Seeni',
            startFreeTrial: 'Yaalii Bilisaa Jalqabi',
            dashboard: 'Dashboard',
            signOut: 'Ba\'i',
        },
        hero: {
            badge1: 'Warraaqsa Daldalaaf AI',
            badge2: 'Itoophiyaatti Ijaarame, Afrikaa',
            title1: 'Daldala Kee',
            title2: 'AI\'n',
            title3: 'Jijjiiri',
            cta1: 'Yaalii Guyyaa 30 Jalqabi',
            cta2: 'Agarsiisa Ilaali',
            stat1Value: 'Guyyaa 30',
            stat1Label: 'Yaalii Bilisaa',
            stat2Value: '24/7',
            stat2Label: 'Gargaarsa AI',
            stat3Value: '>99.9%',
            stat3Label: 'Yeroo Hojii',
        },
        problemSolution: {
            title: 'Rakkoolee Daldaltoonni Afrikaa Mudatan',
            subtitle: 'Akkamitti Furmaata Kenninu',
            problem1Title: 'Adeemsa Harkaa',
            problem1Desc: 'Hojii waraqaa yeroo barbaaduu fi odeeffannoo harkaan galchuu daldala kee suuta godha',
            problem2Title: 'Hubannoo Xiqqaa',
            problem2Desc: 'Qabeenya, gurgurtaa, fi raawwii daldala yeroo dhugaa hordofuun rakkisaa',
            problem3Title: 'Sirna Adda Baafame',
            problem3Desc: 'Meeshaalee hedduu waliin hin hojjenne, bu\'aa hin qabne uumu',
            solution1Title: 'Adeemsa Ofumaa',
            solution1Desc: 'Ofumaan AI hojii irra deebi\'amu qaba, yeroo kee guddina daldalaaf bilisa godha',
            solution2Title: 'Xiinxala Yeroo Dhugaa',
            solution2Desc: 'Battalumatti raawwii daldala keetii hubannoo wajjin dashboard sammuu',
            solution3Title: 'Waltajjii Hundumaa-Tokko',
            solution3Desc: 'Wanti barbaachisu hunda bakka tokkotti - qabeenya, gurgurtaa, HR, fi dabalataan',
            intro: 'Bulchiinsi daldala aadaa daldaltoonni Afrikaa gadi deebisuutti jira. Warraaqsaaf yeroon dhufe.',
            oldWay: 'Rakkoo Karaa Durii',
            mesobWay: 'Karaa Mesob',
        },
        features: {
            badge: 'Amaloota Humnaa',
            title: 'Wanti daldala kee bulchuuf barbaachisu hunduu',
            subtitle: 'Meeshaalee guutuu kan daldaltoonni Afrikaa dhuunfaaf qophaa\'an',
            feature1Title: 'Bulchiinsa Damee Hedduu',
            feature1Desc: 'Bakka kuusaa kee hunda dashboard tokko walitti qabame irraa bulchi. Sadarkaa qabeenya, gurgurtaa, fi raawwii damee hundaa yeroo dhugaa mul\'isaa argadhu.',
            feature2Title: 'Bulchiinsa Hojjetaa & Garee',
            feature2Desc: 'Akkaawuntii hojjetaa hayyama dhuunfaa wajjin uumi, hojii hordofi, fi itti gaafatamummaa dhaabbata kee hayyama gahee irratti hundaa\'e wajjin mirkaneessi.',
            feature3Title: 'Walitti Makuu Cuqaasuu-Tokko',
            feature3Desc: 'Google Sheets, sirna ERP, sooftiweerii herrega, fi dabalataan wajjin salphaan qunnamsiisi. Beekumsa teeknikaa hin barbaachisu—meeshaalee jiran walitti makuuf cuqaasuu tokko qofa.',
            feature4Title: 'Hordoffii Baasii & Galma Sammuu',
            feature4Desc: 'Yeroo xumuraa kaffaltii gonkumaa hin dagatin. Mesob ofumaan kaffaltii gibira, mindaa hojjetaa, kiraa, haaromfamuu laayisinii, fi baasii daldala hunda hordofee si yaadachiisa.',
            feature5Title: 'Gabaa Dhiyeessitootaa',
            feature5Desc: 'Dhiyeessitoonni mirkaneeffaman kanneen oomisha isaanii dashboard kee irratti beeksisan kallattiin wal qunnamsiisi. Oomisha haaraa argadhu, gatii wal bira qabi, fi amanamummaan ajaji.',
            quickFeature1: 'Xiinxala Yeroo Dhugaa',
            quickFeature2: 'Akeekkachisaa Ofumaa',
            quickFeature3: 'Jijjiirraa Qarshii',
            quickFeature4: 'Tilmaamaa Gurgurtaa',
        },
        ai: {
            badge: 'Sammuu AI',
            title: 'Daldala Kee, AI\'n Humna Guddaa Argate',
            subtitle: 'Ofumaan sammuu daldala keetiif 24/7 hojjetu',
            feature1Title: 'Tilmaamaa Sammuu',
            feature1Desc: 'AI barbaachisummaa tilmaama, qabeenya sirreessa, fi adeemsa tilmaama',
            feature2Title: 'Hubannoo Ofumaa',
            feature2Desc: 'Yaada raawwii daldala keetii fooyessuuf argadhu',
            feature3Title: 'Gargaarsa Sammuu',
            feature3Desc: 'Gargaarsa AI 24/7 gaaffii deebisuu fi hojii gargaaruuf',
            cta: 'Daldala AI-Powered Muuxannoo',
            chat1Question: '"Qabeeyan mana qorichi kiyya ji\'a kana akkamitti raawwataa jira?"',
            chat1Answer: 'Manni qorichi kee ji\'a darbe wajjin wal bira qabamee %23\'n dabala gurgurtaa argateera. Garuu, antibayootiksoota xiqqoo ta\'uu kee hubadheen. Adeemsa ammaa irratti hundaa\'uun, guyyaa 3 gadi keessatti yuniitii 150 Amoxicillin ajajuu yaada kennaa qarshii dhabuuf.',
            chat2Question: '"Oomishoonni bu\'aa gad aanaa qaban isa kam?"',
            chat2Answer: 'Meeshaalee saffisaan hin socho\'ne 12 gatii Qarshii 45,000 kanneen guyyaa 60 keessatti hin gurguramne adda baaseera. Meeshaalee kanaaf beeksiisa hojjechuu ykn tarsiimoo ajaja kee sirreessuu yaada kenna.',
            imageAlt: 'Bulchiinsa Mana Qorichaa AI',
        },
        howItWorks: {
            badge: 'Adeemsa Salphaa',
            title: 'Mesob Akkamitti Hojjeta',
            subtitle: 'Daldala kee jijjiiruuf tarkaanfiiwwan salphaa sadii',
            step1Title: 'Qophii Saffisaa',
            step1Desc: 'Sirna jiru kee wajjin qophii salphaa fi walitti makuu salphaan daqiiqoota keessatti jalqabi.',
            step2Title: 'Xiinxala Sammuu',
            step2Desc: 'Hubannoo AI murtii gaarii xiinxala yeroo dhugaa fi tilmaamaa wajjin akka gootu si gargaara.',
            step3Title: 'Guddisuu & Guddinaa',
            step3Desc: 'Deeggarsa damee hedduu, adeemsa ofumaa, fi fooyyessuu itti fufiinsa qabuun amanamummaan guddiisi.',
            imageAlt1: 'Ilaalcha Dashboard',
            imageAlt2: 'Walqunnamtii Gargaarsa AI',
            imageAlt3: 'Ilaalcha Abbaa',
        },
        pricing: {
            badge: 'Gatii Jijjiiramaa',
            title: 'Karoora Daldala Keetiif Sirrii Ta\'e Filadhu',
            subtitle: 'Yaalii guyyaa 30 bilisaa jalqabi. Kaardii liqii hin barbaachisu.',
            monthly: 'Ji\'a Ji\'aan',
            annually: 'Waggaan',
            saveLabel: '%20 Qusadhu',
            perMonth: '/ji\'a',
            startTrial: 'Yaalii Bilisaa Jalqabi',
            getStarted: 'Jalqabi',
            contactSales: 'Gurgurtaa Qunnamii',
            mostPopular: 'Baay\'ee Jaallatamaa',
            starterName: 'Jalqabaa',
            starterDesc: 'Daldala xiqqaaf kan amma jalqaban gaarii',
            professionalName: 'Ogeessa',
            professionalDesc: 'Daldala guddinaa amaloolee olaanaa barbaadan',
            enterpriseName: 'Dhaabbata',
            enterpriseDesc: 'Furmaata dhuunfaa dhaabbata guddaaf',
            feature1: 'Fayyadamtoota hanga 5',
            feature2: 'Bulchiinsa qabeenya bu\'uraa',
            feature3: 'Hordoffii gurgurtaa',
            feature4: 'Deeggarsa email',
            feature5: 'Fayyadamtoota daangaa hin qabne',
            feature6: 'Xiinxala olaanaa',
            feature7: 'Qaqqabummaa API',
            feature8: 'Deeggarsa dursa',
            feature9: 'Walitti makuu dhuunfaa',
            footerText: '© 2024 Mesob. Mirgi hundaa eegamaa dha.',
            ownerCta: 'Akka Abbaa Daldalaatti Seeni',
            supplierCta: 'Akka Dhiyeessaatti Seeni',
            contactUs: 'Nu Quunnamaa',
        },
        pwaInstall: {
            installApp: 'App Fe\'i',
            installTitle: 'Mesob Fe\'i',
            installDescription: 'Muuxannoo fooyya\'aaf appicha gara skiriinii man\'ee keetti dabali.',
            iosStep1: 'Mallattoo qooduu tuqi',
            iosStep2: '"Gara Man\'eetti Dabali" filadhu',
            androidStep1: 'Mallattoo menu tuqi',
            androidStep2: '"App Fe\'i" filadhu',
            desktopStep1: 'Mallattoo fe\'uu cuqaasi',
            desktopStep2: 'Barruu teessoo keessatti',
            firefoxMessage: 'Appicha fe\'uuf maaloo Chrome ykn Edge fayyadami',
            defaultMessage: 'Browser kun appicha fe\'uu hin deeggaru',
            gotIt: 'Na Galeera',
        },
        integrations: {
            badge: 'Walitti Makuu Salphaa',
            title: 'Meeshaalee Jaallattu Wajjin Wal qunnamsiisi',
            subtitle: 'Kaffaltii, herrega, fi meeshaalee daldala jaallataman wajjin walitti makuu',
            viewAll: 'Walitti Makuu Hunda Ilaali',
            effortlessTitle: 'Walitti Makuu Salphaa',
            effortlessDesc: 'Waltajjii hedduu fayyadamuu dhiisi. Mesob AI meeshaalee jiran wajjin salphaan qunnamsiisee, sirna walitti qabame daldalcha keetiif uuma.',
            benefit1: 'Qophii cuqaasuu-tokko walitti makuu hundaaf',
            benefit2: 'Makuu odeeffannoo yeroo dhugaa',
            benefit3: 'Qunnamtii nageenya, iccitiin eegame',
            benefit4: 'Beekumsa teeknikaa hin barbaachisu',
            requestTitle: 'Meeshaa kee hin argine?',
            requestLink: 'Walitti makuu dhuunfaa gaafadhu',
            googleSheetsDesc: 'Gabaasa alergii fi odeeffannoo qabeenya kallattiin Google Sheets irraa xiinxalaa fi qooduuf salphaan makuu.',
            sapDesc: 'Sirna SAP ERP sadarkaa dhaabbataa maallaqaa fi bulchiinsa daldalaa wajjin salphaan makuu.',
            odooDesc: 'Tuuta daldala guutuu Odoo wajjin qabeenya, gurgurtaa, fi adeemsa herrega walitti makuu wajjin wal qunnamsiisi.',
        },
        affiliate: {
            badge: 'Sagantaa Hiriyyaa',
            title: 'Mesob Qooduun Argadhu',
            subtitle: 'Sagantaa hiriyyaa keenyatti makamuu fi komishinii irra deebi\'ii argadhu',
            benefit1Title: 'Komishinii Olaanaa Argadhu',
            benefit1Desc: 'Qooda milkaa\'aa hundaaf komishinii falmaa argadhu.',
            benefit2Title: 'Qooduu Linkii Salphaa',
            benefit2Desc: 'Linkii qooda kee addaa battalumatti maddisiisiitii fi bakka kamirruu qoodi.',
            benefit3Title: 'Burqaa Galii Lama',
            benefit3Desc: 'Galmee dhiyeessitootaa fi abbaa daldala lamaanii irraa argadhu.',
            benefit4Title: 'Hordoffii Yeroo Dhugaa',
            benefit4Desc: 'Qooda fi galii kee dashboard yeroo dhugaa irratti hordofi.',
            cta: 'Sagantaa Hiriyyaa Seeni',
            howItWorksTitle: 'Akkamitti Hojjeta',
            step1Title: 'Bilisa Galmaa\'ii',
            step1Desc: 'Akkaawuntii hiriyyaa kee daqiiqoota keessatti uumi.',
            step2Title: 'Linkii Maddisiisi',
            step2Desc: 'Linkii qooda kee addaa dashboard kee irraa cuqaasuu tokkoon argadhu.',
            step3Title: 'Qoodi & Beeksisi',
            step3Desc: 'Linkii kee networkii keetiif qoodi.',
            step4Title: 'Komishinii Argadhu',
            step4Desc: 'Galmee milkaa\'aa hundaaf kaffaltii argadhu.',
            dashboardAlt: 'Dashboard Hiriyyaa',
        },
        testimonials: {
            badge: 'Dhugaabaarsaa',
            title: 'Daldala Afrikaa Hunda Amanamee',
            subtitle: 'Maamiltoonni keenya maal jedhan ilaali',
        },
        cta: {
            title: 'Daldala Kee Jijjiiruuf Qophii Dha?',
            subtitle: 'Daldaltoonni Afrikaa kumaataman Mesob fayyadaman wajjin makamii',
            button: 'Yaalii Bilisaa Kee Jalqabi',
            feature1Title: 'GDPR Sirreessaa',
            feature1Desc: 'Nageenya sadarkaa dhaabbataa wajjin adda baasu tenant guutuu',
            feature2Title: 'Qophii Saffisaa',
            feature2Desc: 'Sa\'aatii tokkoo gadi keessatti qajeelfama jalqabuun jalqabi',
            feature3Title: 'Gargaarsa 24/7',
            feature3Desc: 'AI fi gargaarsa namaa yeroo hundaa gargaaruuf jiru',
        },
        footer: {
            description: 'Bulchiinsa daldala AI daldala Afrikaa dhuunfaaf ijaarame',
            productTitle: 'Oomisha',
            product1: 'Amaloota',
            product2: 'Gatii',
            product3: 'Walitti Makuu',
            product4: 'Haaromfamoota',
            companyTitle: 'Dhaabbata',
            company1: 'Waa\'ee Keenya',
            company2: 'Blog',
            company3: 'Hojii',
            company4: 'Qunnamtii',
            legalTitle: 'Seeraan',
            legal1: 'Imaammata Dhuunfummaa',
            legal2: 'Waliigaltee Tajaajilaa',
            legal3: 'Imaammata Kukii',
            supportTitle: 'Gargaarsa',
            support1: 'Giddugala Gargaarsa',
            support2: 'Sanadoota',
            support3: 'Wabii API',
            rightsReserved: 'Mirga hunduu eegamee.',
            featureOverview: 'Ilaalcha amaloota',
            aiSolutions: 'Furmaata AI',
            pricing: 'Gatii',
            contact: 'Qunnamtii',
            affiliates: 'Hiriyyoota',
            privacyPolicy: 'Imaammata dhuunfummaa',
            termsOfService: 'Waliigaltee tajaajilaa',
            privacy: 'Dhuunfummaa',
            terms: 'Waliigaltee',
            support: 'Gargaarsa',
        },
        contactPage: {
            title: 'Agarsiisa Beellama',
            subtitle: 'Mesob hojmaata daldalaa keessanii akkamitti jijjiiruu akka danda\'u ilaaluuf qophii dhaa? Agarsiisa dhuunfaa barbaachisummaa keessaniif mijatu haa qindeessinu.',
            formHeading: 'Agarsiisa Kee Gaafadhu',
            nameLabel: 'Maqaa Guutuu*',
            emailLabel: 'Teessoo Emaila*',
            companyLabel: 'Maqaa Dhaabbataa/Daldala',
            messageLabel: 'Waa\'ee barbaachisummaa keessanii nutti himaa',
            messagePlaceholder: 'Rakkoolee kamtu daldala keessan irratti mul\'ata? Amaltoonni kamtu irratti abdii qabdu?',
            submitButton: 'Agarsiisa Koo Qindeessi',
            submitting: 'Gaafata ergaa jira...',
            successTitle: 'Gaafatan Agarsiisaa Ergame!',
            successMessage: 'Agarsiisa dhuunfaa keessan qindeessuuf sa\'aatii 24 keessatti isin quunnamna.',
            contactInfoHeading: 'Nu Quunnamaa',
            emailHeading: 'Emaila',
            emailText: 'nahomkeneni4@gmail.com',
            emailResponseTime: 'Sa\'aatii 24 keessatti deebii kennina',
            phoneHeading: 'Bilbila',
            phoneText: '+251983446134',
            phoneHours: 'Wiix-Jum, 9AM-6PM EAT',
            officeHeading: 'Waajjira',
            officeAddress: 'Boolee, Finfinnee, Itoophiyaa',
            officeHours: 'Sa\'aatii Hojii: Wiixata - Jimaata, 8:30 ganama - 5:30 galgala (Sa\'aatii Afrikaa Bahaa)',
            demoExpectationsHeading: 'Agarsiisa Keessan Keessatti Maal Eeguu Akka Qabdan',
            demoExpectation1: '• Qajeelfama dhuunfaa daqiiqaa 30',
            demoExpectation2: '• Amaltoo gosa daldala keessaniif addaa ta\'e ilaalaa',
            demoExpectation3: '• Gaaffii fi Deebii kallattiin ogeeyyii oomishaa keenya waliin',
            demoExpectation4: '• Marii gatii dhuunfaa',
            demoExpectation5: '• Sagantaa yeroo hojiirra oolmaa fi deeggarsa',
        },
        privacyPage: {
            pageTitle: 'Imaammata Dhuunfummaa',
            pageSubtitle: 'Dhuunfummaan keessan nuuf barbaachisaa dha. Imaammanni kun akkamitti Mesob AI odeeffannoo dhuunfaa keessanii walitti qabuu, itti fayyadamuu fi eeguu isaa ibsa.',
            lastUpdated: 'Yeroo dhumaatti haaromfame:',
            section1Heading: 'Odeeffannoo Walitti Qabnu',
            section1Body: 'Galmee yeroo kennitanirraa odeeffannoo daldala kanneen akka: maqaa daldalaa, bal\'ina abbaa daldala, lakkoofsa eenyummaa gibira (TIN), hayyama daldala, odeeffannoo quunnamtii fi bal\'ina baankii kaffaltii adeemsiisuuf walitti qabna. Akkasumas, tajaajila keenya bu\'uura qabeessa ta\'een kennuuf daataa daldalaa, galmeewwan qabeenya fi galmeewwan itti fayyadama walitti qabna.',
            section2Heading: 'Odeeffannoo Keessan Akkamitti Itti Fayyadamna',
            section2Body: 'Odeeffannoon keessan tajaajilaalee waltajjii kennuuf, karaa sirna baankii Itoophiyaa kaffaltii adeemsiisuuf, ragaa gibira wajjin walsimu maddisiisuu, qabeenya bulchuu, walqunnamtii dhiyeessitaa haala mijeessuuf akkasumas hubannoo daldala AI\'n hojjatu kennuuf kan itti fayyadamudha. Dambii daldala Itoophiyaa waliin walsimuun hojjenna akkasumas odeeffannoo dhuunfaa ykn daldala keessanii qaamolee sadaffaaf gonkumaa hin gurgurru.',
            section3Heading: 'Kuusaa fi Nageenya Daataa',
            section3Body: 'Daataan keessan yeroo sochii fi boqonnaa eegumsa wajjin nagaan kuufama. Mirkaneessa sadarkaa hedduu, sakatta\'iinsa nageenya idilee fi to\'annoo qaqqabummaa hojiirra oolchina. Infrastructure keenna tajaajila duumessa addunyaa itti fayyadamuun ni danda\'ama, garuu walsimsiisaa sadarkaa eegumsa daataa Itoophiyaa ni mirkaneessina akkasumas yeroo seerri barbaadu abbaa ta\'ummaa daataa ni eegna.',
            section4Heading: 'Seera Itoophiyaa Waliin Walsimsiisuu',
            section4Body: 'Seera daldala Itoophiyaa, dambii gibira fi barbaachisummaa hayyama daldala guutuun walsimsiifnee hojjenna. Ministiraa Daldala fi Indastriitii fi Taayitaa Galii fi Kaastamii Itoophiyaan akka barbaadaman galmee ni qabanna. Daataan daldalaa seera Itoophiyaa waliin (waggaa 5 xiqqaate kaayyoo gibiraf) ni kuufama.',
            section5Heading: 'Daataa Qooduun fi Ibsuu',
            section5Body: 'Daataa dhiyeessitaa tajaajila amanamoo (adeemsitaa kaffaltii, dhiyeessitaa SMS, keessummeessa duumessa) qofa waliin waliigaltee iccitii ciccimaa jalatti qoodna. Yeroo seerri barbaadu (sakatta\'iinsa gibira, walsimsiisaa dambiilee, ajaja mana murtii) odeeffannoo abbaa taayitaa mootummaa Itoophiyaatti ibsuu ni dandenya. Odeeffannoo daldala keessanii qaamolee mormitoota ykn sadaffaa hayyama hin qabneen gonkumaa hin qoodnu.',
            section6Heading: 'Daataa Kaffaltii fi Faayinaansii',
            section6Body: 'Adeemsi kaffaltii karaa dhiyeessitaa tajaajila kaffaltii Itoophiyaa hayyama qabaniin kan adeemsifamudha. Odeeffannoo baankii kaffaltii maamilummaa fi kaffaltii dhiyeessitaaf nagaan ni kuusna. Daldalaa faayinaansii hunduu dambii Baankii Federaalaa Itoophiyaa fi barbaachisummaa yakka maallaqaa irratti loluun walsima.',
            section7Heading: 'Mirga Keessan',
            section7Body: 'Odeeffannoo dhuunfaa keessan qaqqabuu, sirreessuu ykn haquu ni dandeessu. Daataa daldala keessanii yeroo kamiyyuu karaa qindaa\'ina akkaawuntii keessaniin erguu dandeessu. Gaafata haqaaf, galmeewwan seera Itoophiyaan barbaadaman kan qabannee guyyaa 30 keessatti ni eegna. Hayyama quunnamtii gabaa yeroo kamiyyuu dhiisuu ni dandeessu.',
            section8Heading: 'Abbaa Ta\'ummaa Daataa Daldala',
            section8Body: 'Daataa daldala keessanii kanneen akka: galmeewwan qabeenya, odeeffannoo maamilaa, daataa gurgurtaa fi galmeewwan faayinaansii of qabaachuun ni jiraattu. Akkaawuntiin yeroo cufamu daataa keessan hunduu erguu ni dandeessu. Si bakkeessinee akka adeemsitaa daataatti hojjenna akkasumas odeeffannoo daldala keessanii abbaa ta\'ummaa hin gaafannu.',
            section9Heading: 'Kuukii fi Hordoffii',
            section9Body: 'Kuukii barbaachisaa mirkaneesuuf fi bulchiinsa seeshinii, akkasumas kuukii xiinxalalaa raawwii waltajjii fooyyessuuf itti fayyadamna. Kuukii beeksisa qaama sadaffaa hin fayyadamnu. Kuukiin barbaachisaa hojii waltajjii barbaachisu ta\'us, qindaa\'ina browser keessanii keessatti filannoo kuukii bulchuu dandeessu.',
            section10Heading: 'Imaammata Kanaaf Haaromsaa',
            section10Body: 'Imaammata kana jijjiirama dambii Itoophiyaa ykn tajaajiloota keenyaa irratti mul\'ataniif haaromsuuf ni dandenya. Jijjiiramni barbaachisaa emaila fi beeksisa app keessaa karaa ta\'ee yoo xiqqaate guyyaa 14 dura kan beeksifamudha. Guyyaa hojiirra ooluu booda itti fufuun imaammata haaromfame fudhachuu agarsiisa.',
            contactUsHeading: 'Nu Quunnamaa',
            contactUsIntro: 'Waa\'ee Imaammata Dhuunfummaa kanaa ykn akkamitti daataa keessan akka bulchinu gaaffii yoo qabaattan mee nu quunnamaa:',
            contactEmail: 'Emaila:',
            contactPhone: 'Bilbila: +251983446134',
            contactAddress: 'Teessoo: Boolee, Finfinnee, Itoophiyaa',
            contactBusinessHours: 'Sa\'aatii Hojii: Wiixata - Jimaata, 8:30 ganama - 5:30 galgala (Sa\'aatii Afrikaa Bahaa)',
            termsLink: 'Waliigaltee Tajaajila Keenya Dubbisaa →',
        },
        cookieConsent: {
            title: 'Kukii fayyadamna',
            description: 'Kukii barbaachisaa mirkaneesuuf fi kukii xiinxalaa muuxannoo kee fooyyessuuf fayyadamna.',
            learnMore: 'Dabalataan baruu',
            decline: 'Diduu',
            accept: 'Fudhu',
        },
        auth: {
            signIn: 'Seeni',
            signUp: 'Galmaa\'i',
            emailOrPhone: 'Email ykn Bilbila',
            password: 'Jecha Darbi',
            forgotPassword: 'Jecha darbi dagatte?',
            rememberMe: 'Na yaadadhu',
            dontHaveAccount: 'Akkaawuntii hin qabduu?',
            createOne: 'Tokko uumi',
            alreadyHaveAccount: 'Akkaawuntii qabdaa?',
            termsAndPrivacy: 'Seenuudhaan kanaan walii galta',
            terms: 'Waliigaltee',
            privacy: 'Imaammata Dhuunfummaa',
            verificationCode: 'Koodii Mirkaneessaa',
            checkEmail: 'Koodii mirkaneessaaf email kee ilaali',
            verifyCode: 'Koodii Mirkaneessi',
            verifying: 'Mirkaneessaa jira...',
            sendingCode: 'Koodii ergaa jira...',
            backToSignIn: 'Gara Seensatti Deebi\'i',

            ownerSignInTitle: 'Seensa Abbaa Daldalaa',
            ownerSignInSubtitle: 'Dashboard daldala kee seeni, hojiiwwan bulchi, fi raawwii hordofi.',
            ownerWelcome: 'Baga nagaan dhufte — itti fufuuf odeeffannoo kee galchi.',

            supplierSignInTitle: 'Seensa Dhiyeessaa',
            supplierSignInSubtitle: 'Oomishaalee, ajaja, fi daldala wajjin walqunnamtii bulchi.',
            supplierWelcome: 'Baga nagaan dhufte — gara portal dhiyeessaa keetti seeni.',

            affiliateSignInTitle: 'Seensa Hiriyyaa',
            affiliateSignInSubtitle: 'Referrals, galii, fi raawwii kee hordofi.',
            affiliateWelcome: 'Baga nagaan dhufte — gara dashboard hiriyyaa keetti seeni.',

            businessName: 'Maqaa Daldalaa',
            tinNumber: 'Lakkoofsa TIN',
            phoneNumber: 'Lakkoofsa Bilbilaa',
            address: 'Teessoo Daldalaa',
            licenseDocument: 'Sanada Hayyama Daldalaa',
            registerOwner: 'Akka Abbaa Daldalaatti Galmaa\'i',
            registerSupplier: 'Akka Dhiyeessaatti Galmaa\'i',
            registerAffiliate: 'Akka Hiriyyaatti Galmaa\'i',
            ownerRegisterTitle: 'Imala bulchiinsa daldala kee jalqabi',
            ownerRegisterSubtitle: 'Abbootii daldalaa kumaatama platform AI keenya amananii wajjin makami.',
            supplierRegisterTitle: 'Gabaa kee babal\'isi',
            supplierRegisterSubtitle: 'Daldala kumaatama wajjin walqunnamii fi gurgurtaa kee guddisi.',
            affiliateRegisterTitle: 'Mesob wajjin argachuu jalqabi',
            affiliateRegisterSubtitle: 'Sagantaa hiriyyaa keenyatti makamiitii komishinii irra deebi\'ii argadhu.',

            resetPasswordTitle: 'Jecha Darbi Haaromsi',
            resetPasswordSubtitleEmail: 'Koodii haaromsaa argachuuf email kee galchi',
            resetPasswordSubtitleCode: 'Koodii fi jecha darbi haaraa galchi',
            sendResetCode: 'Koodii Haaromsaa Ergi',
            resetCode: 'Koodii Haaromsaa',
            newPassword: 'Jecha Darbi Haaraa',
            confirmPassword: 'Jecha Darbi Mirkaneessi',
            resetPasswordButton: 'Jecha Darbi Haaromsi',
            didntReceiveCode: "Koodiin sin qaqqabnee? Irra deebi'ii yaali",
        },
    },
    ti: {
        nav: {
            home: 'መእተዊ',
            features: 'ባህርያት',
            solutions: 'መፍትሒታት',
            howItWorks: 'ከመይ ይሰርሕ',
            security: 'ድሕነት',
            pricing: 'ዋጋ',
            contact: 'ርኸቡና',
            integrations: 'ምስ ካልኦት ምትእስሳር',
            blog: 'ብሎግ',
            signIn: 'እተው',
            startFreeTrial: 'ነጻ ፈተነ ጀምር',
            dashboard: 'ዳሽቦርድ',
            signOut: 'ውጻእ',
        },
        hero: {
            badge1: 'ንግዳዊ ሰውራ ብ AI',
            badge2: 'ብኢትዮጵያ ንኣፍሪካ ዝተሰርሐ',
            title1: 'ንግድኻ',
            title2: 'ቀይሮ',
            title3: 'ብ AI ዝሰርሕ ናይ ምሕደራ ሶፍትዌር',
            cta1: 'ናይ 30 መዓልቲ ነጻ ፈተነ ጀምር',
            cta2: 'ዴሞ ርኣይ',
            stat1Value: '30 መዓልቲ',
            stat1Label: 'ነጻ ፈተነ',
            stat2Value: '24/7',
            stat2Label: 'AI ደገፍ',
            stat3Value: '>99.9%',
            stat3Label: 'ግዜ ኣገልግሎት',
        },
        problemSolution: {
            title: 'ኣፍሪካውያን ነጋዶ ዝገጥሞም ብድሆታት',
            subtitle: 'ንሕና ከመይ ንፈትሖ',
            problem1Title: 'ናይ ኢድ መስርሓት',
            problem1Desc: 'ግዜ ዝወስድ ናይ ወረቐት ስራሕን ብኢድ ዳታ ምእታውን ንግድኻ የደናጉዮ',
            problem2Title: 'ውሱን ርድኢት',
            problem2Desc: 'ንብረት፣ መሸጣን ንግዳዊ ኣፈጻጽማን ብቀጥታ ምክትታል ኣጸጋሚ እዩ',
            problem3Title: 'ዝተበታተነ ስርዓታት',
            problem3Desc: 'ብሓባር ዘይሰርሑ ብዙሓት መሳርሒታት፣ ዘይብቁዕነት ይፈጥሩ',
            solution1Title: 'ኣውቶማቲክ መስርሓት',
            solution1Desc: 'ብ AI ዝሰርሕ ኣውቶሜሽን ተደጋጋሚ ስራሓት ይቆጻጸር፣ ንዕብየት ግዜ ይህበካ',
            solution2Title: 'ናይ ቀጥታ ትንተና',
            solution2Desc: 'ብዛዕባ ንግዳዊ ኣፈጻጽማኻ ብዝተራቀቐ ዳሽቦርድ ቅልጡፍ ርድኢት',
            solution3Title: 'ኩሉ ኣብ ሓደ መድረኽ',
            solution3Desc: 'ዝደልዮ ኩሉ ኣብ ሓደ ቦታ - ንብረት፣ መሸጣ፣ HR፣ ከምኡውን ካልእ',
            intro: 'ባህላዊ ንግዳዊ ምሕደራ ንኢትዮጵያውያን ነጋዶ ንድሕሪት ይጎቶም ኣሎ። ሕጂ ግዜ ለውጢ እዩ።',
            oldWay: 'ጸገማት ናይ ቀደም ኣሰራርሓ',
            mesobWay: 'ኣሰራርሓ መሶብ',
        },
        features: {
            badge: 'ሓያላት ባህርያት',
            title: 'ዝደልዮ ኩሉ ኣብ ሓደ መድረኽ',
            subtitle: 'ንኢትዮጵያ ድኳናት፣ ፋርማሲታትን ችርቻሮ ንግድታትን ዝተዳለወ ምሉእ ዘመናዊ ንግዳዊ ምሕደራ ስርዓት።',
            feature1Title: 'ምሕደራ ብዙሓት ጨናፍር',
            feature1Desc: 'ኩሉ ናይ ድኳን ቦታታትካ ካብ ሓደ ዳሽቦርድ ኣመሓድር። ኣብ ነፍሲ ወከፍ ጨንፈር ብዛዕባ ንብረት፣ መሸጣን ኣፈጻጽማን ናይ ቀጥታ ርእይቶ ርከብ።',
            feature2Title: 'ምሕደራ ሰራሕተኛታትን ጋንታን',
            feature2Desc: 'ፍሉይ ፍቃድ ዘለዎም ናይ ሰራሕተኛ ኣካውንት ፍጠር፣ ንጥፈታት ተኸታተል፣ ከምኡውን ኣብ ትካልካ ተሓታትነት ኣረጋግጽ።',
            feature3Title: 'ናይ ሓደ ጠውቃ ምትእስሳር',
            feature3Desc: 'ምስ Google Sheets፣ ERP ስርዓታት፣ ናይ ሒሳብ ሶፍትዌርን ካልኦትን ብቀሊሉ ተራኽብ። ዝኾነ ቴክኒካዊ ፍልጠት ኣየድልን - ዘለዉኻ መሳርሒታት ንምራኻብ ሓደ ጠውቃ ጥራይ።',
            feature4Title: 'ስለይቲ ወጻኢን ሸቶን ምክትታል',
            feature4Desc: 'ናይ ክፍሊት ግዜ መወዳእታ ፈጺሙ ኣይሕለፍካ። መሶብ ብኣውቶማቲክ ናይ ግብሪ ክፍሊት፣ ደሞዝ ሰራሕተኛ፣ ክራይ፣ ምሕዳስ ፍቃድን ኩሉ ንግዳዊ ወጻኢታትን ይከታተልን የዘኻኽረካን።',
            feature5Title: 'ዕዳጋ ኣቕረብቲ',
            feature5Desc: 'ምርቶም ኣብ ዳሽቦርድካ ምስ ዘተአላልፉ ዝተረጋገጹ ኣቕረብቲ ብቀጥታ ተራኽብ። ሓደስቲ ምርትታት ርከብ፣ ዋጋታት ኣወዳድር፣ ከምኡውን ብምትእምማን እዘዝ።',
            quickFeature1: 'ናይ ቀጥታ ትንተና',
            quickFeature2: 'ኣውቶማቲክ መጠንቀቕታ',
            quickFeature3: 'ምውርዋር ንብረት',
            quickFeature4: 'ትንበያ መሸጣ',
        },
        ai: {
            badge: 'ብ AI ዝሰርሕ ርድኢት',
            title: 'ንግድኻ ብ AI ተሓይሉ',
            subtitle: '24/7 ንዓኻ ዝሰርሕ ብልሒ ዘለዎ ኣውቶሜሽን',
            feature1Title: 'ስለይቲ ትንበያታት',
            feature1Desc: 'AI ጠለብ ይትንበ፣ ንብረት የዐሪ፣ ከምኡውን ዝንባለታት ይሕብር',
            feature2Title: 'ኣውቶማቲክ ርድኢት',
            feature2Desc: 'ንግድኻ ንምምሕያሽ ተግባራዊ ምኽርታት ርከብ',
            feature3Title: 'ስለይቲ ደገፍ',
            feature3Desc: 'ሕቶታት ንምምላስን ኣብ ስራሕ ንምሕጋዝን 24/7 AI ሓጋዚ',
            cta: 'ብ AI ዝሰርሕ ንግዲ ፈትን',
            chat1Question: '"ናይ ፋርማሲይ ንብረት ኣብዚ ወርሒ ከመይ ኣሎ?"',
            chat1Answer: 'ፋርማሲኻ ምስ ዝሓለፈ ወርሒ ክነጻጸር ከሎ ናይ 23% ወሰኽ መሸጣ ኣርእዩ። ይኹን እምበር፣ ኣንቲባዮቲክስ ይወድኣካ ከምዘሎ ኣስተውዒለ። ኣብ ዘሎ ዝንባለ ብምምርኳስ፣ ሕጽረት ንምውጋድ ኣብ ዝመጹ 3 መዓልታት 150 ኣሞክሲሲሊን ክትእዝዝ እምክረካ።',
            chat2Question: '"ኣየኖት ምርትታት ትሑት ኣፈጻጽማ የርእዩ ኣለዉ?"',
            chat2Answer: 'ኣብ 60 መዓልታት ዘይተሸጡ 45,000 ብር ዋጋ ዘለዎም 12 ብዝሓሓ ዝንቀሳቐሱ ኣቕሑት ፈለየ ኣለኹ። ነዞም ኣቕሑት ፕሮሞሽን ክትገብር ወይ ናይ ምእዛዝ ስትራተጂኻ ከተዐሪ እምክረካ።',
            imageAlt: 'ብ AI ዝሰርሕ ምሕደራ ፋርማሲ',
        },
        howItWorks: {
            badge: 'ቀሊል መስርሕ',
            title: 'መሶብ ከመይ ይሰርሕ',
            subtitle: 'ንግድኻ ንምቕያር ሰለስተ ቀለልቲ ስጉምትታት',
            step1Title: 'ቅልጡፍ ምድላው',
            step1Desc: 'ብደቂቓታት ውሽጢ ብቀሊሉ ጀምርን ምስ ዘለዉኻ ስርዓታት ብዘይ ጸገም ኣራኽብ።',
            step2Title: 'ስለይቲ ትንተና',
            step2Desc: 'ብ AI ዝሰርሑ ርድኢታት ብናይ ቀጥታ ትንተናን ትንበያታትን ዝሓሸ ውሳነ ክትወስድ ይሕግዙኻ።',
            step3Title: 'ዕበን ስፋሕን',
            step3Desc: 'ብናይ ብዙሓት ጨናፍር ደገፍ፣ ኣውቶማቲክ መስርሓትን ቀጻሊ ምምሕያሽን ብምትእምማን ስፋሕ።',
            imageAlt1: 'ናይ ዳሽቦርድ ሓፈሻዊ ርእይቶ',
            imageAlt2: 'ናይ AI ሓጋዚ መተሓላለፊ',
            imageAlt3: 'ናይ ዋና ሓፈሻዊ ርእይቶ',
        },
        pricing: {
            badge: 'ተለዋዋጢ ዋጋ',
            title: 'ንንግድኻ ዝሰማማዕ ትልሚ ምረጽ',
            subtitle: 'ብናይ 30 መዓልቲ ነጻ ፈተነ ጀምር። ክሬዲት ካርድ ኣየድልን።',
            monthly: 'በብወርሒ',
            annually: 'በብዓመት',
            saveLabel: '20% ቆጥብ',
            perMonth: '/ወርሒ',
            startTrial: 'ነጻ ፈተነ ጀምር',
            getStarted: 'ጀምር',
            contactSales: 'መሸጣ ርኸብ',
            mostPopular: 'ዝበለጸ ዝተፈትወ',
            starterName: 'ጀማሪ',
            starterDesc: 'ንዝጅምሩ ንኣሽቱ ንግድታት ዝሰማማዕ',
            professionalName: 'ብሉጽ',
            professionalDesc: 'ዝለዓለ ባህርያት ንዝደልዩ ዝዓብዩ ዘለዉ ንግድታት',
            enterpriseName: 'ትካል',
            enterpriseDesc: 'ንዓበይቲ ትካላት ዝተዳለወ ፍሉይ መፍትሒ',
            feature1: 'ክሳብ 5 ተጠቀምቲ',
            feature2: 'መሰረታዊ ምሕደራ ንብረት',
            feature3: 'ምክትታል መሸጣ',
            feature4: 'ናይ ኢሜይል ደገፍ',
            feature5: 'ዘይተገደቡ ተጠቀምቲ',
            feature6: 'ዝተራቀቐ ትንተና',
            feature7: 'API መእተዊ',
            feature8: 'ቀዳምነት ዘለዎ ደገፍ',
            feature9: 'ፍሉይ ምትእስሳር',
            footerText: '© 2024 መሶብ. ኩሉ መሰል ዝተሓለወ እዩ።',
            ownerCta: 'ከም ዋና እተው',
            supplierCta: 'ከም ኣቕራቢ እተው',
            contactUs: 'ርኸቡና',
        },
        pwaInstall: {
            installApp: 'ኣፕ ጽዓን',
            installTitle: 'መሶብ ጽዓን',
            installDescription: 'ንዝሓሸ ተሞክሮ ነቲ ኣፕ ናብ መበገሲ ስክሪንካ ወስኸሉ።',
            iosStep1: 'ናይ ምክፋል ምልክት ጠውቕ',
            iosStep2: '"ናብ መበገሲ ገጽ ወስኽ" ምረጽ',
            androidStep1: 'ናይ ሜኑ ምልክት ጠውቕ',
            androidStep2: '"ኣፕ ጽዓን" ምረጽ',
            desktopStep1: 'ናይ ምጽዓን ምልክት ጠውቕ',
            desktopStep2: 'ኣብ ናይ ኣድራሻ ባር',
            firefoxMessage: 'ነቲ ኣፕ ንምጽዓን በጃኻ Chrome ወይ Edge ተጠቐም',
            defaultMessage: 'እዚ ብራውዘር ኣፕ ምጽዓን ኣይድግፍን እዩ',
            gotIt: 'ተረዲኡኒ',
        },
        integrations: {
            badge: 'ቀሊል ምትእስሳር',
            title: 'ምስ እትፈትዎም መሳርሒታት ተራኽብ',
            subtitle: 'ምስ ፍሉጣት ናይ ክፍሊት፣ ሒሳብን ንግዳዊ መሳርሒታትን ተኣሳሰር',
            viewAll: 'ኩሉ ምትእስሳራት ርኣይ',
            effortlessTitle: 'ቀሊል ውህደት',
            effortlessDesc: 'ብብዙሓት መድረኻት ምጭነቕ ይኣክል፣ መሶብ AI ምስ ዘለዉኻ መሳርሒታት ብዘይ ጸገም ይራኸብ፣ ንንግዳዊ ስራሕካ ሓደ ዝተወሃሃደ ስርዓት ይፈጥር።',
            benefit1: 'ንኩሉ ውህደታት ናይ ሓደ ጠውቃ ምድላው',
            benefit2: 'ናይ ቀጥታ ዳታ ምትእስሳር',
            benefit3: 'ውሑስ፣ ዝተመሰጠረ ምትእስሳር',
            benefit4: 'ዝኾነ ቴክኒካዊ ፍልጠት ኣየድልን',
            requestTitle: 'መሳርሒኻ ኣይረኸብካዮን?',
            requestLink: 'ፍሉይ ውህደት ሕተት',
            googleSheetsDesc: 'ንቀሊል ትንተናን ምክፋልን ሪፖርትታት ስደድን ናይ ንብረት ዳታ ብቀጥታ ካብ Google Sheets ኣሰማምዕ።',
            sapDesc: 'ንናይ ትካል ደረጃ ፋይናንስን ስራሕን ምሕደራ ምስ SAP ERP ስርዓታት ብዘይ ጸገም ተዋሃሃድ።',
            odooDesc: 'ንዝተወሃሃደ ንብረት፣ መሸጣን ሒሳብን መስርሓት ምስ Odoo ንግዳዊ ስብስብ ተራኽብ።',
        },
        affiliate: {
            badge: 'ናይ መሻርኽቲ መደብ',
            title: 'መሶብ ብምክፋል ረብሕ',
            subtitle: 'ናይ መሻርኽቲ መደብና ተሓወስ እሞ ቀጻሊ ኮሚሽን ረብሕ',
            benefit1Title: 'ልዑል ኮሚሽን ርከብ',
            benefit1Desc: 'ንነፍሲ ወከፍ ዕውት ሪፈራል ተወዳዳሪ ኮሚሽን ርከብ።',
            benefit2Title: 'ቀሊል ሊንክ ምክፋል',
            benefit2Desc: 'ፍሉይ ናይ ሪፈራል ሊንክኻ ብቀጥታ ኣዳሉ እሞ ኣብ ዝኾነ ቦታ ኣካፍል።',
            benefit3Title: 'ድርብ ምንጪ ኣታዊ',
            benefit3Desc: 'ካብ ኣቕረብትን ዋናታት ንግድን ምዝገባ ረብሕ።',
            benefit4Title: 'ናይ ቀጥታ ምክትታል',
            benefit4Desc: 'ሪፈራልካን ኣታዊኻን ኣብ ናይ ቀጥታ ዳሽቦርድ ተኸታተል።',
            cta: 'ናይ መሻርኽቲ መደብ ተሓወስ',
            howItWorksTitle: 'ከመይ ይሰርሕ',
            step1Title: 'ብነጻ ተመዝገብ',
            step1Desc: 'ናይ መሻርኽቲ ኣካውንትካ ብደቂቓታት ውሽጢ ፍጠር።',
            step2Title: 'ሊንክ ኣዳሉ',
            step2Desc: 'ፍሉይ ናይ ሪፈራል ሊንክኻ ካብ ዳሽቦርድካ ብሓደ ጠውቃ ርከብ።',
            step3Title: 'ኣካፍልን ኣፋልጥን',
            step3Desc: 'ሊንክኻ ንሰባትካ ኣካፍል።',
            step4Title: 'ኮሚሽን ርከብ',
            step4Desc: 'ንነፍሲ ወከፍ ዕውት ምዝገባ ክፍሊት ርከብ።',
            dashboardAlt: 'ናይ መሻርኽቲ ዳሽቦርድ',
        },
        testimonials: {
            badge: 'ምስክርነት',
            title: 'ብኣፍሪካውያን ነጋዶ ዝተአምነ',
            subtitle: 'ዓማዊልና ዝብልዎ ርኣይ',
        },
        cta: {
            title: 'ንግድኻ ንምቕያር ድሉው ዲኻ?',
            subtitle: 'ምስቶም መሶብ ዝጥቀሙ ዘለዉ ኣሽሓት ኣፍሪካውያን ነጋዶ ተሓወስ',
            button: 'ነጻ ፈተነኻ ጀምር',
            feature1Title: 'GDPR ተማእዛዚ',
            feature1Desc: 'ናይ ትካል ደረጃ ድሕነት ምስ ምሉእ ውልቃዊ ሓበሬታ ምክልኻል',
            feature2Title: 'ቅልጡፍ ምድላው',
            feature2Desc: 'ካብ ሓደ ሰዓት ብዝወሓደ ግዜ ብዝተመርሐ ምጅማር ጀምር',
            feature3Title: '24/7 ደገፍ',
            feature3Desc: 'AI ን ናይ ሰብ ደገፍን ኩሉ ግዜ ንምሕጋዝ ድሉዋት እዮም',
        },
        footer: {
            description: 'ንኣፍሪካውያን ነጋዶ ዝተሰርሐ ብ AI ዝሰርሕ ንግዳዊ ምሕደራ ሶፍትዌር',
            productTitle: 'ምርቲ',
            product1: 'ባህርያት',
            product2: 'ዋጋ',
            product3: 'ምትእስሳር',
            product4: 'ምምሕያሻት',
            companyTitle: 'ኩባንያ',
            company1: 'ብዛዕባና',
            company2: 'ብሎግ',
            company3: 'ስራሕ',
            company4: 'ርኸቡና',
            legalTitle: 'ሕጋዊ',
            legal1: 'ናይ ውልቃዊነት ፖሊሲ',
            legal2: 'ናይ ኣገልግሎት ውል',
            legal3: 'ናይ ኩኪ ፖሊሲ',
            supportTitle: 'ደገፍ',
            support1: 'ናይ ሓገዝ ማእከል',
            support2: 'ሰነዳት',
            support3: 'API መወከሲ',
            rightsReserved: 'ኩሉ መሰል ዝተሓለወ እዩ።',
            featureOverview: 'ሓፈሻዊ ርእይቶ ባህርያት',
            aiSolutions: 'AI መፍትሒታት',
            pricing: 'ዋጋ',
            contact: 'ርኸቡና',
            affiliates: 'መሻርኽቲ',
            privacyPolicy: 'ናይ ውልቃዊነት ፖሊሲ',
            termsOfService: 'ናይ ኣገልግሎት ውል',
            privacy: 'ውልቃዊነት',
            terms: 'ውላት',
            support: 'ደገፍ',
        },
        contactPage: {
            title: 'ዴሞ ብመዓርግ ኣቐምት',
            subtitle: 'መሶብ ንግዳዊ ስራሕካ ከመይ ክቕይሮ ከም ዝኽእል ንምርኣይ ድሉው ዲኻ? ንጠለብካ ዝተዳለወ ውልቃዊ ዴሞ ንኣኽን።',
            formHeading: 'ንዴሞኻ ሕተት',
            nameLabel: 'ሙሉእ ስም*',
            emailLabel: 'ኣድራሻ ኢመይል*',
            companyLabel: 'ማሕበር/ስም ንግዲ',
            messageLabel: 'ብዛዕባ ጠለብካ ንገረና',
            messagePlaceholder: 'ኣየኖት ብድሆታት ኣብ ንግድኻ ይገጥሙኻ ኣለዉ? ኣየኖት ባህርያት ዝበዝሕ ፍላጥ ኣለካ?',
            submitButton: 'ዴሞይ ኣቐምት',
            submitting: 'ሕቶ ይልእኽ ኣሎ...',
            successTitle: 'ሕቶ ዴሞ ተላኢኹ!',
            successMessage: 'ውልቃዊ ዴሞኻ ንምውዳድ ኣብ ውሽጢ 24 ሰዓታት ክንረኽበካ ኢና።',
            contactInfoHeading: 'ርኸቡና',
            emailHeading: 'ኢመይል',
            emailText: 'nahomkeneni4@gmail.com',
            emailResponseTime: 'ኣብ ውሽጢ 24 ሰዓታት ንምልስ',
            phoneHeading: 'ቴሌፎን',
            phoneText: '+251983446134',
            phoneHours: 'ሰኑይ-ዓርቢ፣ 9AM-6PM EAT',
            officeHeading: 'ቤት ጽሕፈት',
            officeAddress: 'ቦሌ፣ ኣዲስ ኣበባ፣ ኢትዮጵያ',
            officeHours: 'ሰዓታት ንግዲ: ሰኑይ - ዓርቢ፣ 8:30 ንጉሆ - 5:30 ድሕሪ ቀትሪ (ናይ ምብራቕ ኣፍሪቃ ሰዓት)',
            demoExpectationsHeading: 'ኣብ ዴሞኻ ምንታይ ክትጽበይ ከም ዘለካ',
            demoExpectation1: '• 30 ደቒቕ ውልቃዊ ምብራህ',
            demoExpectation2: '• ንዓይነት ንግድኻ ፍሉይ ባህርያት ርአይ',
            demoExpectation3: '• ምስ ኣፍልጦ ምርታችን ቀጥታዊ ሕቶን መልስን',
            demoExpectation4: '• ውልቃዊ ዋጋ ዘተ',
            demoExpectation5: '• መደብ ግዜ ምትግባርን ደገፍን',
        },
        privacyPage: {
            pageTitle: 'ናይ ውልቃዊነት ፖሊሲ',
            pageSubtitle: 'ውልቃዊነትካ ንዓና ኣገዳሲ እዩ። እዚ ፖሊሲ መሶብ AI ውልቃዊ ሓበሬታኻ ከመይ ኢሉ ከም ዝእክብ፣ ከም ዝጥቀመሉን ከም ዝሕልዎን የብርህ።',
            lastUpdated: 'ንድሕረይ ግዜ ዝተሐደሰ:',
            section1Heading: 'ሓበሬታ እነእክቦ',
            section1Body: 'ኣብ ግዜ ምዝገባ እትህቦ ንግዳዊ ሓበሬታ ከም: ስም ዕዳጋ፣ ዝርዝር ዋና፣ ቁጽሪ መለለዪ ግብሪ (TIN)፣ ፈቓድ ንግዲ፣ ሓበሬታ ርክብን ናይ ባንክ ሂሳብ ዝርዝር ንክፍሊት ንምሕባርን ንእክብ። ከም ኡውን አገልግሎትና ብዕግበት ንምሃብ ናይ ንግዲ ዳታ፣ ዝርዝር ንብረትን ምዝገባ ኣጠቓቕማን ንእክብ።',
            section2Heading: 'ሓበሬታኻ ከመይ ንጥቀመሉ',
            section2Body: 'ሓበሬታኻ ናይ መድረኽ አገልግሎት ንምሃብ፣ ብመንገዲ ናይ ኢትዮጵያ ስርዓት ባንክ ክፍሊታት ንምምራሕ፣ ምስ ግብሪ ዝኸውን ደረሰኛታት ንምፍራይ፣ ንብረት ንምሕደራ፣ ናይ ኣቕረብቲ ርክባት ንምምቻው፣ከም ኡውን ብ AI ዝሰርሑ ንግዳዊ ርድኢት ንምሃብ ይጥቀም። ምስ ናይ ኢትዮጵያ ንግዳዊ ሕጊ ንታዘዝን ውልቃዊ ወይ ንግዳዊ ሓበሬታኻ ንሳልሳይ ወገናት ፈጺምና ንዘይንሸጥን።',
            section3Heading: 'ምኽዛንን ድሕነትን ዳታ',
            section3Body: 'ዳታኻ ኣብ ግዜ ምንቅስቃስን ምቕማጥን ብምሽፋን ብድሕነት ይኽዘን። ብዙሕ ደረጃ ምርግጋጽ፣ ስሩዕ ካብ ምርመራ ድሕነትን መቆጻጸሪ ኣእታውን ንግበር። መሰረት ልምዓትና ዓለማዊ አገልግሎት ደበና ክጥቀም ይኽእል እዩ፣ ግን ምስ ናይ ኢትዮጵያ ደረጃ ምክልኻል ዳታ ምስምማዕ እናረጋገጽና እሞ ሕጊ ከሎ ሉዓላዊነት ዳታ ንሕልዎ።',
            section4Heading: 'ምስ ሕጊ ኢትዮጵያ ምስምማዕ',
            section4Body: 'ምስ ናይ ኢትዮጵያ ንግዳዊ ሕጊ፣ ደንቢ ግብሪን መስፈርታት ፈቓድ ንግድን ብምሉእ ብምስምማዕ ንሰርሕ። ከም ወተሃደር ንግድን ኢንዳስትሪን መሪሕነት ጉምሩክ ኢትዮጵያን ዝሓቱ መዝገባት ንሕዝ። ናይ ንግዲ ንግዲ ዳታ ከም ሕጋዊ መስፈርቲ ኢትዮጵያ (ቢያንስ 5 ዓመት ንዓላማ ግብሪ) ይኽዘን።',
            section5Heading: 'ዳታ ምክፋልን ምግላጽን',
            section5Body: 'ዳታ እነካፍለሉ ካብ እትሓታታ አገልግሎት ኣቕረብቲ (ኣመራርሓ ክፍሊት፣ ኣቕረብቲ SMS፣ ምእንጋድ ደበና) ጥራይ እዩ ብጥብቅ ስምምዕ ምስጢራዊነት ውሽጢ። ኣብ ግዜ ሕጊ እንተ ሓቲቱ (ምርመራ ግብሪ፣ ምስምማዕ ቁጽጽር፣ ትእዛዛት ቤት ፍርዲ) ሓበሬታ ንባለስልጣናት መንግስቲ ኢትዮጵያ ከነብርሕ ንኽእል። ንግዳዊ ዳታኻ ንተወዳደርቲ ወይ ሳልሳይ ወገናት ፈቓድ ዘይብሎም ፈጺምና ኣንካፍልን።',
            section6Heading: 'ናይ ክፍሊትን ፋይናንስን ዳታ',
            section6Body: 'መስርሕ ክፍሊት ብመንገዲ ፈቓድ ዘለዎም ናይ ኢትዮጵያ አቕረብቲ አገልግሎት ክፍሊት እዩ ዝካየድ። ሓበሬታ ሂሳብ ባንክ ብድሕነት ንምክፋል ም subscribeን ክፍሊት ኣቕረብትን ንኽዝን። ኩላ ንግድታት ፋይናንስ ምስ ደንቢ ብሄራዊ ባንክ ኢትዮጵያን መስፈርታት ምዝንባር ገንዘብን ዝስማማዕ እዩ።',
            section7Heading: 'መሰላትካ',
            section7Body: 'ናይ ውልቃዊ ዳታኻ ምእታው፣ ምእራምን ምድምሳስን መሰል ኣለካ። ናይ ንግዲ ዳታኻ ብዝኾነ ግዜ ብመንገዲ ምቕማጥካ ሒሳብ ከተልእ ትኽእል። ንሕቶታት ምድምሳስ ዳታ፣ መዝገባት ብሕጊ ኢትዮጵያ ዝሓትት ከሎና ኣብ ውሽጢ 30 መዓልቲ ኬነሽሩ። ንምልክታት ገበና ፈቓድ ብዝኾነ ግዜ ምልቃቕ ትኽእል።',
            section8Heading: 'ባለንብረት ዳታ ንግዲ',
            section8Body: 'ናይ ንግዲ ዳታኻ ከም: ዝርዝር ንብረት፣ ሓበሬታ ኣሚሎች፣ ዳታ መሸጣን ዝርዝር ፋይናንስን ምሉእ ባለን برብረትነት ኣንጻሕካዮ። ኣካውንት ከሎ ምዕጻው ኩሉ ዳታኻ ክተልእዎ ትኽእሉ። ብወኪልካ እንተ ኣመራርሕ ዳታ ንሰርሕ እሞ ባለንብረትነት ናይ ዳታ ንግድኻ ኣይንጠይቅን።',
            section9Heading: 'ኩኪታትን ምክትታልን',
            section9Body: 'ኩኪታት ኣገደስቲ ንምርግጋጽን ምሕደራ ክፍለ ጊዜን፣ ከም ኡውን ኩኪታት ትንተና ኣፈጻጽማ መድረኽ ንምምሕያሽ ንጥቀም። ናይ ሳልሳይ ወገን ማስታወቂ ኩኪታት ኣይንጥቀምን። ምንክር ኩኪታት ኣገደስቲ ንምሰራሕነት መድረኽ ይሓትት እኳ ኣብ ምቕማጥ ብራውዘርካ ምርጫታት ኩክ ኪሕድሩ ትኽእሉ።',
            section10Heading: 'ንዚህ ፖሊሲ ምሕዳሳት',
            section10Body: 'ንዚህ ፖሊሲ ለውጥታት ኣብ ደንቢ ኢትዮጵያ ወይ ኣገልግሎታትና ንምንጸባርቕ ክንሓድሶ ንኽእል። ማዕርነታዊ ለውጥታት ብኢመይልን ንማስታወቂ ኣብ ውሽጢ መተግበሪን ቢያንስ 14 መዓልታት ቅድሚ ክወሃቡ ይግለጹ። ድሕሪ ዕለት ውጽኢት ምቕጻል ምቕባል ናይ ተሓደሰ ፖሊሲ ይሕብር።',
            contactUsHeading: 'ርኸቡና',
            contactUsIntro: 'ብዛዕባ እዚ ናይ ውልቃዊነት ፖሊሲ ወይ ከመይ ዳታኻ ከም ንኽውን ሕቶታት እንተሎካ በጃኻ ር ከቡና:',
            contactEmail: 'ኢመይል:',
            contactPhone: 'ቴሌፎን: +251983446134',
            contactAddress: 'ኣድራሻ: ቦሌ፣ ኣዲስ ኣበባ፣ ኢትዮጵያ',
            contactBusinessHours: 'ሰዓታት ንግዲ: ሰኑይ - ዓርቢ፣ 8:30 ንጉሆ - 5:30 ድሕሪ ቀትሪ (ናይ ም ብራቕ ኣፍሪቃ ሰዓት)',
            termsLink: 'ናይ ኣገልግሎት ውላትና ኣንብብ →',
        },
        cookieConsent: {
            title: 'ኩኪታት ንጥቀም ኢና',
            description: 'ንምርግጋጽን ተመኩሮኻ ንምምሕያሽን ዘድልዩ ኩኪታትን ናይ ትንተና ኩኪታትን ንጥቀም።',
            learnMore: 'ተወሳኺ ፍለጥ',
            decline: 'ኣይቀበልን',
            accept: 'ይቀበል',
        },
        auth: {
            signIn: 'እተው',
            signUp: 'ተመዝገብ',
            emailOrPhone: 'ኢሜይል ወይ ስልክ',
            password: 'መሕለፊ ቃል',
            forgotPassword: 'መሕለፊ ቃል ረሲዕካ?',
            rememberMe: 'ዘክረኒ',
            dontHaveAccount: 'ኣካውንት የብልካን?',
            createOne: 'ሓደ ፍጠር',
            alreadyHaveAccount: 'ኣካውንት ኣለካ?',
            termsAndPrivacy: 'ብምእታው በዚ ትሰማማዕ',
            terms: 'ውላት',
            privacy: 'ናይ ውልቃዊነት ፖሊሲ',
            verificationCode: 'ኮድ መረጋገጺ',
            checkEmail: 'ንኮድ መረጋገጺ ኢሜይልካ ርኣይ',
            verifyCode: 'ኮድ ኣረጋግጽ',
            verifying: 'የረጋግጽ ኣሎ...',
            sendingCode: 'ኮድ ይሰድድ ኣሎ...',
            backToSignIn: 'ናብ መእተዊ ተመለስ',

            ownerSignInTitle: 'ናይ ንግዲ ዋና መእተዊ',
            ownerSignInSubtitle: 'ናይ ንግዲ ዳሽቦርድካ ርከብ፣ ስራሓት ኣመሓድር፣ ከምኡውን ኣፈጻጽማ ተኸታተል።',
            ownerWelcome: 'እንቋዕ ብደሓን መጻእካ — ንምቕጻል ሓበሬታኻ ኣእቱ።',

            supplierSignInTitle: 'ኣቕራቢ መእተዊ',
            supplierSignInSubtitle: 'ምርታትካ፣ ትእዛዛትካ ኣመሓድር፣ ከምኡውን ምስ ንግድታት ተራኽብ።',
            supplierWelcome: 'እንቋዕ ብደሓን መጻእካ — ናብ ኣቕራቢ መእተዊኻ እተው።',

            affiliateSignInTitle: 'መሻርኽቲ መእተዊ',
            affiliateSignInSubtitle: 'ሪፈራልካ፣ ኣታዊኻን ኣፈጻጽማኻን ተኸታተል።',
            affiliateWelcome: 'እንቋዕ ብደሓን መጻእካ — ናብ መሻርኽቲ ዳሽቦርድካ እተው።',

            businessName: 'ስም ንግዲ',
            tinNumber: 'ቁጽሪ መለለዪ ግብሪ (TIN)',
            phoneNumber: 'ቁጽሪ ስልክ',
            address: 'ኣድራሻ ንግዲ',
            licenseDocument: 'ሰነድ ፈቓድ ንግዲ',
            registerOwner: 'ከም ዋና ተመዝገብ',
            registerSupplier: 'ከም ኣቕራቢ ተመዝገብ',
            registerAffiliate: 'ከም መሻርኽቲ ተመዝገብ',
            ownerRegisterTitle: 'ናይ ንግዲ ምሕደራ ጉዕዞኻ ጀምር',
            ownerRegisterSubtitle: 'ነቲ ብ AI ዝሰርሕ መድረኽና ዝኣምኑ ኣሽሓት ዋናታት ንግዲ ተሓወስ።',
            supplierRegisterTitle: 'ናይ ዕዳጋ ተበጻሕነትካ ኣስፊሕ',
            supplierRegisterSubtitle: 'ምስ ኣሽሓት ንግድታት ተራኽብ እሞ መሸጣኻ ኣዕቢ።',
            affiliateRegisterTitle: 'ብመሶብ ምትራፍ ጀምር',
            affiliateRegisterSubtitle: 'ናይ መሻርኽቲ መደብና ተሓወስ እሞ ቀጻሊ ኮሚሽን ረብሕ።',

            resetPasswordTitle: 'መሕለፊ ቃል ዳግም ጀምር',
            resetPasswordSubtitleEmail: 'ናይ ዳግም መጀመሪ ኮድ ንምርካብ ኢሜይልካ ኣእቱ',
            resetPasswordSubtitleCode: 'ኮድን ሓዲሽ መሕለፊ ቃልን ኣእቱ',
            sendResetCode: 'ናይ ዳግም መጀመሪ ኮድ ስደድ',
            resetCode: 'ናይ ዳግም መጀመሪ ኮድ',
            newPassword: 'ሓዲሽ መሕለፊ ቃል',
            confirmPassword: 'መሕለፊ ቃል ኣረጋግጽ',
            resetPasswordButton: 'መሕለፊ ቃል ዳግም ጀምር',
            didntReceiveCode: "ኮድ ኣይበጽሓካን? እንደገና ፈትን",
        },

    },
};

