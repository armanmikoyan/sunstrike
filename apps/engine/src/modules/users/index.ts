import * as service from "./service";

/** Application profiles, linked to Supabase Auth identities. */
export const users = {
  getById: service.getById,
  provision: service.provision,
  syncEmail: service.syncEmail,
  getCurrentUser: service.getCurrentUser,
};

export type { ProvisionUserInput, UserProfile } from "./types";
