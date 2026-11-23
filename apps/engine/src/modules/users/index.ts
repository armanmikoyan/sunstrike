import * as service from "./service";

/** Application profiles, keyed by the Supabase Auth user id. */
export const users = {
  getById: service.getById,
  provision: service.provision,
  syncEmail: service.syncEmail,
  getCurrentUser: service.getCurrentUser,
};

export type { ProvisionUserInput, UserProfile } from "./types";
