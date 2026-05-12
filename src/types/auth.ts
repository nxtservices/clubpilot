// User and authentication types
export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export type SignUpData = {
  email: string;
  password: string;
  fullName: string;
};

export type SignInData = {
  email: string;
  password: string;
};
