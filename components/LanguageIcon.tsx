import React from 'react';
import { De, En, Es, Fr, It, Nl, Pt, Ru, Ua } from '@/components/CustomIcons';

interface LanguageIconProps {
  language: string;
  size?: number;
  color?: string;
}

const languageIcons: { [key: string]: React.ComponentType<any> } = {
  de: De,
  en: En,
  es: Es,
  fr: Fr,
  it: It,
  nl: Nl,
  pt: Pt,
  ru: Ru,
  ua: Ua,
};

export function LanguageIcon({ language, size = 24, color }: LanguageIconProps) {
  const IconComponent = languageIcons[language.toLowerCase()];
  
  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} color={color} />;
} 