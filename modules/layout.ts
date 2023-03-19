import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const namespace = 'layout';

export interface GlobalState {
  layout?: string;
}

const initialState: GlobalState = {
  layout: 'layout',
};
// 创建带有命名空间的reducer
export const globalSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<GlobalState>) => {
      const { layout } = action.payload;
      state.layout = layout;
    },
  },
  extraReducers: () => {},
});

export const { setLayout } = globalSlice.actions;

export default globalSlice.reducer;
