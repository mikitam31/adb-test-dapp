import { Web3Provider } from '@ethersproject/providers'

import {
  injected,
  network,
  walletconnect,
  walletlink,
  ledger,
  trezor,
  lattice,
  frame,
  authereum,
  fortmatic,
  magic,
  portis,
  torus
} from './connectors'

export enum ConnectorNames {
  Injected      = 'Injected',
  Network       = 'Network',
  WalletConnect = 'WalletConnect',
  WalletLink    = 'WalletLink',
  Ledger        = 'Ledger',
  Trezor        = 'Trezor',
  Lattice       = 'Lattice',
  Frame         = 'Frame',
  Authereum     = 'Authereum',
  Fortmatic     = 'Fortmatic',
  Magic         = 'Magic',
  Portis        = 'Portis',
  Torus         = 'Torus'
}

export type ConnectorType = ConnectorNames | null

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.Network]: network,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Ledger]: ledger,
  [ConnectorNames.Trezor]: trezor,
  [ConnectorNames.Lattice]: lattice,
  [ConnectorNames.Frame]: frame,
  [ConnectorNames.Authereum]: authereum,
  [ConnectorNames.Fortmatic]: fortmatic,
  [ConnectorNames.Magic]: magic,
  [ConnectorNames.Portis]: portis,
  [ConnectorNames.Torus]: torus
}

export const getLibrary = (provider: any): Web3Provider => {
  const library = new Web3Provider(provider)
  return library
}
