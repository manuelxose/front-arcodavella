// Inside SignUpComponent

// Add this function to evaluate password strength
export function evaluatePasswordStrength(password: string): number {
  let strength = 0;

  // Check the length of the password
  if (password.length >= 8) {
    strength += 1;
  }

  // Check if password contains both lowercase and uppercase characters
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    strength += 1;
  }

  // Check if password contains numbers
  if (/\d/.test(password)) {
    strength += 1;
  }

  // Check if password contains special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 1;
  }

  return strength; // Maximum strength is 4
}
