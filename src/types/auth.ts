export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface UseAuthReturn {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}