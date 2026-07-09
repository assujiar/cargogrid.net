export interface FeatureItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  iconName: string;
}

export interface IcpItem {
  id: string;
  title: string;
  titleEn?: string;
  badge: string;
  badgeEn?: string;
  desc: string;
  descEn?: string;
  pains: string[];
  painsEn?: string[];
  pitch: string;
  pitchEn?: string;
  personaName: string;
  personaRole: string;
  personaRoleEn?: string;
  personaFocus: string;
  personaFocusEn?: string;
  personaQuote: string;
  personaQuoteEn?: string;
}

export interface FlowStep {
  id: string;
  number: number;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  longDesc: string;
  longDescEn?: string;
  inputs: string[];
  inputsEn?: string[];
  outputs: string[];
  outputsEn?: string[];
  benefit: string;
  benefitEn?: string;
}

export interface PackageItem {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  desc: string;
  descEn?: string;
  fit: string;
  fitEn?: string;
  positioning: string;
  positioningEn?: string;
  features: string[];
  featuresEn?: string[];
  isPopular?: boolean;
  implementationNotes?: string;
  implementationNotesEn?: string;
  limitations?: string[];
  limitationsEn?: string[];
  addOns?: string[];
  addOnsEn?: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
}
