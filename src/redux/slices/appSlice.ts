import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BigNumber } from 'ethers'

import { RootState } from '../store'
import { ConnectorNames } from '../../connectors'

export type ConnectorType = ConnectorNames | null

interface AppState {
  connectModalOpen: boolean,
  connector: ConnectorType,
  connecting: boolean,
  balance: BalanceType
}

export interface BalanceType {
  eth?: Number,
  bt?: Number,
  ct?: Number
}

const initialState = {
  connectModalOpen: false,
  connector: null,
  connecting: false,
  balance: {
    eth: 0,
    bt: 0,
    ct: 0
  } as BalanceType
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
    updateBalance: (state, action: PayloadAction<BalanceType>) => {
      state.balance = {...state.balance, ...action.payload}
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
export const getConnector = (state: RootState) => state.app.connector
export const getConnecting = (state: RootState) => state.app.connecting
export const getBalance = (state: RootState): BalanceType => state.app.balance

export default appSlice.reducer;
