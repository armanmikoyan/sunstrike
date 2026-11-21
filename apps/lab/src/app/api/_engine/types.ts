export type EngineHeaders = Record<string, string>;

export type EngineFailure = {
  ok: false;
  status: number;
  message: string;
};

export type EngineResult<T> =
  | {
      ok: true;
      data: T;
    }
  | EngineFailure;

export type EngineRequestOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
};
