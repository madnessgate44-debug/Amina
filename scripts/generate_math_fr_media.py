"""Generate the 2026/2027 Term 1 French Maths diagram assets.

Run once when a lesson is added:
    python3 scripts/generate_math_fr_media.py

Writes one SVG per new lesson into media-src/math/ and prints the catalog
entries to paste into src/data/media/mediaCatalog.ts. Every diagram is a
numbered worked-method figure whose steps come from the lesson objectives, so
the asset teaches the same method the lesson teaches.
"""
import json
import os

LESSONS = [
    (1, 6, 'estimate_decimal_sum', 'Estimer la somme des décimaux',
     'Estimating decimal sums', 'تقدير مجموع الأعداد العشرية',
     '6,8 + 2,3 ≈ 7 + 2 = 9', '6.8 + 2.3 ≈ 7 + 2 = 9', '٦٫٨ + ٢٫٣ ≈ ٧ + ٢ = ٩',
     [('Arrondir chaque nombre', 'Round each number', 'قرّب كل عدد'),
      ('Additionner les arrondis', 'Add the rounded values', 'اجمع القيم المقرّبة'),
      ('Comparer au résultat exact', 'Compare with the exact result', 'قارن بالناتج الدقيق')]),
    (1, 7, 'model_decimal_addition', 'Modéliser l’addition décimale',
     'Modelling decimal addition', 'نمذجة جمع الأعداد العشرية',
     '3,50 + 1,25 = 4,75', '3.50 + 1.25 = 4.75', '٣٫٥٠ + ١٫٢٥ = ٤٫٧٥',
     [('Aligner les virgules', 'Line up the decimal points', 'حاذِ الفاصلة العشرية'),
      ('Compléter avec des zéros', 'Fill in with zeros', 'أكمل بالأصفار'),
      ('Additionner par rang', 'Add place by place', 'اجمع حسب المرتبة')]),
    (1, 8, 'subtract_decimals', 'Soustraire des nombres décimaux',
     'Subtracting decimals', 'طرح الأعداد العشرية',
     '5,2 − 0,8 = 4,4', '5.2 − 0.8 = 4.4', '٥٫٢ − ٠٫٨ = ٤٫٤',
     [('Aligner les virgules', 'Line up the decimal points', 'حاذِ الفاصلة'),
      ('Emprunter une unité', 'Borrow one unit', 'استلف وحدة'),
      ('Vérifier par l’addition', 'Check by adding back', 'تحقق بالجمع')]),
    (1, 9, 'estimate_decimal_difference', 'Estimer la différence des décimaux',
     'Estimating decimal differences', 'تقدير فرق الأعداد العشرية',
     '9,7 − 4,1 ≈ 10 − 4 = 6', '9.7 − 4.1 ≈ 10 − 4 = 6', '٩٫٧ − ٤٫١ ≈ ١٠ − ٤ = ٦',
     [('Arrondir les deux nombres', 'Round both numbers', 'قرّب العددين'),
      ('Soustraire les arrondis', 'Subtract the rounded values', 'اطرح القيم المقرّبة'),
      ('Contrôler la virgule', 'Check the decimal point', 'تحقق من الفاصلة')]),
    (1, 10, 'subtract_thousandths', 'Soustraire jusqu’aux millièmes',
     'Subtracting to thousandths', 'الطرح حتى الجزء من ألف',
     '2,400 − 0,875 = 1,525', '2.400 − 0.875 = 1.525', '٢٫٤٠٠ − ٠٫٨٧٥ = ١٫٥٢٥',
     [('Écrire trois décimales', 'Write three decimals', 'اكتب ثلاثة أجزاء عشرية'),
      ('Compléter avec des zéros', 'Fill in with zeros', 'أكمل بالأصفار'),
      ('Soustraire par rang', 'Subtract place by place', 'اطرح حسب المرتبة')]),
    (1, 11, 'decimal_word_problem', 'Problèmes sur les décimaux',
     'Decimal word problems', 'مسائل على الأعداد العشرية',
     '12,5 − 4,75 = 7,75', '12.5 − 4.75 = 7.75', '١٢٫٥ − ٤٫٧٥ = ٧٫٧٥',
     [('Lire ce que l’on cherche', 'Read what is asked', 'اقرأ المطلوب'),
      ('Choisir l’opération', 'Choose the operation', 'اختر العملية'),
      ('Écrire l’unité', 'Write the unit', 'اكتب الوحدة')]),
    (2, 2, 'variable_equations', 'Variables dans les équations',
     'Variables in equations', 'المتغيرات في المعادلات',
     'x + 7 = 12 donc x = 5', 'x + 7 = 12 so x = 5', 'س + ٧ = ١٢ إذن س = ٥',
     [('Repérer l’inconnue', 'Spot the unknown', 'حدد المجهول'),
      ('Faire l’opération inverse', 'Do the inverse operation', 'اعمل العملية العكسية'),
      ('Vérifier la solution', 'Check the solution', 'تحقق من الحل')]),
    (2, 3, 'number_story', 'Raconter des histoires au moyen des nombres',
     'Telling stories with numbers', 'حكاية قصص بالأعداد',
     '3 × 6 + 2 = 20', '3 × 6 + 2 = 20', '٣ × ٦ + ٢ = ٢٠',
     [('Repérer les groupes', 'Spot the groups', 'حدد المجموعات'),
      ('Multiplier puis ajouter', 'Multiply then add', 'اضرب ثم أضف'),
      ('Raconter le résultat', 'Tell the result', 'احكِ الناتج')]),
    (2, 6, 'identify_multiples', 'Identifier les multiples',
     'Identifying multiples', 'تحديد المضاعفات',
     '4, 8, 12, 16, 20, 24…', '4, 8, 12, 16, 20, 24…', '٤، ٨، ١٢، ١٦، ٢٠، ٢٤…',
     [('Multiplier par un entier', 'Multiply by a whole number', 'اضرب في عدد صحيح'),
      ('Écrire la suite', 'Write the list', 'اكتب السلسلة'),
      ('Vérifier le reste nul', 'Check the remainder is zero', 'تحقق أن الباقي صفر')]),
    (2, 8, 'factors_or_multiples', 'Facteurs ou multiples',
     'Factors or multiples', 'العوامل أو المضاعفات',
     '3 × 8 = 24', '3 × 8 = 24', '٣ × ٨ = ٢٤',
     [('3 et 8 sont des facteurs', '3 and 8 are factors', '٣ و٨ عاملان'),
      ('24 est un multiple', '24 is a multiple', '٢٤ من المضاعفات'),
      ('Ne pas confondre', 'Do not mix them up', 'لا تخلط بينهما')]),
    (3, 2, 'distributive_property', 'La distributivité de la multiplication',
     'The distributive property', 'خاصية التوزيع في الضرب',
     '6 × 14 = 6 × 10 + 6 × 4 = 84', '6 × 14 = 6 × 10 + 6 × 4 = 84',
     '٦ × ١٤ = ٦ × ١٠ + ٦ × ٤ = ٨٤',
     [('Décomposer 14 = 10 + 4', 'Split 14 = 10 + 4', 'فكّك ١٤ = ١٠ + ٤'),
      ('Multiplier chaque partie', 'Multiply each part', 'اضرب كل جزء'),
      ('Additionner les produits', 'Add the products', 'اجمع الحواصل')]),
    (3, 4, 'multi_digit_multiplication', 'Multiplication de nombres à plusieurs chiffres',
     'Multiplying multi-digit numbers', 'ضرب الأعداد متعددة الأرقام',
     '234 × 12 = 468 + 2340 = 2808', '234 × 12 = 468 + 2340 = 2808',
     '٢٣٤ × ١٢ = ٤٦٨ + ٢٣٤٠ = ٢٨٠٨',
     [('Multiplier par les unités', 'Multiply by the units', 'اضرب في الآحاد'),
      ('Décaler pour les dizaines', 'Shift for the tens', 'أزح للعشرات'),
      ('Additionner les produits', 'Add the partial products', 'اجمع الحواصل')]),
    (3, 5, 'multiplication_word_problem', 'Problèmes de multiplication',
     'Real-world multiplication problems', 'مسائل الضرب في الحياة الواقعية',
     '7 × 12 = 84 DT', '7 × 12 = 84', '٧ × ١٢ = ٨٤',
     [('Trouver le prix unitaire', 'Find the unit price', 'حدد سعر الوحدة'),
      ('Trouver la quantité', 'Find the quantity', 'حدد الكمية'),
      ('Multiplier et donner l’unité', 'Multiply and give the unit', 'اضرب واكتب الوحدة')]),
    (4, 1, 'area_model_division', 'Modèle de l’aire pour diviser',
     'Area model for division', 'نموذج المساحة للقسمة',
     '96 ÷ 8 = 12', '96 ÷ 8 = 12', '٩٦ ÷ ٨ = ١٢',
     [('Aire = 96, largeur = 8', 'Area = 96, width = 8', 'المساحة ٩٦ والعرض ٨'),
      ('Décomposer 96 = 80 + 16', 'Split 96 = 80 + 16', 'فكّك ٩٦ = ٨٠ + ١٦'),
      ('Additionner 10 + 2', 'Add 10 + 2', 'اجمع ١٠ + ٢')]),
    (4, 2, 'estimate_quotients', 'Estimer des quotients',
     'Estimating quotients', 'تقدير خارج القسمة',
     '348 ÷ 6 ≈ 360 ÷ 6 = 60', '348 ÷ 6 ≈ 360 ÷ 6 = 60', '٣٤٨ ÷ ٦ ≈ ٣٦٠ ÷ ٦ = ٦٠',
     [('Choisir un nombre proche', 'Pick a nearby number', 'اختر عدداً قريباً'),
      ('Diviser facilement', 'Divide easily', 'اقسم بسهولة'),
      ('Comparer au quotient exact', 'Compare with the exact quotient', 'قارن بالخارج الدقيق')]),
    (4, 3, 'standard_division_algorithm', 'Algorithme standard pour diviser',
     'Standard division algorithm', 'خوارزمية القسمة المعيارية',
     '856 ÷ 4 = 214', '856 ÷ 4 = 214', '٨٥٦ ÷ ٤ = ٢١٤',
     [('Diviser de gauche à droite', 'Divide left to right', 'اقسم من اليسار لليمين'),
      ('Abaisser le chiffre suivant', 'Bring down the next digit', 'أنزل الرقم التالي'),
      ('Vérifier par la multiplication', 'Check by multiplying', 'تحقق بالضرب')]),
    (4, 4, 'division_multiplication_link', 'Division et multiplication',
     'Division and multiplication', 'العلاقة بين القسمة والضرب',
     '7 × 8 = 56, 56 ÷ 8 = 7', '7 × 8 = 56, 56 ÷ 8 = 7', '٧ × ٨ = ٥٦، ٥٦ ÷ ٨ = ٧',
     [('Écrire le produit', 'Write the product', 'اكتب الحاصل'),
      ('Écrire les deux divisions', 'Write both divisions', 'اكتب القسمتين'),
      ('Vérifier', 'Check', 'تحقق')]),
    (4, 5, 'multi_step_problem', 'Problèmes à plusieurs étapes',
     'Multi-step word problems', 'مسائل متعددة الخطوات',
     '3 × 24 = 72 puis 72 ÷ 8 = 9', '3 × 24 = 72 then 72 ÷ 8 = 9',
     '٣ × ٢٤ = ٧٢ ثم ٧٢ ÷ ٨ = ٩',
     [('Trouver le total', 'Find the total', 'أوجد المجموع'),
      ('Répartir', 'Share out', 'وزّع'),
      ('Donner l’unité', 'Give the unit', 'اكتب الوحدة')]),
    (5, 2, 'decimal_times_whole', 'Multiplier un décimal par un entier',
     'Multiplying decimals by whole numbers', 'ضرب الأعداد العشرية في أعداد صحيحة',
     '2,5 × 4 = 10', '2.5 × 4 = 10', '٢٫٥ × ٤ = ١٠',
     [('Multiplier sans la virgule', 'Multiply without the point', 'اضرب بدون الفاصلة'),
      ('Compter les décimales', 'Count the decimals', 'عُدّ الأجزاء العشرية'),
      ('Replacer la virgule', 'Put the point back', 'أعد الفاصلة')]),
    (5, 3, 'tenths_times_tenths', 'Multiplier des dixièmes par des dixièmes',
     'Multiplying tenths by tenths', 'ضرب الأجزاء من عشرة',
     '0,3 × 0,4 = 0,12', '0.3 × 0.4 = 0.12', '٠٫٣ × ٠٫٤ = ٠٫١٢',
     [('Multiplier 3 × 4 = 12', 'Multiply 3 × 4 = 12', 'اضرب ٣ × ٤ = ١٢'),
      ('Deux décimales', 'Two decimal places', 'جزءان عشريان'),
      ('Écrire 0,12', 'Write 0.12', 'اكتب ٠٫١٢')]),
    (5, 4, 'area_model_decimals', 'Modèle de l’aire avec des décimaux',
     'Area model with decimals', 'نموذج المساحة بالأعداد العشرية',
     '1,2 × 0,5 = 0,6 m²', '1.2 × 0.5 = 0.6 m²', '١٫٢ × ٠٫٥ = ٠٫٦ م²',
     [('Longueur 1,2 et largeur 0,5', 'Length 1.2 and width 0.5', 'الطول ١٫٢ والعرض ٠٫٥'),
      ('Prendre la moitié', 'Take half', 'خُذ النصف'),
      ('Lire l’aire', 'Read the area', 'اقرأ المساحة')]),
    (5, 5, 'decimal_hundredths_product', 'Multiplier jusqu’aux centièmes',
     'Multiplying to hundredths', 'الضرب حتى الجزء من مئة',
     '1,25 × 0,4 = 0,5', '1.25 × 0.4 = 0.5', '١٫٢٥ × ٠٫٤ = ٠٫٥',
     [('Multiplier 125 × 4 = 500', 'Multiply 125 × 4 = 500', 'اضرب ١٢٥ × ٤ = ٥٠٠'),
      ('Trois décimales', 'Three decimal places', 'ثلاثة أجزاء عشرية'),
      ('Simplifier 0,500 = 0,5', 'Simplify 0.500 = 0.5', 'بسّط ٠٫٥٠٠ = ٠٫٥')]),
    (5, 6, 'decimal_thousandths_product', 'Multiplier jusqu’aux millièmes',
     'Multiplying to thousandths', 'الضرب حتى الجزء من ألف',
     '0,125 × 0,2 = 0,025', '0.125 × 0.2 = 0.025', '٠٫١٢٥ × ٠٫٢ = ٠٫٠٢٥',
     [('Multiplier 125 × 2 = 250', 'Multiply 125 × 2 = 250', 'اضرب ١٢٥ × ٢ = ٢٥٠'),
      ('Quatre décimales', 'Four decimal places', 'أربعة أجزاء عشرية'),
      ('Écrire 0,025', 'Write 0.025', 'اكتب ٠٫٠٢٥')]),
    (5, 7, 'metric_decimals', 'Décimaux et système métrique',
     'Decimals and the metric system', 'الأعداد العشرية والنظام المتري',
     '2,5 m = 250 cm', '2.5 m = 250 cm', '٢٫٥ م = ٢٥٠ سم',
     [('1 m = 100 cm', '1 m = 100 cm', '١ م = ١٠٠ سم'),
      ('Multiplier par 100', 'Multiply by 100', 'اضرب في ١٠٠'),
      ('Lire 250 cm', 'Read 250 cm', 'اقرأ ٢٥٠ سم')]),
    (5, 8, 'metric_powers_of_ten', 'Mesure et puissances de dix',
     'Measurement and powers of ten', 'القياس وقوى العشرة',
     '450 cm ÷ 100 = 4,5 m', '450 cm ÷ 100 = 4.5 m', '٤٥٠ سم ÷ ١٠٠ = ٤٫٥ م',
     [('Choisir le sens', 'Choose the direction', 'اختر الاتجاه'),
      ('Diviser par 100', 'Divide by 100', 'اقسم على ١٠٠'),
      ('Vérifier l’unité', 'Check the unit', 'تحقق من الوحدة')]),
    (5, 9, 'multi_step_decimal_problem', 'Problèmes décimaux à plusieurs étapes',
     'Multi-step decimal problems', 'مسائل عشرية متعددة الخطوات',
     '75 cm = 0,75 m, 2,5 + 0,75 = 3,25 m', '75 cm = 0.75 m, 2.5 + 0.75 = 3.25 m',
     '٧٥ سم = ٠٫٧٥ م، ٢٫٥ + ٠٫٧٥ = ٣٫٢٥ م',
     [('Convertir 75 cm', 'Convert 75 cm', 'حوّل ٧٥ سم'),
      ('Additionner', 'Add', 'اجمع'),
      ('Donner l’unité', 'Give the unit', 'اكتب الوحدة')]),
    (5, 10, 'divide_powers_of_ten', 'Diviser par des puissances de dix',
     'Dividing by powers of ten', 'القسمة على قوى العشرة',
     '34,5 ÷ 100 = 0,345', '34.5 ÷ 100 = 0.345', '٣٤٫٥ ÷ ١٠٠ = ٠٫٣٤٥',
     [('Décaler vers la gauche', 'Shift to the left', 'أزح لليسار'),
      ('Deux rangs pour 100', 'Two places for 100', 'مرتبتان للقسمة على ١٠٠'),
      ('Lire 0,345', 'Read 0.345', 'اقرأ ٠٫٣٤٥')]),
    (5, 11, 'powers_of_ten_pattern', 'Modèles avec les puissances de dix',
     'Patterns with powers of ten', 'الأنماط مع قوى العشرة',
     '4,2 → 42 → 420 → 4200', '4.2 → 42 → 420 → 4200', '٤٫٢ ← ٤٢ ← ٤٢٠ ← ٤٢٠٠',
     [('Repérer la règle', 'Spot the rule', 'اكتشف القاعدة'),
      ('Multiplier par 10', 'Multiply by 10', 'اضرب في ١٠'),
      ('Continuer la suite', 'Continue the pattern', 'أكمل النمط')]),
    (5, 12, 'decimal_divided_by_whole', 'Diviser un décimal par un entier',
     'Dividing a decimal by a whole number', 'قسمة عدد عشري على عدد صحيح',
     '7,5 ÷ 3 = 2,5', '7.5 ÷ 3 = 2.5', '٧٫٥ ÷ ٣ = ٢٫٥',
     [('Diviser 75 ÷ 3 = 25', 'Divide 75 ÷ 3 = 25', 'اقسم ٧٥ ÷ ٣ = ٢٥'),
      ('Placer la virgule', 'Place the decimal point', 'ضع الفاصلة'),
      ('Vérifier 2,5 × 3 = 7,5', 'Check 2.5 × 3 = 7.5', 'تحقق ٢٫٥ × ٣ = ٧٫٥')]),
    (5, 13, 'decimal_divided_by_decimal', 'Diviser deux nombres décimaux',
     'Dividing two decimals', 'قسمة عددين عشريين',
     '4,5 ÷ 0,9 = 45 ÷ 9 = 5', '4.5 ÷ 0.9 = 45 ÷ 9 = 5', '٤٫٥ ÷ ٠٫٩ = ٤٥ ÷ ٩ = ٥',
     [('Rendre le diviseur entier', 'Make the divisor whole', 'اجعل المقسوم عليه صحيحاً'),
      ('Multiplier par 10 les deux', 'Multiply both by 10', 'اضرب الاثنين في ١٠'),
      ('Diviser 45 ÷ 9 = 5', 'Divide 45 ÷ 9 = 5', 'اقسم ٤٥ ÷ ٩ = ٥')]),
    (6, 2, 'grouping_symbols', 'Expressions avec symboles de regroupement',
     'Expressions with grouping symbols', 'التعابير مع رموز التجميع',
     '3 × (4 + 5) = 27', '3 × (4 + 5) = 27', '٣ × (٤ + ٥) = ٢٧',
     [('Calculer la parenthèse', 'Work out the bracket', 'احسب ما بين القوسين'),
      ('Multiplier par 3', 'Multiply by 3', 'اضرب في ٣'),
      ('Comparer sans parenthèses', 'Compare without brackets', 'قارن بدون أقواس')]),
    (6, 3, 'write_expressions', 'Écrire des expressions',
     'Writing expressions', 'كتابة التعابير',
     '2 × (3 + 5) = 16', '2 × (3 + 5) = 16', '٢ × (٣ + ٥) = ١٦',
     [('Lire la phrase', 'Read the sentence', 'اقرأ الجملة'),
      ('Placer les parenthèses', 'Place the brackets', 'ضع الأقواس'),
      ('Calculer', 'Calculate', 'احسب')]),
    (6, 4, 'number_patterns', 'Identifier les modèles numériques',
     'Identifying numerical patterns', 'تحديد الأنماط العددية',
     '3, 6, 12, 24 : × 2', '3, 6, 12, 24: × 2', '٣، ٦، ١٢، ٢٤: × ٢',
     [('Comparer deux termes', 'Compare two terms', 'قارن حدّين'),
      ('Trouver la règle', 'Find the rule', 'اكتشف القاعدة'),
      ('Tester sur un troisième', 'Test on a third', 'اختبر على ثالث')]),
]

