export type LoginSearchParams = {
  next?: string | string[];
  error?: string | string[];
};

export type LoginPageProps = {
  searchParams: Promise<LoginSearchParams>;
};
