import re
import os

file_path = r'd:\mesob\gugu-gaga-\front_end\components\sections\PricingSection.tsx'

if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
    exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define translations in order of appearance in the file
# Owner Plans
owner_free_trial = {
    'nameOr': 'Yaalii Bilisaa',
    'periodOr': 'Guyyaa 30',
    'descriptionOr': 'Amaloota hunda yaaluuf gaarii',
    'ctaOr': 'Yaalii Bilisaa Jalqabi',
    'features': [
        'Amaloota Premium hunda dabalatee',
        'Bulchiinsa damee hedduu',
        'Seensa AI Eegduu Qarshii',
        'Walitti makuu hunda banameera',
        'Gabaa dhiyeessitootaa',
        'Dashboard xiinxala guutuu',
        'Gargaarsa dursa'
    ]
}

owner_essential = {
    'nameOr': "Bu'uraa",
    'periodOr': "Qarshii/ji'a",
    'descriptionOr': "Daldala damee tokkoof",
    'ctaOr': "Jalqabi",
    'features': [
        "Bulchiinsa damee tokko",
        "Haasawa AI Eegduu Qarshii",
        "Walitti makuu bu'uraa",
        "Hordoffii qarshii fi akeekkachisaa",
        "Xiinxala gurgurtaa",
        "Bulchiinsa hojjetaa (hanga fayyadamtoota 5)",
        "Gargaarsa email",
        "Seensa app mobaayilaa"
    ]
}

owner_professional = {
    'nameOr': "Ogeessa",
    'periodOr': "Qarshii/ji'a",
    'descriptionOr': "Daldala damee hedduu guddinaaf",
    'ctaOr': "Ogeessa Ta'i",
    'features': [
        "Damee daangaa hin qabne",
        "Hubannoo AI olaanaa fi tilmaamaa",
        "Walitti makuu hunda (Google Sheets, ERP, kkf)",
        "Seensa gabaa dhiyeessitootaa",
        "Hirmaannaa sagantaa hiriyyaa",
        "Gargaarsa AI dursa 24/7",
        "Akkaawuntii hojjetaa daangaa hin qabne",
        "Xiinxala olaanaa fi gabaasa",
        "Walitti makuu dhuunfaa",
        "Hogganaa akkaawuntii addaa"
    ]
}

# Supplier Plans
supplier_free_trial = {
    'nameOr': 'Yaalii Bilisaa',
    'periodOr': 'Guyyaa 30',
    'descriptionOr': 'Amaloota dhiyeessaa hunda yaali',
    'ctaOr': 'Yaalii Bilisaa Jalqabi',
    'features': [
        "Amaloota Guddina hunda dabalatee",
        "Bulchiinsa kaatalooga oomishaa",
        "Adeemsa ajaja",
        "Qunnamtii maamiltootaa",
        "Xiinxala olaanaa",
        "Tarree gabaa dursa",
        "Gargaarsa 24/7"
    ]
}

supplier_starter = {
    'nameOr': "Jalqabaa",
    'periodOr': "Qarshii/ji'a",
    'descriptionOr': "Dhiyeessitoonni xixiqqoof gaarii",
    'ctaOr': "Dhiyeessuu Jalqabi",
    'features': [
        "Bulchiinsa kaatalooga oomishaa",
        "Adeemsa ajaja bu'uraa",
        "Qunnamtii maamiltootaa",
        "Hordoffii kaffaltii",
        "Gabaasa ji'aa",
        "Gargaarsa email"
    ]
}

supplier_growth = {
    'nameOr': "Guddina",
    'periodOr': "Qarshii/ji'a",
    'descriptionOr': "Daldala dhiyeessaa babal'atuuf",
    'ctaOr': "Daldala Kee Babal'isi",
    'features': [
        "Wanti Jalqabaa keessa jiru hunda",
        "Xiinxala olaanaa",
        "Bulchiinsa ajaja bal'aa",
        "Tilmaamaa qarshii",
        "Tarree gabaa dursa",
        "Gargaarsa bilbilaa 24/7",
        "Maqaa dhuunfaa"
    ]
}

supplier_enterprise = {
    'nameOr': "Dhaabbata",
    'periodOr': "Nu qunnamaa",
    'descriptionOr': "Dhiyeessitoonni bal'aa guddaaf",
    'ctaOr': "Gurgurtaa Qunnamaa",
    'features': [
        "Wanti Guddina keessa jiru hunda",
        "Seensa API",
        "Walitti makuu dhuunfaa",
        "Hogganaa akkaawuntii addaa",
        "Furmaata adii-maqaa",
        "Wabii SLA",
        "Leenjii bakka irratti"
    ]
}

plans = [
    owner_free_trial, owner_essential, owner_professional,
    supplier_free_trial, supplier_starter, supplier_growth, supplier_enterprise
]

parts = content.split('name: "')
new_content = parts[0]

for i, part in enumerate(parts[1:]):
    if i >= len(plans):
        new_content += 'name: "' + part
        continue

    current_plan = plans[i]
    
    # Inject nameOr
    part = re.sub(r'(nameAm: ".*?",)', f'\\1\n      nameOr: "{current_plan["nameOr"]}",', part, count=1)
    
    # Inject periodOr
    part = re.sub(r'(periodAm: ".*?",)', f'\\1\n      periodOr: "{current_plan["periodOr"]}",', part, count=1)
    
    # Inject descriptionOr
    part = re.sub(r'(descriptionAm: ".*?",)', f'\\1\n      descriptionOr: "{current_plan["descriptionOr"]}",', part, count=1)
    
    # Inject ctaOr
    part = re.sub(r'(ctaAm: ".*?",)', f'\\1\n      ctaOr: "{current_plan["ctaOr"]}",', part, count=1)
    
    # Inject features
    feature_translations = current_plan['features']
    
    features_start = part.find('features: [')
    features_end = part.find('],', features_start)
    
    if features_start != -1 and features_end != -1:
        features_block = part[features_start:features_end]
        lines = features_block.split('\n')
        new_lines = []
        feat_idx = 0
        for line in lines:
            if 'am: "' in line and feat_idx < len(feature_translations):
                or_text = feature_translations[feat_idx]
                line = re.sub(r'(am: ".*?")', f'\\1, or: "{or_text}"', line)
                feat_idx += 1
            new_lines.append(line)
        
        new_features_block = '\n'.join(new_lines)
        part = part[:features_start] + new_features_block + part[features_end:]
        
    new_content += 'name: "' + part

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully injected Afaan Oromo translations.")
