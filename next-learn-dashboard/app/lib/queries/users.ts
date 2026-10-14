import type { User } from '../definitions';
import { users } from '../placeholder-data';

export async function getUsers(): Promise<User[]> {
  return users.map((user) => ({ ...user }));
}

export async function getUserByEmail(
  email: string,
): Promise<User | undefined> {
  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalized);
}
