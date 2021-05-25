import { useState, useEffect, useCallback } from 'react'
import { Container, Typography, Button, Box, TextField, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider, TransactionResponse, TransactionReceipt } from '@ethersproject/providers'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { BigNumber } from 'ethers'

import { getErrorMessage } from '../../connectors'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { getBalance, updateBalance } from '../../redux/slices/appSlice'
import useERC20 from '../../hooks/useERC20'
import { DAI_ADDRESS } from '../../config/dai'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      minWidth: '25rem',
      maxWidth: '25rem',
      textAlign: 'center',
      margin: 'auto',
      marginTop: '10rem'
    },
    button: {
      minWidth: '15rem',
      marginBottom: '1rem',
    },
    link: {
      textDecoration: 'none'
    }
  })
)

const Transfer = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [transaction, setTransaction] = useState('')
  const [transactionError, setTransactionError] = useState('')
  const [receipt, setReceipt] = useState<TransactionReceipt>()
  const { account, library, chainId, deactivate, active, error } = useWeb3React<Web3Provider>()
  const daiToken = useERC20(DAI_ADDRESS)
  const balance = useAppSelector(getBalance)

  useEffect(() => {
    if (!!account && !!library) {
      let stale = false

      library.getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            dispatch(updateBalance({eth: balance}))
          }
        })
        .catch(() => {
          if (!stale) {
            dispatch(updateBalance({eth: BigNumber.from(0), dai: BigNumber.from(0)}))
          }
        })

      return () => {
        stale = true
        dispatch(updateBalance({eth: BigNumber.from(0), dai: BigNumber.from(0)}))
      }
    }
  }, [account, library, chainId, receipt])

  useEffect(() => {
    if (daiToken) {
      daiToken.balanceOf(account).then((res: BigNumber) => (
        dispatch(updateBalance({ dai: res }))
      ))
    }
  }, [account, library, receipt])

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (daiToken) {
      setTransactionError('')
      daiToken.transfer(address, parseUnits(amount, 18))
        .then((res: TransactionResponse) => {
          setTransaction(res.hash)
          return res.wait()
        })
        .then((res: TransactionReceipt) => {
          setTransaction('')
          setAmount('')
          setAddress('')
          setReceipt(res)
        })
        .catch((e: Error) => {
          setTransaction('')
          setTransactionError(`Message: ${e.message}`)
        })
    }
  }

  const handleHideSnackbar = () => {
    setReceipt(undefined)
  }

  const getReceiptDetail = () => {
    if (!!receipt) {
      return `Transaction ${receipt.transactionHash} to ${receipt.to} is complete`
    }

    return null
  }

  const daiBalance = balance.dai ? parseFloat(formatUnits(balance.dai)) : 0
  const amountError = amount ? parseFloat(amount) > daiBalance : false

  return (
    <Container>
      <div className={classes.form}>
        { error && (
          <Box textAlign="center">
            <Typography align="center">{getErrorMessage(error)}</Typography>

          </Box>
        )}


        {active && daiToken && (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              error={amountError}
              variant="filled"
              margin="normal"
              helperText={`Balance: ${daiBalance} DAI`}
              label="Enter Dai Amount"
              name="amount"
              onChange={handleAmount}
              disabled={!!transaction}
              value={amount}
            />
            <TextField
              fullWidth
              variant="filled"
              margin="normal"
              label="Enter recipient address"
              name="address"
              onChange={handleAddress}
              disabled={!!transaction}
              value={address}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={amountError || !address || !!transaction}
              className={classes.button}
            >
              { !!transaction ? 'WAITING...' : 'SEND' }
            </Button>

            { transaction && (
              <a href={`https://ropsten.etherscan.io/tx/${transaction}`} target="_blank" className={classes.link}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  VIEW ON EHTERSCAN
                </Button>
              </a>
            )}

            { transactionError && (
              <Typography color="secondary">{transactionError}</Typography>
            )}
          </form>
        )}

        { (error || active) && (
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => deactivate()}
          >
            DISCONNECT
          </Button>
        )}
      </div>

      { receipt && (
        <Snackbar open={!!receipt} autoHideDuration={6000} onClose={handleHideSnackbar}>
          <Alert onClose={handleHideSnackbar} severity="success">
            {getReceiptDetail()}
          </Alert>
        </Snackbar>
      )}

    </Container>
  )
}

export default Transfer
