export const variants2standard = {
  cn: ['STCharacters', 'STPhrases', 'TaiwanQualityCN'],
  hk: ['HKVariantsRev', 'HKVariantsRevPhrases'],
  tw: ['TWVariantsRev', 'TWVariantsRevPhrases'],
  tw2: ['TWVariantsRev', 'TWPhrasesCustomRev', 'TW2TaiRev'],
  twp: ['TWVariantsRev', 'TWVariantsRevPhrases', 'TWPhrasesRev'],
  jp: ['JPVariantsRev', 'JPShinjitaiCharacters', 'JPShinjitaiPhrases'],
};

export const standard2variants = {
  cn: ['TSCharacters', 'TSPhrases'],
  hk: ['HKVariants'],
  tw: ['TWVariants'],
  tw2: ['TWVariants', 'TWPhrasesCustom', 'TW2Tai', 'TaiwanQualityTW2'],
  twp: ['TWVariants', 'TWPhrasesIT', 'TWPhrasesName', 'TWPhrasesOther', 'TaiwanQualityTWP'],
  jp: ['JPVariants'],
};

export const presets = [
  {
    filename: 'full',
    from: Object.keys(variants2standard),
    to: Object.keys(standard2variants)
  },
  {
    filename: 'cn2t',
    from: ['cn'],
    to: ['hk', 'tw', 'tw2', 'twp', 'jp']
  },
  {
    filename: 't2cn',
    from: ['hk', 'tw', 'tw2', 'twp', 'jp'],
    to: ['cn']
  }
];
