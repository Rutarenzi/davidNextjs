const demoPasswords: Readonly<Record<string, string>> = {
  'demo@acme.com': 'demo123',
  'viewer@acme.com': 'viewer123',
};

export function verifyDemoCredentials(
  email: string,
  password: string,
): boolean {
  return demoPasswords[email.trim().toLowerCase()] === password;
}
