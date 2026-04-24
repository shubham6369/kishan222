'use client';

import React, { createContext, useContext, ReactNode } from 'react';

type Dictionary = any;

interface LanguageContextType {
  lang: string;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  lang, 
  dict 
}: { 
  children: ReactNode; 
  lang: string; 
  dict: Dictionary;
}) {
  return (
    <LanguageContext.Provider value={{ lang, dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
