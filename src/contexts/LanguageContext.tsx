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
  
  // Common
  welcome: { en: 'Welcome back', ta: 'மீண்டும் வரவேற்கிறோம்' },
  totalBalance: { en: 'Total Balance', ta: 'மொத்த இருப்பு' },
  income: { en: 'Income', ta: 'வருமானம்' },
  expenses: { en: 'Expenses', ta: 'செலவுகள்' },
  savings: { en: 'Savings', ta: 'சேமிப்பு' },
  
  // Investment
  mutualFunds: { en: 'Mutual Funds', ta: 'மியூச்சுவல் ஃபண்டுகள்' },
  sipCalculator: { en: 'SIP Calculator', ta: 'SIP கணிப்பான்' },
  fdCalculator: { en: 'FD Calculator', ta: 'FD கணிப்பான்' },
  rdCalculator: { en: 'RD Calculator', ta: 'RD கணிப்பான்' },
  goldInvestment: { en: 'Gold Investment', ta: 'தங்க முதலீடு' },
  stocks: { en: 'Stocks', ta: 'பங்குகள்' },
  
  // Calculator labels
  monthlyAmount: { en: 'Monthly Investment (₹)', ta: 'மாதாந்திர முதலீடு (₹)' },
  expectedReturn: { en: 'Expected Return (%)', ta: 'எதிர்பார்க்கப்படும் வருமானம் (%)' },
  investmentPeriod: { en: 'Investment Period (Years)', ta: 'முதலீட்டு காலம் (ஆண்டுகள்)' },
  principalAmount: { en: 'Principal Amount (₹)', ta: 'அசல் தொகை (₹)' },
  interestRate: { en: 'Interest Rate (%)', ta: 'வட்டி விகிதம் (%)' },
  totalInvestment: { en: 'Total Investment', ta: 'மொத்த முதலீடு' },
  estimatedReturns: { en: 'Estimated Returns', ta: 'மதிப்பிடப்பட்ட வருமானம்' },
  totalValue: { en: 'Total Value', ta: 'மொத்த மதிப்பு' },
  maturityAmount: { en: 'Maturity Amount', ta: 'முதிர்வு தொகை' },
  calculate: { en: 'Calculate', ta: 'கணக்கிடு' },
  
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
