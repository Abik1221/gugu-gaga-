#!/usr/bin/env python3
"""
Script to add missing translation keys for remaining pages.
This will add translations for Owner, Affiliate, Staff dashboards, Verify page, and Privacy page.
"""

# Translation keys to add - organized by section

OWNER_DASHBOARD_KEYS = {
    'main': {
        'en': {
            'welcomeBack': 'Welcome back',
            'subtitle': 'Monitor revenue, compare branches, and coach your pharmacy team from a single command center.',
            'refresh': 'Refresh',
            'connectTools': 'Connect tools',
            'inviteStaff': 'Invite staff',
            'totalSales': 'Total sales',
            'totalExpenses': 'Total expenses',
            'netProfit': 'Net profit',
           'lowStockItems': 'Low stock items',
            'upcomingRefills': 'Upcoming refills (7d)',
            'refreshSuccess': 'Analytics refreshed',
            'refreshSuccessMsg': 'Latest sales and inventory metrics are now visible.',
            'loading': 'Loading...',
        },
        'am': {
            'welcomeBack': 'እንኳን ደህና መጡ',
            'subtitle': 'ገቢን ይቆጣጠሩ፣ ቅርንጫፎችን ያወዳድሩ እና የመድሃኒት ቤት ቡድንዎን ከአንድ ማዕከላዊ ቦታ ያስተማሩ።',
            'refresh': 'አድስ',
            'connectTools': 'መሳሪያዎችን አገናኝ',
            'inviteStaff': 'ሰራተኞችን ጋብዝ',
            'totalSales': 'አጠቃላይ ሽያጭ',
            'totalExpenses': 'አጠቃላይ ወጪዎች',
            'netProfit': 'ተጣራ ትርፍ',
            'lowStockItems': 'ዝቅተኛ ክምችት ያላቸው እቃዎች',
            'upcomingRefills': 'የሚመጡ እንደገና መሙላቶች (7ቀ)',
            'refreshSuccess': 'ትንታኔዎች ተሻሽለዋል',
            'refreshSuccessMsg': 'የቅርብ ጊዜ ሽያጭ እና የእቃ ቁጥር መለኪያዎች አሁን ይታያሉ።',
            'loading': 'በመጫን ላይ...',
        },
        'or': {
            'welcomeBack': 'Baga nagaan deebi\'tan',
            'subtitle': 'Galii hordofaa, dameewwan walbira qabaatii garee faarmasii keessanii gorsa kennaa.',
            'refresh': 'Haaromsi',
            'connectTools': 'Meeshaalee walqunnamsiisi',
            'inviteStaff': 'Hojjettoota afeeraa',
            'totalSales': 'Gurgurtaa waliigalaa',
            'totalExpenses': 'Baasii waliigalaa',
            'netProfit': 'Bu\'aa qulqulluu',
            'lowStockItems': 'Meeshaalee kuusaa gadi aanaa qaban',
            'upcomingRefills': 'Guutinsa dhufaa (7g)',
            'refreshSuccess': 'Xiinxalli haaromfameera',
            'refreshSuccessMsg': 'Safartuu gurgurtaa fi kuusaa haaraa amma ni mul\'ata.',
            'loading': 'Fe\'ama jira...',
        },
        'ti': {
            'welcomeBack': 'እንቋዕ ደሓን መፃእኩም',
            'subtitle': 'ኣታዊ ቆፃፀሩ፡ ጨንፈራት ኣወዳድሩ እቲ ናይ ፋርማሲ ጋንታኹም ካብ ሓደ ማእከላይ ቦታ መኸሩ።',
            'refresh': 'ኣሐድስ',
            'connectTools': 'መሳርሒታት ኣራኽብ',
            'inviteStaff': 'ሰራሕተኛታት ዕድም',
            'totalSales': 'ጠቅላላ ሽያጥ',
            'totalExpenses': 'ጠቅላላ ወፃኢታት',
            'netProfit': 'ፅሩይ መኽሰብ',
            'lowStockItems': 'ትሑት ዕቑብ ዘለዎም ኣቕሑ',
            'upcomingRefills': 'ዝመፅእ ምምላእ (7መ)',
            'refreshSuccess': 'ትንፈሻታት ተሐዲሶም',
            'refreshSuccessMsg': 'ናይ ቀረባ እዋን ሽያጥን ዕቑብን መዐቀኒታት ሐዚ ርእይዎ።',
            'loading': 'ብምፅዓን ላይ...',
        },
    }
}

