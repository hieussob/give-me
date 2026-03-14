// Medicine data loader with i18n support
// Vietnamese data loaded statically (default language).
// English data is loaded on demand to keep the initial bundle small (~320KB saved).
import * as medicineDataVi from './medicineData.js'

const cachedData = { vi: medicineDataVi }

export function getMedicineData(language = 'vi') {
  return cachedData[language] || cachedData.vi
}

export async function loadMedicineData(language = 'vi') {
  if (cachedData[language]) return cachedData[language]
  if (language === 'en') {
    cachedData.en = await import('./medicineData.en.js')
  }
  return cachedData[language] || cachedData.vi
}

// Export default Vietnamese data for backward compatibility
export const { alphabetCategories, familyCategories, categories, medicines } = medicineDataVi
