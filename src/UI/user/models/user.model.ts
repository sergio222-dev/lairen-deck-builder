export type UIUser = {
  id: string;
  email: string;
  avatar_url?: string;
}

export interface UserStoreState {
  user: UIUser | null;
}

export type USER_STORE = UserStoreState;
