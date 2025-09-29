export type UserResponse = {
  uid: string;
  email: string | null;
};

export type ErrorResponse = {
  error: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type ServerUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
};
