// Static credentials for scorers
// Store these in a separate JSON file in production
export const SCORER_CREDENTIALS = [
  { email: "scorer1@divisionwars.com", password: "scorer123" },
  { email: "scorer2@divisionwars.com", password: "scorer456" },
  { email: "admin@divisionwars.com", password: "admin789" },
];

export const validateCredentials = (email: string, password: string): boolean => {
  return SCORER_CREDENTIALS.some(
    (cred) => cred.email === email && cred.password === password
  );
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("divisionwars_auth") === "true";
};

export const setAuthenticated = (value: boolean): void => {
  if (value) {
    localStorage.setItem("divisionwars_auth", "true");
  } else {
    localStorage.removeItem("divisionwars_auth");
  }
};
