// import React, { createContext, useContext, useEffect, useState } from "react";

// const LanguageContext = createContext();

// const supportedLanguages = {
//   en: "English",
//   ta: "தமிழ்",
//   hi: "हिन्दी",
//   ne: "नेपाली",
//   si: "සිංහල",
// };

// const translations = {
//   en: {
//     home: {
//       communitySupport: "Community Support Platform",
//       signIn: "Sign in",
//       getStarted: "Get Started",
//       heading: "Reconnecting people with the support they need.",
//       description:
//         "ReConnect helps displaced communities connect with organizations, resources, and support available in their region.",
//       regionSupport: "Region-based support",
//       verifiedOrganizations: "Verified organizations",
//       secureAccess: "Secure access",
//       connected: "Connected",
//       supportStartsHere: "Support starts here",
//       connectResources:
//         "Connect with organizations and resources available in your region.",
//       community: "Community",
//       assistance: "Assistance",
//       available: "Available",
//       footer: "ReConnect — Community Support Platform",
//     },
//   },

//   ta: {
//     home: {
//       communitySupport: "சமூக ஆதரவு தளம்",
//       signIn: "உள்நுழைக",
//       getStarted: "தொடங்குங்கள்",
//       heading: "உங்களுக்குத் தேவையான ஆதரவுடன் மக்களை மீண்டும் இணைத்தல்.",
//       description:
//         "ReConnect இடம்பெயர்ந்த சமூகங்களை அவர்களின் பிராந்தியத்தில் கிடைக்கும் நிறுவனங்கள், வளங்கள் மற்றும் ஆதரவுடன் இணைக்கிறது.",
//       regionSupport: "பிராந்திய அடிப்படையிலான ஆதரவு",
//       verifiedOrganizations: "சரிபார்க்கப்பட்ட நிறுவனங்கள்",
//       secureAccess: "பாதுகாப்பான அணுகல்",
//       connected: "இணைக்கப்பட்டுள்ளது",
//       supportStartsHere: "ஆதரவு இங்கே தொடங்குகிறது",
//       connectResources:
//         "உங்கள் பிராந்தியத்தில் கிடைக்கும் நிறுவனங்கள் மற்றும் வளங்களுடன் இணைக்கவும்.",
//       community: "சமூகம்",
//       assistance: "உதவி",
//       available: "கிடைக்கிறது",
//       footer: "ReConnect — சமூக ஆதரவு தளம்",
//     },
//   },

//   hi: {
//     home: {
//       communitySupport: "सामुदायिक सहायता प्लेटफ़ॉर्म",
//       signIn: "साइन इन",
//       getStarted: "शुरू करें",
//       heading: "लोगों को उनकी ज़रूरत के समर्थन से फिर से जोड़ना।",
//       description:
//         "ReConnect विस्थापित समुदायों को उनके क्षेत्र में उपलब्ध संगठनों, संसाधनों और सहायता से जोड़ता है।",
//       regionSupport: "क्षेत्र आधारित सहायता",
//       verifiedOrganizations: "सत्यापित संगठन",
//       secureAccess: "सुरक्षित पहुँच",
//       connected: "जुड़ा हुआ",
//       supportStartsHere: "सहायता यहाँ से शुरू होती है",
//       connectResources:
//         "अपने क्षेत्र में उपलब्ध संगठनों और संसाधनों से जुड़ें।",
//       community: "समुदाय",
//       assistance: "सहायता",
//       available: "उपलब्ध",
//       footer: "ReConnect — सामुदायिक सहायता प्लेटफ़ॉर्म",
//     },
//   },

//   ne: {
//     home: {
//       communitySupport: "समुदाय सहयोग प्लेटफर्म",
//       signIn: "साइन इन",
//       getStarted: "सुरु गर्नुहोस्",
//       heading: "मानिसहरूलाई आवश्यक सहयोगसँग पुनः जोड्दै।",
//       description:
//         "ReConnect ले विस्थापित समुदायहरूलाई उनीहरूको क्षेत्रमा उपलब्ध संस्था, स्रोत र सहयोगसँग जोड्छ।",
//       regionSupport: "क्षेत्र आधारित सहयोग",
//       verifiedOrganizations: "प्रमाणित संस्थाहरू",
//       secureAccess: "सुरक्षित पहुँच",
//       connected: "जडान गरिएको",
//       supportStartsHere: "सहयोग यहाँबाट सुरु हुन्छ",
//       connectResources:
//         "तपाईंको क्षेत्रमा उपलब्ध संस्था र स्रोतहरूसँग जोडिनुहोस्।",
//       community: "समुदाय",
//       assistance: "सहायता",
//       available: "उपलब्ध",
//       footer: "ReConnect — समुदाय सहयोग प्लेटफर्म",
//     },
//   },

//   si: {
//     home: {
//       communitySupport: "ප්‍රජා සහාය වේදිකාව",
//       signIn: "පිවිසෙන්න",
//       getStarted: "ආරම්භ කරන්න",
//       heading: "මිනිසුන්ට අවශ්‍ය සහාය සමඟ නැවත සම්බන්ධ කිරීම.",
//       description:
//         "ReConnect අවතැන් වූ ප්‍රජාවන් ඔවුන්ගේ ප්‍රදේශයේ ඇති සංවිධාන, සම්පත් සහ සහාය සමඟ සම්බන්ධ කරයි.",
//       regionSupport: "ප්‍රදේශය මත පදනම් වූ සහාය",
//       verifiedOrganizations: "තහවුරු කළ සංවිධාන",
//       secureAccess: "ආරක්ෂිත ප්‍රවේශය",
//       connected: "සම්බන්ධයි",
//       supportStartsHere: "සහාය මෙතැනින් ආරම්භ වේ",
//       connectResources:
//         "ඔබගේ ප්‍රදේශයේ ඇති සංවිධාන සහ සම්පත් සමඟ සම්බන්ධ වන්න.",
//       community: "ප්‍රජාව",
//       assistance: "සහාය",
//       available: "ලබා ගත හැකිය",
//       footer: "ReConnect — ප්‍රජා සහාය වේදිකාව",
//     },
//   },
// };

// const detectBrowserLanguage = () => {
//   const browserLanguage = navigator.language?.split("-")[0];

//   if (supportedLanguages[browserLanguage]) {
//     return browserLanguage;
//   }

//   return "en";
// };

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState(() => {
//     const savedLanguage = localStorage.getItem("reconnectLanguage");

//     if (savedLanguage && supportedLanguages[savedLanguage]) {
//       return savedLanguage;
//     }

//     return detectBrowserLanguage();
//   });

//   useEffect(() => {
//     localStorage.setItem("reconnectLanguage", language);
//   }, [language]);

//   const changeLanguage = (newLanguage) => {
//     if (supportedLanguages[newLanguage]) {
//       setLanguage(newLanguage);
//     }
//   };

//   const t = (key) => {
//     const keys = key.split(".");
//     let value = translations[language];

//     for (const currentKey of keys) {
//       value = value?.[currentKey];
//     }

//     return value || key;
//   };

//   return (
//     <LanguageContext.Provider
//       value={{
//         language,
//         changeLanguage,
//         supportedLanguages,
//         t,
//       }}
//     >
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => {
//   const context = useContext(LanguageContext);

//   if (!context) {
//     throw new Error("useLanguage must be used inside LanguageProvider");
//   }

//   return context;
// };
