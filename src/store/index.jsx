import { configureStore } from '@reduxjs/toolkit'

import global from './features/globalSlice'
import jump from './features/jumpSlice'

const store = configureStore({
  reducer: {
    jump,
    global,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
