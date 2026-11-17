export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  updatedIso: string;
  sections: LegalSection[];
  contactEmail: string;
};
