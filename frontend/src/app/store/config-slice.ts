import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ConfigSliceProps {
  isInit: boolean
  accessToken: string | null,
  userId: number | null
}

const initialState: ConfigSliceProps = {
  isInit: false,
  accessToken: null,
  userId: null
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
    },
    setUserId: (state, action: PayloadAction<number|null>) => {
      state.userId = action.payload
    }
  }
})

export const { setAccessToken, setInit, setUserId } = configSlice.actions
export default configSlice.reducer