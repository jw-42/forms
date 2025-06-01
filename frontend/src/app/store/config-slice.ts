import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ConfigSliceProps {
  isInit: boolean
  accessToken: string | null
}

const initialState: ConfigSliceProps = {
  isInit: false,
  accessToken: null
}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setInit: (state, action: PayloadAction<boolean>) => {
      state.isInit = action.payload
    },
    setAccessToken: (state, action: PayloadAction<string|null>) => {
      state.accessToken = action.payload
    }
  }
})

export const { setAccessToken, setInit } = configSlice.actions
export default configSlice.reducer