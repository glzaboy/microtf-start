import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import defaultSettings from '@/settings.json';

// import { version } from "../../../package.json";

const namespace = 'global';

export interface GlobalState {
  // settings?: typeof defaultSettings;
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    permissions: Record<string, string[]>;
  };
  userDate?: Date;
  userLoading?: boolean;
  lang?: 'zh-CN' | 'en-US';
  theme?: string;
}

const initialState: GlobalState = {
  // settings: defaultSettings,
  userInfo: {
    permissions: {},
  },
  theme: 'light',
};
// 创建带有命名空间的reducer
const globalSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    // updateSettings: (state, action: PayloadAction<GlobalState>) => {
    //   const { settings } = action.payload;
    //   state.settings = settings;
    // },
    updateUserInfo: (state, action: PayloadAction<GlobalState>) => {
      const { userInfo = initialState.userInfo, userLoading } = action.payload;
      state.userInfo = userInfo;
      state.userLoading = userLoading;
    },
    setLang: (state, action: PayloadAction<GlobalState>) => {
      const { lang } = action.payload;
      state.lang = lang;
    },
    setTheme: (state, action: PayloadAction<GlobalState>) => {
      const { theme } = action.payload;
      state.theme = theme;
    },
    updateUserReq: (state) => {
      state.userDate = new Date();
    },
  },
  extraReducers: () => {},
});

export const {
  // updateSettings
  updateUserInfo,
  setLang,
  setTheme,
  updateUserReq,
} = globalSlice.actions;

export default globalSlice.reducer;