AFFILIATE_DASHBOARD_KEYS = {
    'main': {
        'en': {
            'title': 'Affiliate Dashboard',
            'subtitle': 'Track your referrals and commissions',
            'totalReferrals': 'Total Referrals',
            'activeReferrals': 'Active Referrals',
            'totalCommissions': 'Total Commissions',
            'pendingPayouts': 'Pending Payouts',
            'generateLink': 'Generate Link',
            'viewCommissions': 'View Commissions',
        },
        'am': {
            'title': 'የአጋር መቆጣጠሪያ ሰሌዳ',
            'subtitle': 'የእርስዎን ተወካይነቶች እና ኮሚሽኖች ይከታተሉ',
            'totalReferrals': 'አጠቃላይ ማጣቀሻዎች',
            'activeReferrals': 'ንቁ ማጣቀሻዎች',
            'totalCommissions': 'አጠቃላይ ኮሚሽኖች',
            'pendingPayouts': 'በመጠባበቅ ላይ ያሉ ክፍያዎች',
            'generateLink': 'አገናኝ አመንጭ',
            'viewCommissions': 'ኮሚሽኖችን ይመልከቱ',
        },
        'or': {
            'title': 'Daashboordii Hiriyaa',
            'subtitle': 'Qajeelfama fi komishinii keessan hordofaa',
            'totalReferrals': 'Qajeelfama waliigalaa',
            'activeReferrals': 'Qajeelfama hojii irra jiran',
            'totalCommissions': 'Komishinii waliigalaa',
            'pendingPayouts': 'Kaffaltii eegaa jiru',
            'generateLink': 'Hidhaa uumaa',
            'viewCommissions': 'Komishinii ilaalaa',
        },
        'ti': {
            'title': 'ዳሽቦርድ ኣጋር',
            'subtitle': 'ምርኮሳታትኩምን ኮሚሽንኩምን ተኸታተሉ',
            'totalReferrals': 'ጠቅላላ ምርኮሳታት',
            'activeReferrals': 'ንጡፋት ምርኮሳታት',
            'totalCommissions': 'ጠቅላላ ኮሚሽናት',
            'pendingPayouts': 'ዝጽበዩ ክፍሊታት',
            'generateLink': 'መወከሲ ፍጠር',
            'viewCommissions': 'ኮሚሽናት ርአ',
        },
    }
}

STAFF_DASHBOARD_KEYS = {
    'inventory': {
        'en': {
            'title': 'Inventory Management',
            'subtitle': 'Manage stock levels and product inventory',
            'addProduct': 'Add Product',
            'searchProducts': 'Search products...',
            'inStock': 'In Stock',
            'lowStock': 'Low Stock',
            'outOfStock': 'Out of Stock',
        },
        'am': {
            'title': 'የእቃ ቁጥር አስተዳደር',
            'subtitle': 'የእቃ ደረጃዎችን እና የምርት ዝርዝርን ያስተዳድሩ',
            'addProduct': 'ምርት ያክሉ',
            'searchProducts': 'ምርቶችን ፈልግ...',
            'inStock': 'በክምችት ውስጥ',
            'lowStock': 'ዝቅተኛ ክምችት',
            'outOfStock': 'ከክምችት ውጭ',
        },
        'or': {
            'title': 'Bulchiinsa Kuusaa',
            'subtitle': 'Sadarkaa kuusaa fi kuusa oomishaa bulchaa',
            'addProduct': 'Oomisha ida\'i',
            'searchProducts': 'Oomisha barbaadaa...',
            'inStock': 'Kuusaa keessa',
            'lowStock': 'Kuusaa gadi aanaa',
            'outOfStock': 'Kuusaa ala',
        },
        'ti': {
            'title': 'ምሕደራ ዕቑብ',
            'subtitle': 'ደረጃ ዕቑብን ዕቑብ ፍርያትን ኣመሓዝር',
            'addProduct': 'ፍርያት ውሰኽ',
            'searchProducts': 'ፍርያት ድለ...',
            'inStock': 'ብዕቑብ ውሽጢ',
            'lowStock': 'ትሑት ዕቑብ',
            'outOfStock': 'ካብ ዕቑብ ወፃኢ',
        },
    }
}

