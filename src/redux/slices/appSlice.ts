import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../store'
import { ConnectorNames } from '../../connectors'

export type ConnectorType = ConnectorNames | null

interface AppState {
  connectModalOpen: boolean,
  connector: ConnectorType,
  connecting: boolean,
  balance: Balance
}

interface Balance {
  eth: number,
  dai: number
}

const initialState = {
  connectModalOpen: false,
  connector: null,
  connecting: false,
  balance: {
    eth: 0,
    dai: 0
  } as Balance
} as AppState;

export const appSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleConnectorModal: (state, action: PayloadAction<boolean>) => {
      state.connectModalOpen = action.payload
    },
    connect: (state, action: PayloadAction<ConnectorType>) => {
      state.connector = action.payload
      state.connecting = true
    },
    connectComplete: (state) => {
      state.connecting = false
    },
    disconnect: (state) => {
      state.connector = null
      state.connecting = false
    },
    updateBalance: (state, action: PayloadAction<Balance>) => {
      state.balance = action.payload
    }
  },
});

export const {
  toggleConnectorModal,
  connect,
  connectComplete,
  disconnect,
  updateBalance
} = appSlice.actions

export const connectModalOpen = (state: RootState) => state.app.connectModalOpen
export const connector = (state: RootState) => state.app.connector
export const connecting = (state: RootState) => state.app.connecting
export const getBalance = (state: RootState): Balance => state.app.balance

export default appSlice.reducer;
