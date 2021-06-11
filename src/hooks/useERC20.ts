import { useMemo } from 'react'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider, JsonRpcSigner } from '@ethersproject/providers'

import vaultABI from '../config/vaultABI.json'
import bep20Abi from '../config/erc20Abi.json'
import lpABI from '../config/lpABI.json'
import mtABI from '../config/mtABI.json'
import wtABI from '../config/wtABI.json'

const getSigner = (library: Web3Provider, account: string): JsonRpcSigner => {
  return library.getSigner(account).connectUnchecked()
}

const getProviderOrSigner = (library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner => {
  return account ? getSigner(library, account) : library
}

const getContract = (address: string, library: Web3Provider, abi, account?: string): Contract => {
  return new Contract(address, abi, getProviderOrSigner(library, account) as any)
}

const useERC20 = (address: string, abi, withSigner = true) => {
  const { library, account } = useWeb3React()

  return useMemo(() => {
    if (!library) return null

    try {
      return getContract(address, library, abi, withSigner && account ? account : undefined)
    } catch {
      return null
    }
  }, [address, library, withSigner, account])
}

export const useMT = (address: string) => {
  const contract = useERC20(address, mtABI);
  return contract;
}

export const useVault = (address: string) => {
  const contract = useERC20(address, vaultABI);
  return contract;
}

export const useLendingPair = (address: string) => {
  const contract = useERC20(address, lpABI);
  return contract;
}

export const useWT = (address: string) => {
  const contract = useERC20(address, wtABI);
  return contract
}

export default useERC20
