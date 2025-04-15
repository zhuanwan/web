import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { LoadStateEnum } from '@/const'

export const fetchGlobalData = createAsyncThunk(
  'UserState/fetchGlobalData',
  async (showLoading = true, { dispatch }) => {
    const { setFactoryList, setFactory, changeLoadState } = globalSlice.actions
    if (showLoading) {
      dispatch(changeLoadState(LoadStateEnum.LOADING))
    }

    // // 请求工厂
    // const [err1, res1] = await errorCaptureRes(fetchCompanys)
    // if (err1) {
    //   if (showLoading) {
    //     dispatch(changeLoadState(LoadStateEnum.FAIL))
    //   }
    //   return
    // }

    dispatch(setFactoryList([]))
    dispatch(setFactory({}))

    // 所有接口请求完成后
    if (showLoading) {
      dispatch(changeLoadState(LoadStateEnum.SUCCESS))
    }
  }
)

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    factoryList: [],
    factory: {},
  },
  reducers: {
    setFactoryList: (state, action) => {
      state.factoryList = action.payload
    },
    setFactory: (state, action) => {
      state.factory = action.payload
    },
    changeLoadState: (state, action) => {
      state.loadState = action.payload
    },
  },
})

export const { setFactoryList, setFactory, changeLoadState } = globalSlice.actions

export default globalSlice.reducer