INK = '#0f766e'


def svg(step_count):
    """A text-free figure: numbered callouts and counted bars only.

    The RTL rule is that no words are baked into an image, because the same file
    is shown to an Arabic, French and English child. Everything verbal lives in
    the catalog's localized legend, alt text and title.
    """
    w, h = 960, 600
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" aria-hidden="true">',
        '<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#ecfeff"/><stop offset="1" stop-color="#fff"/>'
        '</linearGradient></defs>',
        f'<rect width="{w}" height="{h}" rx="36" fill="url(#bg)"/>',
        f'<circle cx="70" cy="75" r="30" fill="{INK}" opacity=".06"/>',
        f'<circle cx="885" cy="520" r="42" fill="{INK}" opacity=".06"/>',
        # Worked-example panel: an empty slate the legend names in the child's language.
        f'<rect x="120" y="52" width="720" height="92" rx="24" fill="#fff" '
        f'stroke="{INK}" stroke-opacity=".22" stroke-width="3"/>',
        f'<rect x="168" y="86" width="624" height="24" rx="12" fill="{INK}" opacity=".12"/>',
    ]
    gap = 40
    card = (w - 240 - gap * (step_count - 1)) / step_count
    for i in range(step_count):
        x = 120 + i * (card + gap)
        bar = 40 + i * 34
        out += [
            f'<rect x="{x:.0f}" y="210" width="{card:.0f}" height="230" rx="26" '
            f'fill="#fff" stroke="{INK}" stroke-opacity=".2" stroke-width="3"/>',
            f'<rect x="{x + card / 2 - 26:.0f}" y="{410 - bar}" width="52" '
            f'height="{bar}" rx="10" fill="{INK}" opacity="{0.30 + 0.18 * i:.2f}"/>',
            f'<circle cx="{x + card - 30:.0f}" cy="240" r="23" fill="{INK}"/>',
            f'<text x="{x + card - 30:.0f}" y="248" font-family="Arial,sans-serif" '
            f'font-size="25" font-weight="700" text-anchor="middle" fill="#fff">{i + 1}</text>',
        ]
    # Progress strip: one filled segment per step.
    seg = 720 / step_count
    for i in range(step_count):
        out.append(
            f'<rect x="{120 + i * seg + 4:.0f}" y="492" width="{seg - 8:.0f}" height="36" '
            f'rx="10" fill="{INK}" opacity="{0.20 + 0.5 * (i + 1) / step_count:.2f}"/>'
        )
    out.append('</svg>')
    return ''.join(out)


