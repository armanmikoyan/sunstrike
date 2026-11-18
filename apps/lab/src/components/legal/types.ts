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

export type ContentsSection = Pick<LegalSection, "id" | "title">;

export type LegalSectionsProps = {
  sections: ContentsSection[];
};

export type LegalContentsProps = LegalSectionsProps & {
  contactEmail: string;
};

export type LegalDocumentViewProps = {
  document: LegalDocument;
};

export type LegalContentsNavProps = LegalSectionsProps & {
  activeId: string;
  onSelect: (id: string) => void;
};

export type LegalContentsContactProps = Pick<LegalContentsProps, "contactEmail">;
