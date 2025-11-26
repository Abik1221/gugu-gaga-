#!/usr/bin/env python3
"""
Script to add Contact and Privacy translations to the translations.ts file for Amharic, Afaan Oromo, and Tigrinya
"""

import re

# Read the translations file
with open('/home/v3idt/Documents/gugu-gaga-/front_end/lib/translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Amharic translations
amharic_contact_privacy = """        contactPage: {
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
        },"""

# Afaan Oromo translations  
oromo_contact_privacy = """        contactPage: {
            title: 'Agarsiisa Beellama',
            subtitle: 'Mesob hojmaata daldalaa keessanii akkamitti jijjiiruu akka danda\\'u ilaaluuf qophii dhaa? Agarsiisa dhuunfaa barbaachisummaa keessaniif mijatu haa qindeessinu.',
            formHeading: 'Agarsiisa Kee Gaafadhu',
            nameLabel: 'Maqaa Guutuu*',
            emailLabel: 'Teessoo Emaila*',
            companyLabel: 'Maqaa Dhaabbataa/Daldala',
            messageLabel: 'Waa\\'ee barbaachisummaa keessanii nutti himaa',
            messagePlaceholder: 'Rakkoolee kamtu daldala keessan irratti mul\\'ata? Amaltoonni kamtu irratti abdii qabdu?',
            submitButton: 'Agarsiisa Koo Qindeessi',
            submitting: 'Gaafata ergaa jira...',
            successTitle: 'Gaafatan Agarsiisaa Ergame!',
            successMessage: 'Agarsiisa dhuunfaa keessan qindeessuuf sa\\'aatii 24 keessatti isin quunnamna.',
            contactInfoHeading: 'Nu Quunnamaa',
            emailHeading: 'Emaila',
            emailText: 'nahomkeneni4@gmail.com',
            emailResponseTime: 'Sa\\'aatii 24 keessatti deebii kennina',
            phoneHeading: 'Bilbila',
            phoneText: '+251983446134',
            phoneHours: 'Wiix-Jum, 9AM-6PM EAT',
            officeHeading: 'Waajjira',
            officeAddress: 'Boolee, Finfinnee, Itoophiyaa',
            officeHours: 'Sa\\'aatii Hojii: Wiixata - Jimaata, 8:30 ganama - 5:30 galgala (Sa\\'aatii Afrikaa Bahaa)',
            demoExpectationsHeading: 'Agarsiisa Keessan Keessatti Maal Eeguu Akka Qabdan',
            demoExpectation1: '• Qajeelfama dhuunfaa daqiiqaa 30',
            demoExpectation2: '• Amaltoo gosa daldala keessaniif addaa ta\\'e ilaalaa',
            demoExpectation3: '• Gaaffii fi Deebii kallattiin ogeeyyii oomishaa keenya waliin',
            demoExpectation4: '• Marii gatii dhuunfaa',
            demoExpectation5: '• Sagantaa yeroo hojiirra oolmaa fi deeggarsa',
        },
        privacyPage: {
            pageTitle: 'Imaammata Dhuunfummaa',
            pageSubtitle: 'Dhuunfummaan keessan nuuf barbaachisaa dha. Imaammanni kun akkamitti Mesob AI odeeffannoo dhuunfaa keessanii walitti qabuu, itti fayyadamuu fi eeguu isaa ibsa.',
            lastUpdated: 'Yeroo dhumaatti haaromfame:',
            section1Heading: 'Odeeffannoo Walitti Qabnu',
            section1Body: 'Galmee yeroo kennitanirraa odeeffannoo daldala kanneen akka: maqaa daldalaa, bal\\'ina abbaa daldala, lakkoofsa eenyummaa gibira (TIN), hayyama daldala, odeeffannoo quunnamtii fi bal\\'ina baankii kaffaltii adeemsiisuuf walitti qabna. Akkasumas, tajaajila keenya bu\\'uura qabeessa ta\\'een kennuuf daataa daldalaa, galmeewwan qabeenya fi galmeewwan itti fayyadama walitti qabna.',
            section2Heading: 'Odeeffannoo Keessan Akkamitti Itti Fayyadamna',
            section2Body: 'Odeeffannoon keessan tajaajilaalee waltajjii kennuuf, karaa sirna baankii Itoophiyaa kaffaltii adeemsiisuuf, ragaa gibira wajjin walsimu maddisiisuu, qabeenya bulchuu, walqunnamtii dhiyeessitaa haala mijeessuuf akkasumas hubannoo daldala AI\\'n hojjatu kennuuf kan itti fayyadamudha. Dambii daldala Itoophiyaa waliin walsimuun hojjenna akkasumas odeeffannoo dhuunfaa ykn daldala keessanii qaamolee sadaffaaf gonkumaa hin gurgurru.',
            section3Heading: 'Kuusaa fi Nageenya Daataa',
            section3Body: 'Daataan keessan yeroo sochii fi boqonnaa eegumsa wajjin nagaan kuufama. Mirkaneessa sadarkaa hedduu, sakatta\\'iinsa nageenya idilee fi to\\'annoo qaqqabummaa hojiirra oolchina. Infrastructure keenna tajaajila duumessa addunyaa itti fayyadamuun ni danda\\'ama, garuu walsimsiisaa sadarkaa eegumsa daataa Itoophiyaa ni mirkaneessina akkasumas yeroo seerri barbaadu abbaa ta\\'ummaa daataa ni eegna.',
            section4Heading: 'Seera Itoophiyaa Waliin Walsimsiisuu',
            section4Body: 'Seera daldala Itoophiyaa, dambii gibira fi barbaachisummaa hayyama daldala guutuun walsimsiifnee hojjenna. Ministiraa Daldala fi Indastriitii fi Taayitaa Galii fi Kaastamii Itoophiyaan akka barbaadaman galmee ni qabanna. Daataan daldalaa seera Itoophiyaa waliin (waggaa 5 xiqqaate kaayyoo gibiraf) ni kuufama.',
            section5Heading: 'Daataa Qooduun fi Ibsuu',
            section5Body: 'Daataa dhiyeessitaa tajaajila amanamoo (adeemsitaa kaffaltii, dhiyeessitaa SMS, keessummeessa duumessa) qofa waliin waliigaltee iccitii ciccimaa jalatti qoodna. Yeroo seerri barbaadu (sakatta\\'iinsa gibira, walsimsiisaa dambiilee, ajaja mana murtii) odeeffannoo abbaa taayitaa mootummaa Itoophiyaatti ibsuu ni dandenya. Odeeffannoo daldala keessanii qaamolee mormitoota ykn sadaffaa hayyama hin qabneen gonkumaa hin qoodnu.',
            section6Heading: 'Daataa Kaffaltii fi Faayinaansii',
            section6Body: 'Adeemsi kaffaltii karaa dhiyeessitaa tajaajila kaffaltii Itoophiyaa hayyama qabaniin kan adeemsifamudha. Odeeffannoo baankii kaffaltii maamilummaa fi kaffaltii dhiyeessitaaf nagaan ni kuusna. Daldalaa faayinaansii hunduu dambii Baankii Federaalaa Itoophiyaa fi barbaachisummaa yakka maallaqaa irratti loluun walsima.',
            section7Heading: 'Mirga Keessan',
            section7Body: 'Odeeffannoo dhuunfaa keessan qaqqabuu, sirreessuu ykn haquu ni dandeessu. Daataa daldala keessanii yeroo kamiyyuu karaa qindaa\\'ina akkaawuntii keessaniin erguu dandeessu. Gaafata haqaaf, galmeewwan seera Itoophiyaan barbaadaman kan qabannee guyyaa 30 keessatti ni eegna. Hayyama quunnamtii gabaa yeroo kamiyyuu dhiisuu ni dandeessu.',
            section8Heading: 'Abbaa Ta\\'ummaa Daataa Daldala',
            section8Body: 'Daataa daldala keessanii kanneen akka: galmeewwan qabeenya, odeeffannoo maamilaa, daataa gurgurtaa fi galmeewwan faayinaansii of qabaachuun ni jiraattu. Akkaawuntiin yeroo cufamu daataa keessan hunduu erguu ni dandeessu. Si bakkeessinee akka adeemsitaa daataatti hojjenna akkasumas odeeffannoo daldala keessanii abbaa ta\\'ummaa hin gaafannu.',
            section9Heading: 'Kuukii fi Hordoffii',
            section9Body: 'Kuukii barbaachisaa mirkaneesuuf fi bulchiinsa seeshinii, akkasumas kuukii xiinxalalaa raawwii waltajjii fooyyessuuf itti fayyadamna. Kuukii beeksisa qaama sadaffaa hin fayyadamnu. Kuukiin barbaachisaa hojii waltajjii barbaachisu ta\\'us, qindaa\\'ina browser keessanii keessatti filannoo kuukii bulchuu dandeessu.',
            section10Heading: 'Imaammata Kanaaf Haaromsaa',
            section10Body: 'Imaammata kana jijjiirama dambii Itoophiyaa ykn tajaajiloota keenyaa irratti mul\\'ataniif haaromsuuf ni dandenya. Jijjiiramni barbaachisaa emaila fi beeksisa app keessaa karaa ta\\'ee yoo xiqqaate guyyaa 14 dura kan beeksifamudha. Guyyaa hojiirra ooluu booda itti fufuun imaammata haaromfame fudhachuu agarsiisa.',
            contactUsHeading: 'Nu Quunnamaa',
            contactUsIntro: 'Waa\\'ee Imaammata Dhuunfummaa kanaa ykn akkamitti daataa keessan akka bulchinu gaaffii yoo qabaattan mee nu quunnamaa:',
            contactEmail: 'Emaila:',
            contactPhone: 'Bilbila: +251983446134',
            contactAddress: 'Teessoo: Boolee, Finfinnee, Itoophiyaa',
            contactBusinessHours: 'Sa\\'aatii Hojii: Wiixata - Jimaata, 8:30 ganama - 5:30 galgala (Sa\\'aatii Afrikaa Bahaa)',
            termsLink: 'Waliigaltee Tajaajila Keenya Dubbisaa →',
        },"""

# Tigrinya translations
tigrinya_contact_privacy = """        contactPage: {
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
        },"""

# Find and replace each language section
# Amharic
am_pattern = r"(cookieConsent: \{[^}]+\},\s+)(\},\s+or: \{)"
am_replacement = rf"contactPage: {{\n{amharic_contact_privacy}\n        cookieConsent: {{\n            title: 'ኩኪዎችን እንጠቀማለን',\n            description: 'ለማረጋገጫ እና የተጠቃሚ ተሞክሮዎን ለማሻሻል አስፈላጊ ኩኪዎችን እና የትንታኔ ኩኪዎችን ን እንጠቀማለን።',\n            learnMore: 'ተጨማሪ ይወቁ',\n            decline: 'አይቀበሉ',\n            accept: 'ይቀበሉ',\n        }},\n    }},\n    or: {{"

content = re.sub(am_pattern, am_replacement, content, count=1, flags=re.DOTALL)

# Oromo  
or_pattern = r"(        cookieConsent: \{\s+title: 'Kukii fayyadamna',[^}]+\},\s+)(\},\s+ti: \{)"
or_replacement = rf"{oromo_contact_privacy}\n        cookieConsent: {{\n            title: 'Kukii fayyadamna',\n            description: 'Kukii barbaachisaa mirkaneesuuf fi kukii xiinxalaa muuxannoo kee fooyyessuuf fayyadamna.',\n            learnMore: 'Dabalataan baruu',\n            decline: 'Diduu',\n            accept: 'Fudhu',\n        }},\n    }},\n    ti: {{"

content = re.sub(or_pattern, or_replacement, content, count=1, flags=re.DOTALL)

# Tigrinya
ti_pattern = r"(        cookieConsent: \{\s+title: 'ኩኪታት ንጥቀም ኢና',[^}]+\},\s+)(\},\s+\};)"
ti_replacement = rf"{tigrinya_contact_privacy}\n        cookieConsent: {{\n            title: 'ኩኪታት ንጥቀም ኢና',\n            description: 'ንምርግጋጽን ተመኩሮኻ ንምምሕያሽን ዘድልዩ ኩኪታትን ናይ ትንተና ኩኪታትን ንጥቀም።',\n            learnMore: 'ተወሳኺ ፍለጥ',\n            decline: 'ኣይቀበልን',\n            accept: 'ይቀበል',\n        }},\n    }},\n}};\n"

content = re.sub(ti_pattern, ti_replacement, content, count=1, flags=re.DOTALL)

# Write back the file
with open('/home/v3idt/Documents/gugu-gaga-/front_end/lib/translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Contact and Privacy translations added successfully for all languages!")
