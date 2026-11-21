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

export async function getCurrentUser(userId: string): Promise<UserProfile> {
  const user = await repository.getById(userId);

  if (!user) throw notFound("User not found");

  return user;
}