def hotspots(step_count):
    """One tappable point per numbered card, aligned to the card centres."""
    gap = 40
    card = (960 - 240 - gap * (step_count - 1)) / step_count
    return [
        {'n': i + 1,
         'x': round((120 + i * (card + gap) + card / 2) / 960, 4),
         'y': round(325 / 600, 4)}
        for i in range(step_count)
    ]


def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(root, 'media-src', 'math')
    os.makedirs(out_dir, exist_ok=True)
    entries = []
    for u, n, slug, tfr, ten, tar, wfr, wen, war, steps in LESSONS:
        with open(os.path.join(out_dir, f'{slug}.svg'), 'w', encoding='utf-8') as fh:
            fh.write(svg(len(steps)))
        entries.append({
            'id': f'mathfr2026_{slug}',
            'type': 'image',
            'kind': 'diagram',
            'lessonId': f'off_mathfr_2026_u{u}_l{n}',
            'conceptId': f'conc_mathfr_2026_u{u}_l{n}',
            'subjectId': 'subj_math',
            'reelKind': 'teach_card',
            'curriculumRef': f'Maths FR Term 1 — Unité {u} Leçon {n}',
            'src': f'media/math/{slug}.svg',
            'mimeType': 'image/svg+xml',
            'width': 960,
            'height': 600,
            'title': {'ar': tar, 'en': ten, 'fr': tfr},
            'purpose': {
                'ar': 'يوضح خطوات الحل بالترتيب مع المثال المحلول.',
                'en': 'Shows the worked method step by step with the worked example.',
                'fr': 'Montre la méthode pas à pas avec l’exemple résolu.',
            },
            'alt': {'ar': f'مخطط: {war}', 'en': f'Diagram: {wen}', 'fr': f'Schéma : {wfr}'},
            'legend': [
                {'n': i + 1, 'text': {'ar': s[2], 'en': s[1], 'fr': s[0]}}
                for i, s in enumerate(steps)
            ],
            'hotspots': hotspots(len(steps)),
            'displayDurationMs': 10000,
            'branding': {'palette': 'math', 'watermark': {'ar': 'مس نور', 'en': 'Miss Noor'}},
            'source': {
                'origin': 'authored_svg',
                'author': 'Miss Noor media pipeline',
                'license': 'Project-owned (Apache-2.0)',
                'attribution': (
                    'Drawn from the Egyptian Ministry Grade 5 French Maths book, '
                    f'Unité {u} Leçon {n}.'
                ),
            },
            'review': {
                'status': 'reviewed',
                'reviewedBy': 'agent-implementation',
                'notes': (
                    'Numbered steps match the lesson objectives; the worked example is '
                    'the one taught in the lesson.'
                ),
            },
        })
    with open(os.path.join(root, 'scripts', 'math_fr_media_entries.json'), 'w', encoding='utf-8') as fh:
        json.dump(entries, fh, ensure_ascii=False, indent=2)
    print(f'wrote {len(LESSONS)} svg files and {len(entries)} catalog entries')


if __name__ == '__main__':
    main()