VERIFY_PAGE_KEYS = {
    'main': {
        'en': {
            'title': 'Verify Your Email',
            'subtitle': 'Enter the verification code sent to your email',
            'emailLabel': 'Email Address',
            'codeLabel': 'Verification Code',
            'verifyButton': 'Verify Email',
            'resendCode': 'Resend Code',
            'resendingIn': 'Resend in',
            'seconds': 'seconds',
            'successTitle': 'Email Verified!',
            'successMessage': 'Your email has been successfully verified.',
            'errorTitle': 'Verification Failed',
            'errorMessage': 'Invalid verification code. Please try again.',
        },
        'am': {
            'title': 'ኢሜልዎን ያረጋግጡ',
            'subtitle': 'ወደ ኢሜልዎ የተላለፈውን የማረጋገጫ ኮድ ያስገቡ',
            'emailLabel': 'የኢሜል አድራሻ',
            'codeLabel': 'የማረጋገጫ ኮድ',
            'verifyButton': 'ኢሜል አረጋግጥ',
            'resendCode': 'ኮድ እንደገና ላክ',
            'resendingIn': 'እንደገና በ',
            'seconds': 'ሰከንዶች',
            'successTitle': 'ኢሜል ተረጋግጧል!',
            'successMessage': 'ኢሜልዎ በተሳካ ሁኔታ ተረጋግጧል።',
            'errorTitle': 'ማረጋገጫ አልተሳካም',
            'errorMessage': 'ልክ ያልሆኑ የማረጋገጫ ኮድ። እባክዎ እንደገና ይሞክሩ።',
        },
        'or': {
            'title': 'Imeelii Keessan Mirkaneessaa',
            'subtitle': 'Koodii mirkaneessa imeelii keessaniitti ergame galchaa',
            'emailLabel': 'Teessoo Imeelii',
            'codeLabel': 'Koodii Mirkaneessaa',
            'verifyButton': 'Imeelii Mirkaneessi',
            'resendCode': 'Koodii Deebisuun Ergaa',
            'resendingIn': 'Deebisuun',
            'seconds': 'sekundii',
            'successTitle': 'Imeeliin Mirkana\'eera!',
            'successMessage': 'Imeeliin keessan milkaa\'ina galiin mirkana\'eera.',
            'errorTitle': 'Mirkaneessuun Hin Milkoofne',
            'errorMessage': 'Koodii mirkaneessaa dogoggoraa. Maaloo irra deebi\'aa yaalam.',
        },
        'ti': {
            'title': 'ኢሜይልኩም ኣረጋግፁ',
            'subtitle': 'ናብ ኢሜይልኩም ዝተለኣኾ ናይ ምርግጋፅ ኮድ ኣእትዉ',
            'emailLabel': 'ኣድራሻ ኢሜይል',
            'codeLabel': 'ናይ ምርግጋፅ ኮድ',
            'verifyButton': 'ኢሜይል ኣረጋግፅ',
            'resendCode': 'ኮድ ደጋጊምካ ለኣኽ',
            'resendingIn': 'ደጋጊምካ ብ',
            'seconds': 'ካልኣይት',
            'successTitle': 'ኢሜይል ተረጋገፀ!',
            'successMessage': 'ኢሜይልኩም ብዓወት ተረጋጊፁ።',
            'errorTitle': 'ምርግጋፅ ኣይተዓወተን',
            'errorMessage': 'ዘይልክዕ ናይ ምርግጋፅ ኮድ። በጃኹም እንደገና ፈትኑ።',
        },
    }
}

print("Translation keys prepared. These will be added to translations.ts manually.")
