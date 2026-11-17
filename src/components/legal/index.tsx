import { privacyDocument, termsDocument } from "./constants";
import { LegalDocumentView } from "./legal-document";

export function PrivacyPolicy() {
  return <LegalDocumentView document={privacyDocument} />;
}

export function TermsOfService() {
  return <LegalDocumentView document={termsDocument} />;
}
