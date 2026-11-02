const names: [string, string][] = [
  ["Adrar", "أدرار"], ["Chlef", "الشلف"], ["Laghouat", "الأغواط"], ["Oum El Bouaghi", "أم البواقي"], ["Batna", "باتنة"],
  ["Béjaïa", "بجاية"], ["Biskra", "بسكرة"], ["Béchar", "بشار"], ["Blida", "البليدة"], ["Bouira", "البويرة"],
  ["Tamanrasset", "تمنراست"], ["Tébessa", "تبسة"], ["Tlemcen", "تلمسان"], ["Tiaret", "تيارت"], ["Tizi Ouzou", "تيزي وزو"],
  ["Alger", "الجزائر"], ["Djelfa", "الجلفة"], ["Jijel", "جيجل"], ["Sétif", "سطيف"], ["Saïda", "سعيدة"],
  ["Skikda", "سكيكدة"], ["Sidi Bel Abbès", "سيدي بلعباس"], ["Annaba", "عنابة"], ["Guelma", "قالمة"], ["Constantine", "قسنطينة"],
  ["Médéa", "المدية"], ["Mostaganem", "مستغانم"], ["M'Sila", "المسيلة"], ["Mascara", "معسكر"], ["Ouargla", "ورقلة"],
  ["Oran", "وهران"], ["El Bayadh", "البيض"], ["Illizi", "إليزي"], ["Bordj Bou Arréridj", "برج بوعريريج"], ["Boumerdès", "بومرداس"],
  ["El Tarf", "الطارف"], ["Tindouf", "تندوف"], ["Tissemsilt", "تيسمسيلت"], ["El Oued", "الوادي"], ["Khenchela", "خنشلة"],
  ["Souk Ahras", "سوق أهراس"], ["Tipaza", "تيبازة"], ["Mila", "ميلة"], ["Aïn Defla", "عين الدفلى"], ["Naâma", "النعامة"],
  ["Aïn Témouchent", "عين تموشنت"], ["Ghardaïa", "غرداية"], ["Relizane", "غليزان"], ["Timimoun", "تيميمون"], ["Bordj Badji Mokhtar", "برج باجي مختار"],
  ["Ouled Djellal", "أولاد جلال"], ["Béni Abbès", "بني عباس"], ["In Salah", "عين صالح"], ["In Guezzam", "عين قزام"], ["Touggourt", "تقرت"],
  ["Djanet", "جانت"], ["El M'Ghair", "المغير"], ["El Meniaa", "المنيعة"],
];

/** The 58 wilayas. `name` (Latin) is what's saved on orders; `nameAr` is shown to Arabic-speaking visitors. */
export const wilayas: { code: number; name: string; nameAr: string }[] = names.map(([name, nameAr], i) => ({
  code: i + 1,
  name,
  nameAr,
}));

export function getWilaya(code: number) {
  return wilayas.find((w) => w.code === code);
}

/** Algerian mobile (05/06/07 + 8 digits) or landline (0 + 8 digits); accepts +213 / 00213 prefixes and spaces. */
export function normalizePhone(input: string) {
  let p = input.replace(/[\s.\-()]/g, "");
  if (p.startsWith("+213")) p = "0" + p.slice(4);
  else if (p.startsWith("00213")) p = "0" + p.slice(5);
  return /^0[5-7]\d{8}$/.test(p) || /^0[2-4]\d{7}$/.test(p) ? p : null;
}
