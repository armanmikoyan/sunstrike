export type Row = Record<string, unknown>;

export interface Transaction {
  query<T = Row>(text: string, values?: unknown[]): Promise<T[]>;
}
