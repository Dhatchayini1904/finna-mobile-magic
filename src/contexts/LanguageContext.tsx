import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ta';

interface Translations {
  [key: string]: {
    en: string;
    ta: string;
  };
}

const translations: Translations = {
  // Navigation
  dashboard: { en: 'Dashboard', ta: 'டாஷ்போர்டு' },
  transactions: { en: 'Transactions', ta: 'பரிவர்த்தனைகள்' },
  investments: { en: 'Investments', ta: 'முதலீடுகள்' },
  budget: { en: 'Budget', ta: 'பட்ஜெட்' },
  goals: { en: 'Goals', ta: 'இலக்குகள்' },
  bills: { en: 'Bills', ta: 'பில்கள்' },
  learn: { en: 'Learn', ta: 'கற்றுக்கொள்' },
  settings: { en: 'Settings', ta: 'அமைப்புகள்' },
  help: { en: 'Help', ta: 'உதவி' },
  news: { en: 'News', ta: 'செய்திகள்' },
  aiChat: { en: 'AI Chat', ta: 'AI அரட்டை' },
  main: { en: 'Main', ta: 'முக்கியமானவை' },
  tools: { en: 'Tools', ta: 'கருவிகள்' },
  logout: { en: 'Sign Out', ta: 'வெளியேறு' },

  // Common
  welcome: { en: 'Welcome back', ta: 'மீண்டும் வரவேற்கிறோம்' },
  financialOverview: { en: 'Here\'s your financial overview', ta: 'உங்கள் நிதி கண்ணோட்டம் இதோ' },
  totalBalance: { en: 'Total Balance', ta: 'மொத்த இருப்பு' },
  income: { en: 'Income', ta: 'வருமானம்' },
  expenses: { en: 'Expenses', ta: 'செலவுகள்' },
  savings: { en: 'Savings', ta: 'சேமிப்பு' },
  searchPlaceholder: { en: 'Search everything...', ta: 'அனைத்தையும் தேடுங்கள்...' },
  account: { en: 'Account', ta: 'கணக்கு' },
  premiumAccount: { en: 'Premium Account', ta: 'பிரீமியம் கணக்கு' },

  // Dashboard Stats
  monthlyBudget: { en: 'Monthly Budget', ta: 'மாத பட்ஜெட்' },
  creditScore: { en: 'Credit Score', ta: 'கிரெடிட் ஸ்கோர்' },
  savingsGoal: { en: 'Savings Goal', ta: 'சேமிப்பு இலக்கு' },
  // Investment
  mutualFunds: { en: 'Mutual Funds', ta: 'மியூச்சுவல் ஃபண்டுகள்' },
  sipCalculator: { en: 'SIP Calculator', ta: 'SIP கணிப்பான்' },
  fdCalculator: { en: 'FD Calculator', ta: 'FD கணிப்பான்' },
  rdCalculator: { en: 'RD Calculator', ta: 'RD கணிப்பான்' },
  goldInvestment: { en: 'Gold Investment', ta: 'தங்க முதலீடு' },
  stocks: { en: 'Stocks', ta: 'பங்குகள்' },
  lumpSum: { en: 'Lump Sum', ta: 'மொத்த முதலீடு' },

  // News
  marketNews: { en: 'Market News', ta: 'சந்தை செய்திகள்' },
  syncFeeds: { en: 'Sync Feeds', ta: 'புதுப்பித்தல்' },
  today: { en: 'Today', ta: 'இன்று' },
  yesterday: { en: 'Yesterday', ta: 'நேற்று' },
  readArticle: { en: 'Read Article', ta: 'கட்டுரையைப் படிக்கவும்' },

  // AI Chat
  askFinNava: { en: 'Ask FINNAVA', ta: 'FINNAVA-வை கேளுங்கள்' },
  typeMessage: { en: 'Type your message...', ta: 'உங்கள் செய்தியை தட்டச்சு செய்யுங்கள்...' },
  thinking: { en: 'Thinking...', ta: 'யோசிக்கிறது...' },
  speakToMe: { en: 'Speak to me', ta: 'என்னிடம் பேசுங்கள்' },

  // Prompts
  howMuchCanISave: { en: 'How much can I save?', ta: 'நான் எவ்வளவு சேமிக்க முடியும்?' },
  bestInvestmentOptions: { en: 'Best investment options', ta: 'சிறந்த முதலீட்டு விருப்பங்கள்' },
  explainSIP: { en: 'Explain SIP to me', ta: 'SIP-ஐ விளக்குங்கள்' },
  taxSavingTips: { en: 'Tax saving tips', ta: 'வரி சேமிப்பு குறிப்புகள்' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('finnava-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('finnava-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
