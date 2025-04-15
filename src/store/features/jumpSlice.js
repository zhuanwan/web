/**
 * A(页面)和B(详情页)之间的跳转参数传递
 */
import { createSlice } from '@reduxjs/toolkit';

export const jumpSlice = createSlice({
    name: 'jump',
    initialState: {
        jumpParams: {}, // 跳转参数 {pathnameA: data, pathnameB: data}
    },
    reducers: {
        // 设置单个路径 参数
        setJumpParams: (state, action) => {
            const { pathname, data } = action.payload;
            state.jumpParams = { ...state.jumpParams, [pathname]: { ...state.jumpParams[pathname], ...data } };
        },
        // 重设整个路径 参数
        resetJumpParams: (state, action) => {
            state.jumpParams = action.payload;
        },
    },
});

export const { setJumpParams, resetJumpParams } = jumpSlice.actions;

export default jumpSlice.reducer;
