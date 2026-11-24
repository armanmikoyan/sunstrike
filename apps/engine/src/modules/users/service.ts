import * as repository from "./repository";
import type { ProvisionUserInput, UserProfile } from "./types";
import { notFound } from "./utils";

export function getById(id: string): Promise<UserProfile | null> {
  return repository.getById(id);
}

export function provision(input: ProvisionUserInput): Promise<UserProfile> {
  return repository.upsert(input);
}

export async function syncEmail(id: string, email?: string): Promise<void> {
  if (!email) return;

  await repository.syncEmail(id, email);
}

/**
 * Fill in the avatar only while the profile has none. A person who signed in
 * with GitHub and later with Google keeps the GitHub face.
 */
export async function syncAvatar(id: string, avatarUrl?: string): Promise<void> {
  if (!avatarUrl) return;

  await repository.syncAvatar(id, avatarUrl);
}

export async function getCurrentUser(userId: string): Promise<UserProfile> {
  const user = await repository.getById(userId);

  if (!user) throw notFound("User not found");

  return user;
}
