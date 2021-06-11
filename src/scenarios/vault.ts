import { formatUnits } from '@ethersproject/units'

export const deposit = async (vault, token, account, amount) => {
  console.log('deposit to vault', amount)

  const currentBalance = await vault.balanceOf(token, account)
  console.log('current balance', formatUnits(currentBalance))

  const response = await vault.deposit(token, account, account, amount)
  const receipt = await response.wait()
  console.log('receipt', receipt)

  const balance = await vault.balanceOf(token, account)
  console.log('balance', formatUnits(balance))
}

export const withdraw = async (vault, token, account, amount) => {
  console.log('withdraw from vault', amount)

  const currentBalance = await vault.balanceOf(token, account)
  console.log('current balance', formatUnits(currentBalance))

  const response = await vault.withdraw(token, account, account, amount)
  const receipt = await response.wait()
  console.log('receipt', receipt)

  const balance = await vault.balanceOf(token, account)
  console.log('balance', formatUnits(balance))
}
