import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from 'react';
import { PromoCodesResponse, ShrineData, AppState } from '@/types';

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_PROMO_CODES'; payload: PromoCodesResponse }
  | { type: 'SET_SHRINE'; payload: ShrineData | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SHOW_TOAST'; payload: string }
  | { type: 'HIDE_TOAST' };

const initialState: AppState = {
  promoCodes: null,
  shrine: null,
  isLoading: true,
  isRefreshing: false,
  error: null,
  toastMessage: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_REFRESHING':
      return { ...state, isRefreshing: action.payload };
    case 'SET_PROMO_CODES':
      return { ...state, promoCodes: action.payload };
    case 'SET_SHRINE':
      return { ...state, shrine: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toastMessage: null };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
