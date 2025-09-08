import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// الترجمات
const resources = {
  ar: {
    translation: {
      latestNews: "آخر الأخبار",
      readMore: "اقرأ المزيد",
      categories: "الأقسام",
    },
  },
  en: {
    translation: {
      latestNews: "Latest News",
      readMore: "Read More",
      categories: "Categories",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar", // اللغة الافتراضية
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
