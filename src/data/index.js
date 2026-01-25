// Medicine data loader with i18n support
import * as medicineDataVi from './medicineData.js'
import * as medicineDataEn from './medicineData.en.js'

const dataByLanguage = {
  vi: medicineDataVi,
  en: {
    alphabetCategories: medicineDataEn.alphabetCategories,
    familyCategories: medicineDataEn.familyCategories,
    categories: medicineDataEn.categories,
    medicines: medicineDataEn.medicines
  }
}

export function getMedicineData(language = 'vi') {
  return dataByLanguage[language] || dataByLanguage.vi
}

// Export default Vietnamese data for backward compatibility
export const { alphabetCategories, familyCategories, categories, medicines } = medicineDataVi
