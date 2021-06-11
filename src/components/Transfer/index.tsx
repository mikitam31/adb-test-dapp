import { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Chip, Button, ButtonGroup, Box, Paper } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider, TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { formatUnits, formatEther, parseUnits } from '@ethersproject/units'
import { BigNumber, utils } from 'ethers'
import { splitSignature } from 'ethers/lib/utils'
const { keccak256, toUtf8Bytes } = utils

import { getErrorMessage } from '../../connectors'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { getBalance, updateBalance } from '../../redux/slices/appSlice'
import { useVault, useLendingPair, useMT, useWT } from '../../hooks/useERC20'
import { BT_ADDRESS, VAULT_ADDRESS, DBT_ADDRESS, LP_ADDRESS, CT_ADDRESS, BWT_ADDRESS, CWT_ADDRESS } from '../../config/blacksmith'
import { _TypedDataEncoder } from "@ethersproject/hash";
import { LibraryAddTwoTone } from '@material-ui/icons'

import { deposit, withdraw } from '../../scenarios/vault'
import { depositCT, depositBT, borrow, repay } from '../../scenarios/lending-pair'
import approve from '../../scenarios/approve'

const VAULT_APPROVAL_TYPEHASH = keccak256(
  toUtf8Bytes('VaultAccessApproval(bytes32 warning,address user,address contract,bool approved,uint256 nonce)')
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      textAlign: 'center',
      margin: 'auto',
      marginTop: '5rem'
    },
  })
)

const Transfer = () => {
  const { account, library, chainId, deactivate, active, error } = useWeb3React<Web3Provider>()
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const vaultContract = useVault(VAULT_ADDRESS)
  const lpContract = useLendingPair(LP_ADDRESS)
  const ctContract = useMT(CT_ADDRESS)
  const btContract = useMT(BT_ADDRESS)
  const cwtContract = useWT(CWT_ADDRESS)
  const bwtContract = useWT(BWT_ADDRESS)
  const dbtContract = useMT(DBT_ADDRESS)
  const balance = useAppSelector(getBalance)
  const [content, setContent] = useState([])

  useEffect(() => {
    if (!!account && !!library) {
      let stale = false

      console.log('account', account)
      library.getBalance(account)
        .then((ethB: any) => {
          if (!stale) {
            dispatch(updateBalance({eth: parseFloat(formatEther(ethB))}))
          }
        })
        .catch(() => {
          if (!stale) {
            dispatch(updateBalance({eth: 0}))
          }
        })

      return () => {
        stale = true
        dispatch(updateBalance({eth: 0}))
      }
    }
  }, [account, library, chainId])

  useEffect(() => {
    if (ctContract) {
      ctContract.balanceOf(account).then((res: BigNumber) => (
        dispatch(updateBalance({ ct: parseFloat(formatEther(res)) }))
      ))
    }
  }, [account, library])

  return (
    <Container>
      <div className={classes.form}>
        <Box mb={2}>
          <Button variant="contained" onClick={() => approve(ctContract, VAULT_ADDRESS)}>Approve CT</Button>
          <Button variant="contained" onClick={() => approve(btContract, VAULT_ADDRESS)}>Approve BT</Button>
        </Box>
        <Box display="flex" mb={2} alignItems="center" justifyContent="center">
          <Box mr={1}>
            <Chip label="Vault" />
          </Box>
          <ButtonGroup color="primary" variant="contained">
            <Button onClick={() => deposit(vaultContract, CT_ADDRESS, account, 1000)}>Deposit CT</Button>
            <Button onClick={() => deposit(vaultContract, BT_ADDRESS, account, 1000)}>Deposit BT</Button>
            <Button onClick={() => withdraw(vaultContract, CT_ADDRESS, account, 1000)}>Withdraw</Button>
            <Button>Flashloan</Button>
          </ButtonGroup>
        </Box>
        <Box display="flex" mb={2} alignItems="center" justifyContent="center">
          <Box mr={1}>
            <Chip label="LendingPair" />
          </Box>
          <ButtonGroup color="primary" variant="contained">
            <Button onClick={() => depositCT(library, account, vaultContract, lpContract)}>Deposit CT</Button>
            <Button onClick={() => depositBT(library, account, vaultContract, bwtContract, lpContract)}>Deposit BT</Button>
            <Button onClick={() => repay(vaultContract, lpContract, dbtContract, account, 10)}>Repay</Button>
            <Button onClick={() => borrow(vaultContract, lpContract, dbtContract, account, 100)}>Borrow</Button>
          </ButtonGroup>
        </Box>
      </div>
    </Container>
  )
}

export default Transfer
