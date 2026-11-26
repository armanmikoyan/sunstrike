export interface SignedUpload {
  /** One-time URL the client `PUT`s the file body to. */
  url: string;
  token: string;
}

export interface StoredObject {
  sizeBytes: number;
  contentType: string | null;
}
