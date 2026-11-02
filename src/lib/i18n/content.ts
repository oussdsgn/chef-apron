/**
 * Built-in French and Arabic translations of the store's starter content (products, collections,
 * page texts), keyed by the English text. They're used until a translation is entered in the
 * dashboard. If the English text is edited, its built-in translation no longer matches and the
 * dashboard translation (or the English text) is shown instead.
 *
 * Long texts are matched paragraph by paragraph, so editing one paragraph keeps the others translated.
 */
type Entry = { fr: string; ar: string };

export const contentTranslations: Record<string, Entry> = {
  // ---------- Collections ----------
  Aprons: { fr: "Tabliers", ar: "المآزر" },
  "Apron collection": { fr: "Collection tabliers", ar: "مجموعة المآزر" },
  "Bib, cross-back, barista and leather aprons that take the heat and the stains.": {
    fr: "Tabliers à bavette, croisés, barista et en cuir, qui résistent à la chaleur et aux taches.",
    ar: "مآزر بصدرية، وبأحزمة متقاطعة، ومآزر باريستا وجلدية تتحمل الحرارة والبقع.",
  },
  "Chef uniforms": { fr: "Tenues de chef", ar: "أزياء الطهاة" },
  "Breathable jackets, chef pants and toques cut for movement on the line.": {
    fr: "Vestes respirantes, pantalons et toques coupés pour bouger librement en cuisine.",
    ar: "سترات مسامية وسراويل وقبعات طهاة مصممة لحرية الحركة في المطبخ.",
  },
  Utensils: { fr: "Ustensiles", ar: "الأدوات" },
  "Kitchen utensils": { fr: "Ustensiles de cuisine", ar: "أدوات المطبخ" },
  "Knives, whisks, tongs and knife rolls chosen by working chefs.": {
    fr: "Couteaux, fouets, pinces et trousses à couteaux choisis par des chefs en activité.",
    ar: "سكاكين وخفاقات وملاقط وحقائب سكاكين يختارها طهاة محترفون.",
  },

  // ---------- Colors & sizes ----------
  Black: { fr: "Noir", ar: "أسود" },
  Sand: { fr: "Sable", ar: "رملي" },
  "Lavender Grey": { fr: "Gris lavande", ar: "رمادي لافندر" },
  Forest: { fr: "Vert forêt", ar: "أخضر غابي" },
  Chocolate: { fr: "Chocolat", ar: "شوكولاتة" },
  Mustard: { fr: "Moutarde", ar: "خردلي" },
  Slate: { fr: "Ardoise", ar: "رمادي داكن" },
  Espresso: { fr: "Expresso", ar: "بني داكن" },
  White: { fr: "Blanc", ar: "أبيض" },
  "White / Black": { fr: "Blanc / Noir", ar: "أبيض / أسود" },
  Wood: { fr: "Bois", ar: "خشبي" },
  "Olive wood": { fr: "Bois d'olivier", ar: "خشب الزيتون" },
  Steel: { fr: "Acier", ar: "فولاذي" },
  Default: { fr: "Standard", ar: "افتراضي" },
  Regular: { fr: "Standard", ar: "عادي" },
  Long: { fr: "Long", ar: "طويل" },
  "One size": { fr: "Taille unique", ar: "مقاس واحد" },

  // ---------- Products ----------
  "Classic Bib Apron": { fr: "Tablier à bavette classique", ar: "مئزر كلاسيكي بصدرية" },
  "Heavy cotton twill with a deep chest pocket and hand pockets.": {
    fr: "Sergé de coton épais, grande poche poitrine et poches latérales.",
    ar: "قماش قطني متين بجيب صدر عميق وجيبين لليدين.",
  },
  "Our everyday workhorse. Cut from a heavy cotton twill that softens with every wash, with wide shoulder straps, a deep chest pocket for pens and thermometers, and two hand pockets at the hips.":
    {
      fr: "Notre tablier de tous les jours. Taillé dans un sergé de coton épais qui s'assouplit à chaque lavage, avec de larges bretelles, une grande poche poitrine pour stylos et thermomètres, et deux poches aux hanches.",
      ar: "مئزرنا اليومي الذي لا يخذلك. مصنوع من قماش قطني متين يزداد نعومة مع كل غسلة، بحمّالات كتف عريضة، وجيب صدر عميق للأقلام وموازين الحرارة، وجيبين عند الوركين.",
    },
  "280 gsm cotton twill": { fr: "Sergé de coton 280 g/m²", ar: "قماش قطني 280 غ/م²" },
  "Wide adjustable shoulder straps": { fr: "Larges bretelles réglables", ar: "حمّالات كتف عريضة قابلة للتعديل" },
  "Chest pocket + two hand pockets": { fr: "Poche poitrine + deux poches latérales", ar: "جيب صدر + جيبان لليدين" },
  "Machine washable at 40°C": { fr: "Lavable en machine à 40 °C", ar: "قابل للغسل في الغسالة على 40°م" },

  "Cross-Back Canvas Apron": { fr: "Tablier croisé en toile", ar: "مئزر قماشي بأحزمة متقاطعة" },
  "Straps cross at the back, so there's no strain on your neck.": {
    fr: "Bretelles croisées dans le dos : aucune tension sur la nuque.",
    ar: "أحزمة متقاطعة على الظهر، فلا ضغط على رقبتك.",
  },
  "The straps cross over the back to spread the weight across your shoulders instead of your neck, which matters on twelve-hour shifts. Sturdy cotton canvas in rich, stain-forgiving colors.":
    {
      fr: "Les bretelles se croisent dans le dos pour répartir le poids sur les épaules plutôt que sur la nuque, ce qui compte sur un service de douze heures. Toile de coton robuste dans des couleurs profondes qui pardonnent les taches.",
      ar: "تتقاطع الأحزمة على الظهر لتوزيع الوزن على الكتفين بدلًا من الرقبة، وهذا مهم في نوبات العمل الطويلة. قماش قطني متين بألوان غنية لا تظهر عليها البقع بسهولة.",
    },
  "Heavy cotton canvas": { fr: "Toile de coton épaisse", ar: "قماش قطني سميك" },
  "Cross-back straps, no neck strap": { fr: "Bretelles croisées, sans lanière de cou", ar: "أحزمة متقاطعة دون حزام للرقبة" },
  "Chest pocket + kangaroo hand pocket": { fr: "Poche poitrine + poche kangourou", ar: "جيب صدر + جيب أمامي كبير" },
  "Machine washable": { fr: "Lavable en machine", ar: "قابل للغسل في الغسالة" },

  "Barista Apron": { fr: "Tablier barista", ar: "مئزر باريستا" },
  "Light, wrap-around ties, made for cafés and front of house.": {
    fr: "Léger, liens enveloppants, pensé pour les cafés et la salle.",
    ar: "خفيف بأربطة ملتفة، مصمم للمقاهي وطاقم الخدمة.",
  },
  "A lightweight apron for baristas and service staff, with long ties that wrap around and knot at the front, and a split pocket for pens and order pads.":
    {
      fr: "Un tablier léger pour baristas et personnel de salle, avec de longs liens qui se nouent devant et une poche divisée pour stylos et carnets de commande.",
      ar: "مئزر خفيف للباريستا وطاقم الخدمة، بأربطة طويلة تلتف وتُعقد من الأمام، وجيب مقسّم للأقلام ودفاتر الطلبات.",
    },
  "Poly-cotton blend, stain-release finish": { fr: "Polycoton, finition anti-taches", ar: "مزيج بوليستر وقطن بمعالجة ضد البقع" },
  "Long wrap-around ties": { fr: "Longs liens enveloppants", ar: "أربطة طويلة ملتفة" },
  "Split front pocket": { fr: "Poche avant divisée", ar: "جيب أمامي مقسّم" },

  "Leather Pitmaster Apron": { fr: "Tablier barbecue en cuir", ar: "مئزر شواء جلدي" },
  "Full-grain leather for grills, smokers and open fire.": {
    fr: "Cuir pleine fleur pour le grill, le fumoir et le feu de bois.",
    ar: "جلد طبيعي كامل للشواء والمدخنة والنار المكشوفة.",
  },
  "Built for live fire. Full-grain leather that shrugs off sparks and grease, with a reinforced bib and riveted stress points. It will outlast your grill.":
    {
      fr: "Conçu pour le feu vif. Cuir pleine fleur qui résiste aux étincelles et à la graisse, bavette renforcée et points de tension rivetés. Il survivra à votre grill.",
      ar: "مصنوع للنار المباشرة. جلد طبيعي كامل يتحمل الشرر والدهون، بصدرية مدعّمة ونقاط ضغط مثبتة بالمسامير. سيدوم أطول من شوايتك.",
    },
  "Full-grain cowhide leather": { fr: "Cuir de vachette pleine fleur", ar: "جلد بقري طبيعي كامل" },
  "Riveted stress points": { fr: "Points de tension rivetés", ar: "نقاط ضغط مثبتة بالمسامير" },
  "Adjustable neck strap": { fr: "Lanière de cou réglable", ar: "حزام رقبة قابل للتعديل" },
  "Wipe clean with a damp cloth": { fr: "Nettoyer avec un chiffon humide", ar: "يُنظف بقطعة قماش مبللة" },

  "Signature Chef Jacket": { fr: "Veste de chef Signature", ar: "سترة الطاهي سيغنتشر" },
  "Double-breasted, breathable, with a reversible front.": {
    fr: "Croisée, respirante, avec un devant réversible.",
    ar: "بصفّين من الأزرار، مسامية، بواجهة قابلة للقلب.",
  },
  "The classic double-breasted jacket in a lightweight cotton blend that breathes on a hot line. The reversible front lets you hide a spill mid-service.":
    {
      fr: "La veste croisée classique, en coton mélangé léger qui respire en plein coup de feu. Le devant réversible permet de cacher une tache en plein service.",
      ar: "السترة الكلاسيكية بصفّين من الأزرار، من مزيج قطني خفيف يسمح بالتهوية في حرارة المطبخ. الواجهة القابلة للقلب تتيح لك إخفاء أي بقعة أثناء الخدمة.",
    },
  "65% cotton / 35% polyester, 190 gsm": { fr: "65 % coton / 35 % polyester, 190 g/m²", ar: "65% قطن / 35% بوليستر، 190 غ/م²" },
  "Double-breasted, reversible front": { fr: "Croisée, devant réversible", ar: "بصفّين من الأزرار، واجهة قابلة للقلب" },
  "Thermometer pocket on sleeve": { fr: "Poche à thermomètre sur la manche", ar: "جيب لميزان الحرارة على الكم" },
  "Washable at 60°C": { fr: "Lavable à 60 °C", ar: "قابلة للغسل على 60°م" },

  "Contrast Piping Chef Jacket": { fr: "Veste de chef à passepoil contrasté", ar: "سترة طاهٍ بحواف متباينة" },
  "White jacket with black piping for the open kitchen.": {
    fr: "Veste blanche à passepoil noir pour la cuisine ouverte.",
    ar: "سترة بيضاء بحواف سوداء للمطابخ المفتوحة.",
  },
  "Made for kitchens in view of the guests. A tailored double-breasted jacket with black contrast piping on the collar, placket and cuffs.":
    {
      fr: "Pensée pour les cuisines à la vue des clients. Une veste croisée ajustée avec passepoil noir contrasté au col, à la patte de boutonnage et aux poignets.",
      ar: "مصممة للمطابخ المكشوفة أمام الزبائن. سترة بصفّين من الأزرار بقصّة مفصّلة وحواف سوداء على الياقة والواجهة والأكمام.",
    },
  "Cotton-rich blend": { fr: "Mélange riche en coton", ar: "مزيج غني بالقطن" },
  "Black contrast piping": { fr: "Passepoil noir contrasté", ar: "حواف سوداء متباينة" },
  "Tailored fit": { fr: "Coupe ajustée", ar: "قصّة مفصّلة" },

  "Cargo Chef Pants": { fr: "Pantalon de chef cargo", ar: "سروال طاهٍ كارغو" },
  "Relaxed fit, elastic waist and deep cargo pockets.": {
    fr: "Coupe ample, taille élastique et grandes poches cargo.",
    ar: "قصّة مريحة، خصر مطاطي وجيوب كارغو عميقة.",
  },
  "Comfortable chef pants with an elastic drawstring waist, deep cargo pockets for towels and tools, and a tapered leg that stays clear of the floor.":
    {
      fr: "Un pantalon de chef confortable avec taille élastique à cordon, grandes poches cargo pour torchons et outils, et une jambe fuselée qui ne traîne pas au sol.",
      ar: "سروال طاهٍ مريح بخصر مطاطي برباط، وجيوب كارغو عميقة للمناشف والأدوات، وساق ضيقة من الأسفل لا تلامس الأرض.",
    },
  "Cotton-poly twill": { fr: "Sergé polycoton", ar: "قماش قطن وبوليستر" },
  "Elastic waist + drawstring": { fr: "Taille élastique + cordon", ar: "خصر مطاطي + رباط" },
  "Two cargo pockets, two side pockets": { fr: "Deux poches cargo, deux poches latérales", ar: "جيبا كارغو وجيبان جانبيان" },

  "Pleated Toque": { fr: "Toque plissée", ar: "قبعة طاهٍ مطوية" },
  "The traditional tall chef's hat, adjustable.": {
    fr: "La grande toque de chef traditionnelle, réglable.",
    ar: "قبعة الطاهي الطويلة التقليدية، قابلة للتعديل.",
  },
  "A tall, pleated toque in breathable cotton with an adjustable band. Holds its shape service after service.": {
    fr: "Une grande toque plissée en coton respirant avec bandeau réglable. Elle garde sa forme service après service.",
    ar: "قبعة طاهٍ طويلة مطوية من القطن المسامي بشريط قابل للتعديل. تحافظ على شكلها خدمة بعد خدمة.",
  },
  "Breathable cotton": { fr: "Coton respirant", ar: "قطن مسامي" },
  "Adjustable band": { fr: "Bandeau réglable", ar: "شريط قابل للتعديل" },
  "Holds shape after washing": { fr: "Garde sa forme au lavage", ar: "تحافظ على شكلها بعد الغسل" },

  '8" Chef Knife': { fr: "Couteau de chef 8\"", ar: "سكين طاهٍ 8 بوصات" },
  "Stainless steel blade with a full-tang black handle.": {
    fr: "Lame en acier inoxydable, manche noir à soie pleine.",
    ar: "نصل من الفولاذ المقاوم للصدأ بمقبض أسود كامل الامتداد.",
  },
  "An all-purpose chef knife with a thin, hard stainless blade sharpened to 15° per side, balanced at the bolster, with a riveted full-tang handle.":
    {
      fr: "Un couteau de chef polyvalent à lame inox fine et dure, affûtée à 15° par côté, équilibrée au niveau de la mitre, avec un manche riveté à soie pleine.",
      ar: "سكين طاهٍ متعدد الاستخدامات بنصل رفيع وصلب من الفولاذ المقاوم للصدأ، مشحوذ بزاوية 15° لكل جانب، متوازن عند المسند، بمقبض كامل الامتداد مثبت بالمسامير.",
    },
  "High-carbon stainless steel": { fr: "Acier inoxydable à haute teneur en carbone", ar: "فولاذ مقاوم للصدأ عالي الكربون" },
  '8" (210 mm) blade': { fr: "Lame de 8\" (210 mm)", ar: "نصل 8 بوصات (210 مم)" },
  "Full-tang riveted handle": { fr: "Manche riveté à soie pleine", ar: "مقبض كامل الامتداد مثبت بالمسامير" },
  "Hand wash only": { fr: "Lavage à la main uniquement", ar: "يُغسل باليد فقط" },

  "Chef Knife Set (4 pcs)": { fr: "Set de couteaux de chef (4 pièces)", ar: "طقم سكاكين الطاهي (4 قطع)" },
  "Chef knife, santoku, cleaver and boning knife.": {
    fr: "Couteau de chef, santoku, couperet et couteau à désosser.",
    ar: "سكين طاهٍ وسانتوكو وساطور وسكين تخليص العظم.",
  },
  "The four knives a kitchen needs: a chef knife, a santoku, a cleaver and a flexible boning knife, all with matching wooden handles.":
    {
      fr: "Les quatre couteaux indispensables : un couteau de chef, un santoku, un couperet et un couteau à désosser souple, tous avec des manches en bois assortis.",
      ar: "السكاكين الأربع التي يحتاجها كل مطبخ: سكين طاهٍ وسانتوكو وساطور وسكين مرنة لتخليص العظم، جميعها بمقابض خشبية متناسقة.",
    },
  "Stainless steel blades": { fr: "Lames en acier inoxydable", ar: "نصال من الفولاذ المقاوم للصدأ" },
  "Wooden handles with three rivets": { fr: "Manches en bois à trois rivets", ar: "مقابض خشبية بثلاثة مسامير" },
  "Chef, santoku, cleaver, boning": { fr: "Chef, santoku, couperet, désosseur", ar: "طاهٍ، سانتوكو، ساطور، تخليص العظم" },

  "Knife Roll Set": { fr: "Trousse à couteaux garnie", ar: "طقم حقيبة السكاكين" },
  "Three knives, carving fork and honing steel in a leather roll.": {
    fr: "Trois couteaux, une fourchette à découper et un fusil dans une trousse en cuir.",
    ar: "ثلاث سكاكين وشوكة تقطيع ومسن في حقيبة جلدية ملفوفة.",
  },
  "A complete kit to carry to work: three knives, a carving fork and a honing steel, all with olive-wood handles, rolled up in a leather case.":
    {
      fr: "Un kit complet à emporter au travail : trois couteaux, une fourchette à découper et un fusil, tous avec manche en bois d'olivier, roulés dans un étui en cuir.",
      ar: "طقم كامل تحمله إلى العمل: ثلاث سكاكين وشوكة تقطيع ومسن، جميعها بمقابض من خشب الزيتون، ملفوفة في حقيبة جلدية.",
    },
  "3 knives + carving fork + honing steel": { fr: "3 couteaux + fourchette à découper + fusil", ar: "3 سكاكين + شوكة تقطيع + مسن" },
  "Olive-wood handles": { fr: "Manches en bois d'olivier", ar: "مقابض من خشب الزيتون" },
  "Leather roll with straps": { fr: "Trousse en cuir avec sangles", ar: "حقيبة جلدية ملفوفة بأحزمة" },

  "Balloon Whisk": { fr: "Fouet ballon", ar: "خفّاقة يدوية" },
  "Flexible stainless wires for airy batters.": {
    fr: "Fils inox souples pour des pâtes aériennes.",
    ar: "أسلاك مرنة من الفولاذ لخلطات خفيفة وهشة.",
  },
  "A 30 cm balloon whisk with flexible stainless wires and a sealed handle that never traps water.": {
    fr: "Un fouet ballon de 30 cm aux fils inox souples, avec un manche étanche qui ne retient jamais l'eau.",
    ar: "خفّاقة بطول 30 سم بأسلاك مرنة من الفولاذ المقاوم للصدأ ومقبض محكم الإغلاق لا يحتبس الماء.",
  },
  "18/8 stainless steel": { fr: "Acier inoxydable 18/8", ar: "فولاذ مقاوم للصدأ 18/8" },
  "Sealed handle": { fr: "Manche étanche", ar: "مقبض محكم الإغلاق" },
  "30 cm length": { fr: "Longueur 30 cm", ar: "الطول 30 سم" },

  "Grill Tongs": { fr: "Pinces à grill", ar: "ملقط الشواء" },
  "Locking stainless tongs for the grill and the pass.": {
    fr: "Pinces inox verrouillables pour le grill et le dressage.",
    ar: "ملقط من الفولاذ بقفل للشواء والتقديم.",
  },
  "Spring-loaded tongs with scalloped tips for a firm grip when searing and turning, and a lock that keeps them closed in the drawer.":
    {
      fr: "Pinces à ressort aux extrémités festonnées pour une prise ferme lors du saisissage, avec un verrou qui les garde fermées dans le tiroir.",
      ar: "ملقط بنابض وأطراف مسننة لقبضة ثابتة عند التحمير والتقليب، مع قفل يبقيه مغلقًا في الدرج.",
    },
  "Stainless steel": { fr: "Acier inoxydable", ar: "فولاذ مقاوم للصدأ" },
  "Locking hinge": { fr: "Charnière verrouillable", ar: "مفصل بقفل" },
  "Available 23 cm and 30 cm": { fr: "Disponible en 23 cm et 30 cm", ar: "متوفر بطول 23 سم و30 سم" },

  "Olive Wood Spatula": { fr: "Spatule en bois d'olivier", ar: "ملعقة مسطحة من خشب الزيتون" },
  "Hand-carved, won't scratch your pans.": {
    fr: "Sculptée à la main, ne raye pas vos poêles.",
    ar: "منحوتة يدويًا، لا تخدش أوانيك.",
  },
  "A sturdy hand-carved olive-wood spatula with a slanted edge for stirring, scraping and turning. Gentle on non-stick and enamel pans.":
    {
      fr: "Une spatule robuste en bois d'olivier sculptée à la main, au bord biseauté pour remuer, racler et retourner. Douce pour les poêles antiadhésives et émaillées.",
      ar: "ملعقة متينة من خشب الزيتون منحوتة يدويًا بحافة مائلة للتحريك والكشط والتقليب. لطيفة على الأواني غير اللاصقة والمطلية بالمينا.",
    },
  "Solid olive wood": { fr: "Bois d'olivier massif", ar: "خشب زيتون صلب" },
  "Slanted edge": { fr: "Bord biseauté", ar: "حافة مائلة" },
  "Hand wash, oil occasionally": { fr: "Lavage à la main, huiler de temps en temps", ar: "يُغسل باليد ويُدهن بالزيت أحيانًا" },

  "Professional Ladle": { fr: "Louche professionnelle", ar: "مغرفة احترافية" },
  "One-piece stainless ladle with a hanging hook.": {
    fr: "Louche inox monobloc avec crochet de suspension.",
    ar: "مغرفة من قطعة واحدة من الفولاذ مع خطاف للتعليق.",
  },
  "The ladle you see on every professional line: a one-piece stainless ladle with a measured bowl and a hook to hang it above the station.":
    {
      fr: "La louche de toutes les cuisines professionnelles : monobloc en inox, avec un bol gradué et un crochet pour la suspendre au-dessus du poste.",
      ar: "المغرفة التي تراها في كل مطبخ احترافي: قطعة واحدة من الفولاذ المقاوم للصدأ بوعاء محدد السعة وخطاف لتعليقها فوق محطة العمل.",
    },
  "One-piece stainless steel": { fr: "Inox monobloc", ar: "قطعة واحدة من الفولاذ المقاوم للصدأ" },
  "60 ml bowl": { fr: "Bol de 60 ml", ar: "وعاء بسعة 60 مل" },
  "Hanging hook": { fr: "Crochet de suspension", ar: "خطاف للتعليق" },

  // ---------- Store & home page ----------
  "Workwear and tools for people who cook for a living.": {
    fr: "Tenues et outils pour celles et ceux qui cuisinent par métier.",
    ar: "ملابس عمل وأدوات لمن يجعلون الطبخ مهنتهم.",
  },
  "Apron makes chef's uniforms, aprons and kitchen utensils built for long shifts, hot lines and home kitchens alike.": {
    fr: "Apron conçoit des tenues de chef, des tabliers et des ustensiles de cuisine pensés pour les longs services, les cuisines professionnelles comme pour la maison.",
    ar: "أبرون تصنع أزياء الطهاة والمآزر وأدوات المطبخ المصممة لساعات العمل الطويلة، للمطابخ الاحترافية والمنزلية على حد سواء.",
  },
  "Workwear for the line, made to last": {
    fr: "Des tenues de cuisine faites pour durer",
    ar: "ملابس عمل للمطبخ، مصنوعة لتدوم",
  },
  "Cook like a pro": { fr: "Cuisinez comme un pro", ar: "اطبخ كالمحترفين" },
  "Shop collection": { fr: "Voir la collection", ar: "تسوق المجموعة" },
  "New arrivals": { fr: "Nouveautés", ar: "وصل حديثًا" },
  "Fresh off the cutting table: our newest aprons, jackets and tools.": {
    fr: "Tout juste sortis de l'atelier : nos derniers tabliers, vestes et outils.",
    ar: "خرجت للتو من الورشة: أحدث مآزرنا وستراتنا وأدواتنا.",
  },
  "The cross-back apron survived a full summer on the grill station. Comfortable from the first shift to the last.": {
    fr: "Le tablier croisé a tenu tout un été au poste grill. Confortable du premier au dernier service.",
    ar: "صمد المئزر ذو الأحزمة المتقاطعة صيفًا كاملًا عند محطة الشواء. مريح من أول نوبة إلى آخرها.",
  },
  "Head chef, independent restaurant": { fr: "Chef de cuisine, restaurant indépendant", ar: "رئيس طهاة، مطعم مستقل" },
  "Our collections": { fr: "Nos collections", ar: "مجموعاتنا" },
  "Everything you wear and hold in the kitchen, made to work as hard as you do.": {
    fr: "Tout ce que vous portez et tenez en cuisine, conçu pour travailler aussi dur que vous.",
    ar: "كل ما ترتديه وتمسكه في المطبخ، مصنوع ليعمل بجدّ مثلك.",
  },
  "Join the brigade. Get 10% off your first order.": {
    fr: "Rejoignez la brigade. −10 % sur votre première commande.",
    ar: "انضم إلى الفريق. احصل على خصم 10% على طلبك الأول.",
  },
  "New drops, restocks and recipes from chefs who wear our aprons. No spam.": {
    fr: "Nouveautés, réassorts et recettes de chefs qui portent nos tabliers. Pas de spam.",
    ar: "منتجات جديدة وعودة للمخزون ووصفات من طهاة يرتدون مآزرنا. دون رسائل مزعجة.",
  },

  // ---------- About ----------
  "Our story": { fr: "Notre histoire", ar: "قصتنا" },
  "Made in the kitchen, for the kitchen.": { fr: "Né en cuisine, pour la cuisine.", ar: "وُلدنا في المطبخ، من أجل المطبخ." },
  "Apron started with a simple frustration: workwear that looked good on the hanger and fell apart by the second week of service. Neck straps that dug in, pockets in the wrong place, fabric that held every stain.":
    {
      fr: "Apron est né d'une frustration simple : des tenues qui avaient fière allure sur le cintre et partaient en morceaux dès la deuxième semaine de service. Des lanières qui scient la nuque, des poches mal placées, un tissu qui garde chaque tache.",
      ar: "بدأت أبرون من إحباط بسيط: ملابس عمل تبدو جميلة على العلاقة ثم تتمزق في الأسبوع الثاني من الخدمة. أحزمة تحفر في الرقبة، وجيوب في غير مكانها، وقماش يحتفظ بكل بقعة.",
    },
  "So we started making our own. Every apron, jacket and tool we sell is tested on real lines — by cooks working doubles, pastry chefs at 4am and pitmasters next to live fire — before it goes on the shelf.":
    {
      fr: "Alors nous avons fabriqué les nôtres. Chaque tablier, veste et outil que nous vendons est testé en vraie cuisine — par des cuisiniers en double service, des pâtissiers à 4 h du matin et des maîtres du grill face au feu — avant d'arriver en rayon.",
      ar: "فبدأنا بصنع ما نحتاجه بأنفسنا. كل مئزر وسترة وأداة نبيعها تُجرَّب في مطابخ حقيقية — على يد طهاة يعملون نوبتين، وصانعي حلويات في الرابعة فجرًا، وأسياد الشواء أمام النار — قبل أن تصل إلى الرفوف.",
    },
  "We keep the range small on purpose: the pieces you actually need, done properly, and built to last for years rather than seasons.":
    {
      fr: "Notre gamme est volontairement courte : les pièces dont vous avez vraiment besoin, bien faites, et conçues pour durer des années plutôt qu'une saison.",
      ar: "نُبقي تشكيلتنا محدودة عن قصد: القطع التي تحتاجها فعلًا، مصنوعة بإتقان، ولتدوم سنوات لا مواسم.",
    },
  "Built for shifts": { fr: "Pensé pour le service", ar: "مصمم لساعات العمل" },
  "Cross-back straps, breathable fabrics and pockets where your hands expect them.": {
    fr: "Bretelles croisées, tissus respirants et poches là où vos mains les attendent.",
    ar: "أحزمة متقاطعة وأقمشة مسامية وجيوب حيث تتوقعها يداك.",
  },
  "Honest materials": { fr: "Des matières honnêtes", ar: "خامات صادقة" },
  "Heavy cotton, canvas, full-grain leather and real stainless steel.": {
    fr: "Coton épais, toile, cuir pleine fleur et véritable acier inoxydable.",
    ar: "قطن سميك وقماش متين وجلد طبيعي كامل وفولاذ مقاوم للصدأ حقيقي.",
  },
  "Made to last": { fr: "Fait pour durer", ar: "مصنوع ليدوم" },
  "Reinforced stitching and riveted stress points. Repair, don't replace.": {
    fr: "Coutures renforcées et points de tension rivetés. Réparer plutôt que remplacer.",
    ar: "خياطة مدعّمة ونقاط ضغط مثبتة بالمسامير. أصلِح ولا تستبدل.",
  },

  // ---------- Policy pages (paragraph by paragraph) ----------
  "We deliver to all 58 wilayas of Algeria. After you place an order we call you to confirm it, then it ships within 1–2 business days.":
    {
      fr: "Nous livrons dans les 58 wilayas d'Algérie. Après votre commande, nous vous appelons pour la confirmer, puis elle est expédiée sous 1 à 2 jours ouvrés.",
      ar: "نوصل إلى جميع ولايات الجزائر الـ58. بعد تقديم طلبك نتصل بك لتأكيده، ثم يُشحن خلال يوم إلى يومين عمل.",
    },
  "## Rates": { fr: "## Tarifs", ar: "## الأسعار" },
  "Delivery is free on orders over {freeThreshold}. Below that, home delivery costs {fee} ({southFee} for southern wilayas).": {
    fr: "La livraison est gratuite dès {freeThreshold} d'achat. En dessous, la livraison à domicile coûte {fee} ({southFee} pour les wilayas du Sud).",
    ar: "التوصيل مجاني للطلبات ابتداءً من {freeThreshold}. وما دون ذلك، يكلف التوصيل إلى المنزل {fee} ({southFee} لولايات الجنوب).",
  },
  "## Delivery times": { fr: "## Délais de livraison", ar: "## مدة التوصيل" },
  "Orders usually arrive in 2–5 business days in the north and 4–8 business days in the south.": {
    fr: "Les commandes arrivent généralement en 2 à 5 jours ouvrés dans le Nord et en 4 à 8 jours ouvrés dans le Sud.",
    ar: "تصل الطلبات عادةً خلال 2 إلى 5 أيام عمل في الشمال و4 إلى 8 أيام عمل في الجنوب.",
  },
  "## Payment": { fr: "## Paiement", ar: "## الدفع" },
  "You pay in cash to the delivery agent when your order arrives.": {
    fr: "Vous payez en espèces au livreur à la réception de votre commande.",
    ar: "تدفع نقدًا لعامل التوصيل عند وصول طلبك.",
  },
  "We accept returns of unworn, unwashed items in their original condition within 30 days of delivery.": {
    fr: "Nous acceptons les retours d'articles non portés et non lavés, dans leur état d'origine, sous 30 jours après la livraison.",
    ar: "نقبل إرجاع المنتجات غير الملبوسة وغير المغسولة وبحالتها الأصلية خلال 30 يومًا من التسليم.",
  },
  "## How to return": { fr: "## Comment retourner un article", ar: "## طريقة الإرجاع" },
  "Email {email} with your order number and we'll send you return instructions.": {
    fr: "Écrivez à {email} avec votre numéro de commande et nous vous enverrons la marche à suivre.",
    ar: "راسلنا على {email} مع رقم طلبك وسنرسل لك تعليمات الإرجاع.",
  },
  "## Refunds": { fr: "## Remboursements", ar: "## الاسترداد" },
  "Refunds are issued within 5 business days of us receiving the return. Knives and personalised or embroidered items can't be returned unless faulty.":
    {
      fr: "Le remboursement est effectué sous 5 jours ouvrés après réception du retour. Les couteaux et les articles personnalisés ou brodés ne sont ni repris ni échangés, sauf défaut.",
      ar: "يتم الاسترداد خلال 5 أيام عمل من استلامنا للمرتجع. لا يمكن إرجاع السكاكين والمنتجات المخصصة أو المطرزة إلا إذا كان بها عيب.",
    },
  "We collect only the information needed to process your order and, if you opt in, to send you our newsletter.": {
    fr: "Nous collectons uniquement les informations nécessaires au traitement de votre commande et, si vous l'acceptez, à l'envoi de notre newsletter.",
    ar: "نجمع فقط المعلومات اللازمة لمعالجة طلبك، وإذا وافقت، لإرسال نشرتنا الإخبارية.",
  },
  "## Orders": { fr: "## Commandes", ar: "## الطلبات" },
  "Your name, phone number and delivery address are used only to confirm and deliver your order, and are shared only with our delivery partner.":
    {
      fr: "Votre nom, votre numéro de téléphone et votre adresse servent uniquement à confirmer et livrer votre commande, et ne sont partagés qu'avec notre partenaire de livraison.",
      ar: "يُستخدم اسمك ورقم هاتفك وعنوانك فقط لتأكيد طلبك وتوصيله، ولا تتم مشاركتها إلا مع شريك التوصيل.",
    },
  "## Your data": { fr: "## Vos données", ar: "## بياناتك" },
  "We don't sell your data. To access or delete the information we hold about you, email {email}.": {
    fr: "Nous ne vendons pas vos données. Pour consulter ou supprimer les informations vous concernant, écrivez à {email}.",
    ar: "لا نبيع بياناتك. للاطلاع على المعلومات التي نحتفظ بها عنك أو حذفها، راسلنا على {email}.",
  },
};
