import { defaultAbiCoder } from 'ethers/lib/utils'
import { formatUnits } from '@ethersproject/units'

import signMessage from './sign'
import { CT_ADDRESS, BT_ADDRESS, DBT_ADDRESS } from '../config/blacksmith'

const COLLATERAL_DEPOSIT = 1;
const BORROW_ASSET_DEPOSIT = 2;
const REPAY = 3;
const REDEEM = 4;
const WITHDRAW_COLLATERAL = 5;
const VAULT_DEPOSIT = 6;
const VAULT_WITHDRAW = 7;
const VAULT_TRANSFER = 8;
const VAULT_APPROVE_CONTRACT = 9;

export const depositCT = async (library, account, vault, lendingPair, amount = 1000) => {
  console.log('start deposit collateral', amount)

  const currentBalance = await lendingPair.collateralOfAccount(account)
  console.log('current balance', formatUnits(currentBalance))

  console.log('sign message')
  const { v, r, s } = await signMessage(library, vault, account, lendingPair, true)

  console.log('deposit', amount)
  const response = await lendingPair.warp(
    [VAULT_APPROVE_CONTRACT, COLLATERAL_DEPOSIT],
    [
      defaultAbiCoder.encode(
        ['address', 'address', 'bool', 'uint8','bytes32', 'bytes32'],
        [account, lendingPair.address, true, v, r, s]
      ),
      defaultAbiCoder.encode(
        ['address', 'uint256'],
        [account, amount]
      )
    ]
  )
  const receipt = await response.wait()
  console.log('receipt', receipt)

  const balance = await lendingPair.collateralOfAccount(account)
  console.log('current balance', formatUnits(balance))

  const shares = await vault.balanceOf(CT_ADDRESS, lendingPair.address)
  console.log('lending pair account shares', formatUnits(shares))
}

export const depositBT = async (library, account, vault, bwt, lendingPair, amount = 1000) => {
  console.log('start depost borrow asset', amount)

  const currentBalance = await bwt.balanceOf(account)
  console.log('current balance', formatUnits(currentBalance))

  console.log('sign message')
  const { v, r, s } = await signMessage(library, vault, account, lendingPair, true)

  console.log('deposit', amount)
  const response = await lendingPair.warp(
    [VAULT_APPROVE_CONTRACT, BORROW_ASSET_DEPOSIT],
    [
      defaultAbiCoder.encode(
        ['address', 'address', 'bool', 'uint8','bytes32', 'bytes32'],
        [account, lendingPair.address, true, v, r, s]
      ),
      defaultAbiCoder.encode(
        ['address', 'uint256'],
        [account, amount]
      )
    ]
  )
  const receipt = await response.wait()
  console.log('receipt', receipt)

  const balance = await bwt.balanceOf(account)
  console.log('current balance', formatUnits(balance))
}

export const borrow = async (vault, lendingPair, dbtContract, account, amount = 1000) => {
  console.log('borrow', amount)
  let balance = (await vault.balanceOf(BT_ADDRESS, account))
  console.log('borrow asset balance', formatUnits(balance))

  let ldBalance = (await vault.balanceOf(BT_ADDRESS, lendingPair.address))
  console.log('lending pair balance', formatUnits(balance))

  const response = await lendingPair.borrow(amount, account)
  const receipt = await response.wait()
  console.log('receipt', receipt)

  balance = (await vault.balanceOf(BT_ADDRESS, account))
  console.log('borrow asset balance', formatUnits(balance))

  ldBalance = (await vault.balanceOf(BT_ADDRESS, lendingPair.address))
  console.log('lending pair balance', formatUnits(balance))

  const dbtBalance = (await dbtContract.balanceOf(account))
  console.log('debt token balance', formatUnits(dbtBalance))
}

export const repay = async (vault, lendingPair, dbtContract, account, amount = 1000) => {
  console.log('repay', amount)
  let balance = (await vault.balanceOf(BT_ADDRESS, account))
  console.log('repay asset balance', formatUnits(balance))

  let ldBalance = (await vault.balanceOf(BT_ADDRESS, lendingPair.address))
  console.log('lending pair balance', formatUnits(balance))

  const response = await lendingPair.repay(amount, account)
  const receipt = await response.wait()
  console.log('receipt', receipt)

  balance = (await vault.balanceOf(BT_ADDRESS, account))
  console.log('repay asset balance', formatUnits(balance))

  ldBalance = (await vault.balanceOf(BT_ADDRESS, lendingPair.address))
  console.log('lending pair balance', formatUnits(balance))

  const dbtBalance = (await dbtContract.balanceOf(account))
  console.log('debt token balance', formatUnits(dbtBalance))}
