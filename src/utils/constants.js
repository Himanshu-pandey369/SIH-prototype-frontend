// Supported languages
export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'sat', label: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
];

// Supported Industries
export const INDUSTRIES = [
  { value: 'mining', label: 'Mining Operations' },
  { value: 'steel', label: 'Steel Manufacturing' },
  { value: 'mica', label: 'Mica Extraction & Processing' },
  { value: 'other', label: 'General Heavy Industry' },
];

// Prototype Module Info
export const PROTOTYPE_MODULE = {
  code: 'SPACE_HAZARD',
  name: 'Confined Space & Space Hazard Safety',
  shortTitle: 'Space Hazard Safety',
  description: 'Industrial safety training for confined space entry, atmospheric testing (O2 deficiency, H2S, CO), forced ventilation, LOTO, and emergency rescue.',
  passThreshold: 75,
  totalQuestions: 5,
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'ai_safe_token',
  USER: 'ai_safe_user',
};
