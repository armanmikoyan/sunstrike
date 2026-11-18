import { PRIVACY_DOCUMENT, TERMS_DOCUMENT } from "./constants";
import { LegalDocumentView } from "./legal-document";

export function PrivacyPolicy() {
  return <LegalDocumentView document={PRIVACY_DOCUMENT} />;
}

export function TermsOfService() {
  return <LegalDocumentView document={TERMS_DOCUMENT} />;
}
