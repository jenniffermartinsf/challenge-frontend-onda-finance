export type AuthUser = {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  branch: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
};
