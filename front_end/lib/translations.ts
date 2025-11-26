// Professional, context-aware translations for English and Amharic
export type Language = 'en' | 'am';

export interface Translations {
    // Navbar
    nav: {
        features: string;
        howItWorks: string;
        security: string;
        pricing: string;
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

    // Cookie Consent
    cookieConsent: {
        title: string;
        description: string;
        learnMore: string;
        decline: string;
        accept: string;
    };
}

export const translations: Record<Language, Translations> = {
    en: {
        nav: {
            features: 'Features',
            howItWorks: 'How It Works',
            security: 'Security',
            pricing: 'Pricing',
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
        cookieConsent: {
            title: 'We use cookies',
            description: 'We use essential cookies for authentication and analytics cookies to improve your experience.',
            learnMore: 'Learn more',
            decline: 'Decline',
            accept: 'Accept',
        },
    },
    am: {
        nav: {
            features: 'ባህሪያት',
            howItWorks: 'እንዴት ይሰራል',
            security: 'ደህንነት',
            pricing: 'ዋጋ',
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
        cookieConsent: {
            title: 'ኩኪዎችን እንጠቀማለን',
            description: 'ለማረጋገጫ እና የተጠቃሚ ተሞክሮዎን ለማሻሻል አስፈላጊ ኩኪዎችን እና የትንታኔ ኩኪዎችን እንጠቀማለን።',
            learnMore: 'ተጨማሪ ይወቁ',
            decline: 'አይቀበሉ',
            accept: 'ይቀበሉ',
        },
    },
};
