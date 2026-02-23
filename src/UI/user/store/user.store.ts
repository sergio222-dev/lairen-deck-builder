import { createContextId, useStore }       from '@builder.io/qwik';
import type { USER_STORE, UserStoreState } from '~/UI/user/models/user.model';

export const userStoreInitialState: UserStoreState = {
  user: null
};

export const useUserStore = (initialState: UserStoreState | null = null) => {
  return useStore({
    ...userStoreInitialState,
    ...initialState
  });
};

export const USER_CONTEXT = createContextId<USER_STORE>('USER_CONTEXT');
