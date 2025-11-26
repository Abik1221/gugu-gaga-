import re
import os

file_path = r'd:\mesob\gugu-gaga-\front_end\components\sections\PricingSection.tsx'

if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the isAmharic line to support Afaan Oromo detection
content = content.replace(
    '  // Get the current language\n  const isAmharic = t.nav.features === "ባህሪያት";',
    '''  // Get the current language
  const getCurrentLang = () => {
    if (t.nav.features === "ባህሪያት") return "am";
    if (t.nav.features === "Amaloota") return "or";
    return "en";
  };
  const currentLang = getCurrentLang();
  const isAmharic = currentLang === "am";
  const isOromo = currentLang === "or";'''
)

# Update rendering logic to support Afaan Oromo in plan names
content = content.replace(
    '{isAmharic ? plan.nameAm || plan.name : plan.name}',
    '{isOromo ? plan.nameOr || plan.name : isAmharic ? plan.nameAm || plan.name : plan.name}'
)

# Update description rendering
content = content.replace(
    '{isAmharic ? plan.descriptionAm || plan.description : plan.description}',
    '{isOromo ? plan.descriptionOr || plan.description : isAmharic ? plan.descriptionAm || plan.description : plan.description}'
)

# Update period rendering
content = content.replace(
    '{isAmharic ? plan.periodAm || plan.period : plan.period}',
    '{isOromo ? plan.periodOr || plan.period : isAmharic ? plan.periodAm || plan.period : plan.period}'
)

# Update feature rendering
content = content.replace(
    '(isAmharic ? feature.am : feature.en)',
    '(isOromo ? feature.or : isAmharic ? feature.am : feature.en)'
)

# Update CTA rendering (two instances)
content = content.replace(
    '{isAmharic ? plan.ctaAm || plan.cta : plan.cta}',
    '{isOromo ? plan.ctaOr || plan.cta : isAmharic ? plan.ctaAm || plan.cta : plan.cta}'
)

# Update footer text translations
footer_translations = '''  // Footer text translations
  const footerTexts = {
    en: {
      allPlans: "All plans include secure data encryption, regular backups, and Ethiopian Birr support.",
      ownerQuestion: "Need a custom enterprise solution?",
      supplierQuestion: "Ready to join our supplier network?",
      contact: "Contact us"
    },
    am: {
      allPlans: "ሁሉም ዕቅዶች ደህንነቱ የተጠበቀ የመረጃ ምስጠራ፣ መደበኛ መለጋገጫዎች እና የኢትዮጵያ ብር ድጋፍን ያካትታሉ።",
      ownerQuestion: "ብጁ የድርጅት መፍትሄ ይፈልጋሉ?",
      supplierQuestion: "የአቅራቢዎች አውታረ መረብ ለመቀላቀል ዝግጁ ነዎት?",
      contact: "ያነጋግሩን"
    },
    or: {
      allPlans: "Karoora hunduu icciitii odeeffannoo nageenyaa, kuusaa yeroo hunda, fi deeggarsa Qarshii Itoophiyaa dabalata.",
      ownerQuestion: "Furmaata dhaabbata dhuunfaa barbaadduu?",
      supplierQuestion: "Network dhiyeessitootaa keenyatti makamuu qophiidha?",
      contact: "Nu qunnamaa"
    }
  };
  const ft = footerTexts[currentLang];

  return ('''

content = content.replace(
    '  return (',
    footer_translations
)

# Update footer text usage
content = content.replace(
    '''All plans include secure data encryption, regular backups, and
            Ethiopian Birr support.
            <br />
            {selectedType === "owner"
              ? "Need a custom enterprise solution?"
              : "Ready to join our supplier network?"}{" "}
            <a href="/contact" className="text-emerald-600 underline">
              Contact us
            </a>''',
    '''{ft.allPlans}
            <br />
            {selectedType === "owner" ? ft.ownerQuestion : ft.supplierQuestion}{" "}
            <a href="/contact" className="text-emerald-600 underline">
              {ft.contact}
            </a>'''
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated rendering logic.")
