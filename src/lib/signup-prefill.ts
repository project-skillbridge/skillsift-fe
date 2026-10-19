/** Session-storage key used to carry an email into signup without putting it in the URL. */
export const SIGNUP_EMAIL_KEY = "skillsift:signup-email";

/** Reads the carried email once, then forgets it. */
export function takeSignupEmail(): string {
  try {
    const email = window.sessionStorage.getItem(SIGNUP_EMAIL_KEY) ?? "";
    window.sessionStorage.removeItem(SIGNUP_EMAIL_KEY);
    return email;
  } catch {
    return "";
  }
}
